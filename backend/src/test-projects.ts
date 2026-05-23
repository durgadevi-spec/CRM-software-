import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const projects = await (prisma as any).boq_projects.findMany();
  console.log("Projects in DB:", projects.length);
  process.exit(0);
}
main();
