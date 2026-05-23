import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE boq_projects ADD COLUMN sales_person_name VARCHAR(255);');
    console.log("Column sales_person_name added successfully");
  } catch (err: any) {
    if (err.message.includes("already exists")) {
      console.log("Column already exists");
    } else {
      console.error("Error:", err.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}
main();
