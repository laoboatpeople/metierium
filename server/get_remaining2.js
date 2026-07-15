const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const p = new PrismaClient();
async function main() {
  const data = {};
  for (const tid of ["cmt_mvl_001", "cmt_inspecteur_001"]) {
    const fr = await p.question.findMany({
      where: { tradeId: tid, locale: "fr" },
      orderBy: { id: "asc" },
      select: { id: true, tradeId: true, chapterId: true, type: true, difficulty: true, question: true, options: true, answer: true, explanation: true }
    });
    const en = await p.question.count({ where: { tradeId: tid, locale: "en" } });
    data[tid] = fr.slice(en);
  }
  fs.writeFileSync("/tmp/remaining_qs.json", JSON.stringify(data, null, 2));
  const total = Object.values(data).flat().length;
  console.log(total + " remaining questions saved");
  await p.$disconnect();
}
main().catch(e => { console.error(e.message); process.exit(1); });
