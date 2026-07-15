const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
async function main() {
  const r = await p.question.groupBy({ by: ["tradeId", "locale"], _count: true });
  const d = {};
  for (const row of r) {
    if (!d[row.tradeId]) d[row.tradeId] = {};
    d[row.tradeId][row.locale] = row._count;
  }
  let tE = 0, tF = 0;
  for (const [tid, c] of Object.entries(d).sort()) {
    const fr = c.fr || 0, en = c.en || 0;
    tE += en; tF += fr;
    console.log(String(en).padStart(4) + "/" + String(fr).padStart(4) + " " + tid.slice(0, 28));
  }
  console.log("---\nTOTAL: " + tE + "/" + tF + " " + Math.round(tE/tF*100) + "%");
  await p.$disconnect();
}
main().catch(e => { console.error(e.message); process.exit(1); });
