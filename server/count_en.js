const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.question.count({where:{locale:"en"}}).then(c => { console.log("EN questions in DB:", c); p.$disconnect(); });
