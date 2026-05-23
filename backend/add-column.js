const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    console.log("Adding sales_person_name column safely...");
    await prisma.$executeRawUnsafe(`ALTER TABLE boq_projects ADD COLUMN sales_person_name VARCHAR(255);`);
    console.log("Column added successfully!");
  } catch(e) {
    if (e.message.includes('already exists')) {
      console.log("Column already exists.");
    } else {
      console.error("ERROR", e);
    }
  } finally {
    await prisma.$disconnect();
  }
}
main();
