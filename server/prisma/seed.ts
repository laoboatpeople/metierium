import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface ChapterData {
  number: number;
  name: string;
  nameEn: string;
  theoryContent: string;
}

interface QuestionData {
  chapter: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: string;
}

function loadJSON<T>(filePath: string): T[] {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`  ⚠️  File not found: ${fullPath}`);
    return [];
  }
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
}

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.question.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.trade.deleteMany();
  console.log('✅ Cleared existing data.');

  // ─── Create trades ──────────────────────────────────────────────
  const cmeg = await prisma.trade.create({
    data: {
      code: 'CMEQ',
      name: 'Electrician',
      nameFr: 'Électricien',
      description: 'Corporation des maîtres électriciens du Québec — Examen de certification',
    },
  });

  const cmmtq = await prisma.trade.create({
    data: {
      code: 'CMMTQ',
      name: 'Plumber',
      nameFr: 'Plombier',
      description: 'Corporation des maîtres mécaniciens en tuyauterie du Québec — Examen de certification',
    },
  });

  const qbq = await prisma.trade.create({
    data: {
      code: 'QBQ',
      name: 'Welder',
      nameFr: 'Soudeur',
      description: 'Québec Board of Trades — Examen de certification en soudage',
    },
  });

  console.log(`✅ Trades created: CMEQ (${cmeg.id}), CMMTQ (${cmmtq.id}), QBQ (${qbq.id})`);

  // ─── Helper: seed chapters for a trade ─────────────────────────
  async function seedChapters(tradeId: string, tradeCode: string, contentDir: string, defaultChapters: { number: number; name: string; nameFr: string }[]) {
    // Try loading from individual JSON files first
    const chaptersDir = path.join(__dirname, contentDir);
    let chapters: ChapterData[] = [];

    if (fs.existsSync(chaptersDir)) {
      // Try single chapters.json
      const allChapters = loadJSON<ChapterData>(path.join(contentDir, 'chapters.json'));
      if (allChapters.length > 0) {
        chapters = allChapters;
      } else {
        // Try individual ch*.json files
        const files = fs.readdirSync(chaptersDir).filter(f => f.startsWith('ch') && f.endsWith('.json') && f !== 'chapters.json');
        for (const file of files) {
          const chData = loadJSON<ChapterData>(path.join(contentDir, file));
          if (chData.length > 0) chapters.push(chData[0]);
          else {
            const singleCh = JSON.parse(fs.readFileSync(path.join(chaptersDir, file), 'utf-8'));
            if (singleCh && singleCh.number) chapters.push(singleCh);
          }
        }
      }
    }

    // If no files loaded, use defaults
    if (chapters.length === 0) {
      chapters = defaultChapters.map(ch => ({
        ...ch,
        nameFr: ch.nameFr || ch.name,
        nameEn: ch.name || ch.nameFr,
        theoryContent: `# ${ch.nameFr || ch.name}\n\nContenu en préparation pour ce chapitre. Revenez bientôt !`,
      }));
    }

    // Sort by number
    chapters.sort((a, b) => a.number - b.number);

    const createdChapters: { number: number; id: string }[] = [];
    for (const ch of chapters) {
      const created = await prisma.chapter.create({
        data: {
          tradeId,
          number: ch.number,
          name: ch.nameEn || ch.name,
          nameFr: ch.name,
          theoryContent: ch.theoryContent,
        },
      });
      createdChapters.push({ number: created.number, id: created.id });
    }

    // Load questions — support batch files with suffixes
    const questions = loadJSON<QuestionData>(path.join(contentDir, 'questions.json'))
      .concat(loadJSON<QuestionData>(path.join(contentDir, 'questions_more.json')))
      .concat(loadJSON<QuestionData>(path.join(contentDir, 'questions_batch2.json')))
      .concat(loadJSON<QuestionData>(path.join(contentDir, 'questions_batch2a.json')))
      .concat(loadJSON<QuestionData>(path.join(contentDir, 'questions_batch2b.json')))
      .concat(loadJSON<QuestionData>(path.join(contentDir, 'questions_batch2c.json')))
      .concat(loadJSON<QuestionData>(path.join(contentDir, 'questions_batch2d.json')))
      .concat(loadJSON<QuestionData>(path.join(contentDir, 'questions_batch3.json')))
      .concat(loadJSON<QuestionData>(path.join(contentDir, 'questions_batch4.json')));

    let totalQuestions = 0;
    for (const q of questions) {
      const chapter = createdChapters.find(c => c.number === q.chapter);
      if (!chapter) continue;
      // Normalize difficulty to Prisma enum values
      const diffMap: Record<string, string> = {
        'facile': 'EASY', 'easy': 'EASY', 'facile (easy)': 'EASY',
        'moyen': 'MEDIUM', 'medium': 'MEDIUM', 'moyenne': 'MEDIUM', 'moyen (medium)': 'MEDIUM',
        'difficile': 'HARD', 'hard': 'HARD', 'difficile (hard)': 'HARD',
      };
      const difficulty = diffMap[q.difficulty.toLowerCase().trim()] || 'MEDIUM';
      await prisma.question.create({
        data: {
          tradeId,
          chapterId: chapter.id,
          type: 'MCQ',
          difficulty: difficulty as any,
          question: q.question,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation,
          locale: 'fr',
        },
      });
      totalQuestions++;
    }

    return { chapters: createdChapters.length, questions: totalQuestions };
  }

  // ─── Define default chapters per trade ─────────────────────────
  const cmegDefaults = [
    { number: 1, name: "Loi d'Ohm", nameFr: "Loi d'Ohm", nameEn: "Ohm's Law" },
    { number: 2, name: 'DC/AC Circuits', nameFr: 'Circuits CC/CA', nameEn: 'DC/AC Circuits' },
    { number: 3, name: 'Residential Wiring', nameFr: 'Câblage résidentiel', nameEn: 'Residential Wiring' },
    { number: 4, name: 'Circuit Protection', nameFr: 'Protection des circuits', nameEn: 'Circuit Protection' },
    { number: 5, name: 'Electric Motors', nameFr: 'Moteurs électriques', nameEn: 'Electric Motors' },
    { number: 6, name: 'Solar Panels', nameFr: 'Panneaux solaires', nameEn: 'Solar Panels' },
    { number: 7, name: 'Security Systems', nameFr: 'Systèmes de sécurité', nameEn: 'Security Systems' },
    { number: 8, name: 'Construction Code', nameFr: 'Code de construction', nameEn: 'Construction Code' },
    { number: 9, name: 'Electrical Diagrams', nameFr: 'Schémas électriques', nameEn: 'Electrical Diagrams' },
    { number: 10, name: 'Load Calculations', nameFr: 'Calculs de charge', nameEn: 'Load Calculations' },
  ];

  const cmmtqDefaults = [
    { number: 1, name: 'Introduction to Plumbing', nameFr: 'Introduction à la Plomberie' },
    { number: 2, name: 'Quebec Plumbing Code', nameFr: 'Code de Plomberie du Québec' },
    { number: 3, name: 'Water Supply', nameFr: 'Alimentation en Eau Potable' },
    { number: 4, name: 'Drainage and Venting', nameFr: 'Évacuation et Ventilation' },
    { number: 5, name: 'Plumbing Fixtures', nameFr: 'Appareils Sanitaires' },
    { number: 6, name: 'Water Heating', nameFr: 'Chauffage de l\'Eau' },
    { number: 7, name: 'Natural Gas and Propane', nameFr: 'Gaz Naturel et Propane' },
    { number: 8, name: 'Fire Protection Systems', nameFr: 'Systèmes de Protection Incendie' },
  ];

  const qbqDefaults = [
    { number: 1, name: 'Introduction to Welding', nameFr: 'Introduction au Soudage' },
    { number: 2, name: 'Welding Standards and Codes', nameFr: 'Normes et Codes de Soudage' },
    { number: 3, name: 'Welding Safety', nameFr: 'Sécurité en Soudage' },
    { number: 4, name: 'Blueprint Reading', nameFr: 'Lecture de Plans et Symboles' },
    { number: 5, name: 'Welding Metallurgy', nameFr: 'Métallurgie du Soudage' },
    { number: 6, name: 'SMAW Process', nameFr: 'Procédé SMAW' },
    { number: 7, name: 'GMAW/FCAW Process', nameFr: 'Procédé GMAW/FCAW' },
    { number: 8, name: 'Inspection and QC', nameFr: 'Inspection et Contrôle Qualité' },
  ];

  // ─── Seed each trade ───────────────────────────────────────────
  console.log('\n📚 Seeding CMEQ (Électricien)...');
  const cmegResult = await seedChapters(cmeg.id, 'CMEQ', 'content/cmeq', cmegDefaults);
  console.log(`  ✅ ${cmegResult.chapters} chapters, ${cmegResult.questions} questions`);

  console.log('\n📚 Seeding CMMTQ (Plombier)...');
  const cmmtqResult = await seedChapters(cmmtq.id, 'CMMTQ', 'content/cmmtq', cmmtqDefaults);
  console.log(`  ✅ ${cmmtqResult.chapters} chapters, ${cmmtqResult.questions} questions`);

  console.log('\n📚 Seeding QBQ (Soudeur)...');
  const qbqResult = await seedChapters(qbq.id, 'QBQ', 'content/qbq', qbqDefaults);
  console.log(`  ✅ ${qbqResult.chapters} chapters, ${qbqResult.questions} questions`);

  // ─── Summary ───────────────────────────────────────────────────
  const totalChapters = cmegResult.chapters + cmmtqResult.chapters + qbqResult.chapters;
  const totalQuestions = cmegResult.questions + cmmtqResult.questions + qbqResult.questions;

  console.log('\n🎉 Seeding complete!');
  console.log(`   Total trades: 3 (CMEQ, CMMTQ, QBQ)`);
  console.log(`   Total chapters: ${totalChapters}`);
  console.log(`   Total questions: ${totalQuestions}`);
}

main()
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
