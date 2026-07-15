const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const batchNum = parseInt(process.argv[2]);
if (isNaN(batchNum)) {
  console.error("Usage: node translate_batch.js <batch_number>");
  process.exit(1);
}

const batchFile = `/home/chuck/batch_${String(batchNum).padStart(3, "0")}.json`;
const transFile = `/home/chuck/trans_${String(batchNum).padStart(3, "0")}.json`;

if (!fs.existsSync(batchFile)) {
  console.error(`Batch file not found: ${batchFile}`);
  process.exit(1);
}

const batchData = JSON.parse(fs.readFileSync(batchFile, "utf8"));

if (!fs.existsSync(transFile)) {
  console.error(`Translation file not found: ${transFile}`);
  console.error(`Create it first with the translated questions.`);
  process.exit(1);
}

const translations = JSON.parse(fs.readFileSync(transFile, "utf8"));

async function main() {
  console.log(`Batch ${batchNum}: Processing ${batchData.length} questions...`);
  
  let inserted = 0;
  let errors = 0;
  
  for (let i = 0; i < batchData.length; i++) {
    const frQ = batchData[i];
    const t = translations[String(i)];
    if (!t) {
      console.error(`No translation for index ${i}: ${frQ.question.substring(0, 50)}`);
      errors++;
      continue;
    }
    
    try {
      await prisma.question.create({
        data: {
          tradeId: frQ.tradeId,
          chapterId: frQ.chapterId,
          type: frQ.type,
          difficulty: frQ.difficulty,
          question: t.question,
          options: t.options,
          answer: frQ.answer,
          explanation: t.explanation,
          locale: "en"
        }
      });
      inserted++;
    } catch (e) {
      console.error(`Error at index ${i}: ${e.message}`);
      errors++;
    }
  }
  
  console.log(`Batch ${batchNum} done. Inserted: ${inserted}/${batchData.length}, Errors: ${errors}`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
