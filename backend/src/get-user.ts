import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.users.findMany({ take: 5 });
  console.log("Users:", users.map(u => ({ username: u.username, role: u.role })));
  process.exit(0);
}
main();
