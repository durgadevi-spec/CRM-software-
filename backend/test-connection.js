const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const data = await prisma.boq_projects.findMany();
    console.log(data);
  } catch(e) {
    console.error("ERROR", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
