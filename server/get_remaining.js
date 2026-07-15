const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
async function main() {
  const trades = ["cmt_mvl_001", "cmt_inspecteur_001"];
  for (const tradeId of trades) {
    const fr = await p.question.findMany({
      where: { tradeId, locale: "fr" },
      select: { id: true, tradeId: true, chapterId: true, type: true, difficulty: true, question: true, options: true, answer: true, explanation: true },
      orderBy: { id: "asc" }
    });
    const enCount = await p.question.count({ where: { tradeId, locale: "en" } });
    const remaining = fr.slice(enCount);
    console.log(tradeId + ": " + remaining.length + " remaining");
    console.log(JSON.stringify(remaining));
  }
  await p.$disconnect();
}
main().catch(e => { console.error(e.message); process.exit(1); });
