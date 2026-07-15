const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const file = process.argv[2];
  if (!file) { console.error("Usage: node insert_en.js <jsonfile>"); process.exit(1); }
  
  const translations = require(file);
  if (!Array.isArray(translations)) {
    console.error("JSON must be an array");
    process.exit(1);
  }
  
  let created = 0;
  for (const t of translations) {
    try {
      await prisma.question.create({
        data: {
          tradeId: t.tradeId,
          chapterId: t.chapterId || null,
          type: t.type || "MCQ",
          difficulty: t.difficulty || "MEDIUM",
          question: t.question,
          options: t.options || null,
          answer: t.answer,
          explanation: t.explanation || null,
          locale: "en",
        }
      });
      created++;
    } catch (err) {
      console.error("Error creating question:", err.message);
    }
  }
  
  console.log(`Inserted ${created} EN questions`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e.message); process.exit(1); });
