import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.users.findUnique({ where: { username: 'durga@ctint.in' } });
  console.log("User durga@ctint.in:", user);
  process.exit(0);
}
main();
