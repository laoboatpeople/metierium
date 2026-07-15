const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const allFr = await prisma.question.findMany({
    where: { locale: "fr" },
    select: { id: true, tradeId: true, question: true, options: true, answer: true, explanation: true, type: true, difficulty: true, chapterId: true },
    orderBy: [{ tradeId: "asc" }, { id: "asc" }]
  });

  const enCounts = await prisma.question.groupBy({
    by: ["tradeId", "locale"],
    _count: true
  });

  const enMap = {};
  for (const c of enCounts) {
    if (c.locale === "en") enMap[c.tradeId] = c._count;
  }

  const byTrade = {};
  for (const q of allFr) {
    if (!byTrade[q.tradeId]) byTrade[q.tradeId] = [];
    byTrade[q.tradeId].push(q);
  }

  let remaining = [];
  for (const [tid, frQs] of Object.entries(byTrade)) {
    const enCount = enMap[tid] || 0;
    if (enCount >= frQs.length) continue;
    const toTranslate = frQs.slice(enCount);
    remaining.push(...toTranslate);
  }

  require("fs").writeFileSync("/tmp/all_fr_to_translate.json", JSON.stringify(remaining, null, 2));
  console.log("Total FR to translate: " + remaining.length);
  
  // Group by trade for reporting
  const trades = {};
  for (const q of remaining) {
    if (!trades[q.tradeId]) trades[q.tradeId] = 0;
    trades[q.tradeId]++;
  }
  for (const [tid, count] of Object.entries(trades)) {
    console.log("  " + tid + ": " + count);
  }
  
  await prisma.$disconnect();
}

main().catch(e => { console.error(e.message); process.exit(1); });
