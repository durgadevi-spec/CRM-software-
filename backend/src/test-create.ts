import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const newProject = await (prisma as any).boq_projects.create({
      data: {
        name: 'Test Project ' + Date.now(),
        client: 'Test Client',
        project_status: 'started'
      }
    });
    console.log("Created successfully:", newProject);
  } catch (err) {
    console.error("Creation failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
