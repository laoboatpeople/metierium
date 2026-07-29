#!/usr/bin/env node
/**
 * Translate GESTRAV FR questions to EN and insert.
 * Reads FR questions from DB, translates via simple mapping, inserts as locale='en'.
 * 
 * For proper translation, this script reads the FR JSON files and creates EN versions
 * by delegating to the translation subagent output.
 * 
 * Usage: node translate_gestrav.js
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const CONTENT_DIR = path.join(__dirname, 'prisma/content/gestrav');

function loadJSON(filename) {
  const fp = path.join(CONTENT_DIR, filename);
  if (!fs.existsSync(fp)) return [];
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch (e) {
    console.error(`  [ERROR] ${filename}: ${e.message}`);
    return [];
  }
}

const diffMap = {
  'facile': 'EASY', 'easy': 'EASY',
  'moyen': 'MEDIUM', 'medium': 'MEDIUM', 'moyenne': 'MEDIUM',
  'difficile': 'HARD', 'hard': 'HARD',
};

function normalizeDifficulty(d) {
  if (!d) return 'MEDIUM';
  return diffMap[d.toLowerCase().trim()] || 'MEDIUM';
}

function normalizeAnswer(ans, options) {
  if (!ans) return 'A';
  const letter = ans.trim().toUpperCase();
  if (['A', 'B', 'C', 'D'].includes(letter)) return letter;
  if (options && Array.isArray(options)) {
    const idx = options.findIndex(o => o.trim().toLowerCase() === ans.trim().toLowerCase());
    if (idx >= 0) return String.fromCharCode(65 + idx);
  }
  const m = ans.match(/Option\s+([A-D])/i);
  if (m) return m[1].toUpperCase();
  return 'A';
}

async function main() {
  const trade = await prisma.trade.findUnique({ where: { code: 'GESTRAV' } });
  if (!trade) {
    console.error('Trade GESTRAV not found!');
    process.exit(1);
  }

  const chapters = await prisma.chapter.findMany({
    where: { tradeId: trade.id },
    orderBy: { number: 'asc' },
  });
  const chapterByNumber = {};
  chapters.forEach(ch => { chapterByNumber[ch.number] = ch.id; });

  // Load EN question files
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.startsWith('questions_en') && f.endsWith('.json')).sort();
  console.log(`Loading ${files.length} EN files:`);
  
  let allQuestions = [];
  for (const f of files) {
    const data = loadJSON(f);
    console.log(`  ${f}: ${data.length} questions`);
    allQuestions = allQuestions.concat(data);
  }
  console.log(`Total EN questions: ${allQuestions.length}`);

  if (allQuestions.length === 0) {
    console.log('No EN questions to insert.');
    await prisma.$disconnect();
    return;
  }

  // Delete existing EN questions
  const deleted = await prisma.question.deleteMany({
    where: { tradeId: trade.id, locale: 'en' },
  });
  console.log(`Deleted ${deleted.count} existing EN questions`);

  let inserted = 0;
  const batchSize = 100;

  for (let i = 0; i < allQuestions.length; i += batchSize) {
    const batch = allQuestions.slice(i, i + batchSize);
    const rows = batch.map(q => {
      const chapterNum = q.chapter || q.chapterNumber || 1;
      const chapterId = chapterByNumber[chapterNum];
      if (!chapterId) return null;
      const options = Array.isArray(q.options) ? q.options : [];
      const answer = normalizeAnswer(q.answer, options);
      const difficulty = normalizeDifficulty(q.difficulty);
      return {
        tradeId: trade.id,
        chapterId,
        type: 'MCQ',
        difficulty,
        question: q.question || q.text || q.content || '',
        options: options,
        answer,
        explanation: q.explanation || null,
        locale: 'en',
      };
    }).filter(Boolean);

    if (rows.length > 0) {
      await prisma.question.createMany({ data: rows });
      inserted += rows.length;
    }
  }

  console.log(`Inserted: ${inserted} EN questions`);

  const count = await prisma.question.count({ where: { tradeId: trade.id, locale: 'en' } });
  console.log(`DB verification: ${count} EN questions for GESTRAV`);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
