const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ orderBy: { created_at: 'asc' }, take: 1 });
  if (users.length > 0) {
    const owner = users[0];
    await prisma.user.update({
      where: { id: owner.id },
      data: { role: 'OWNER' }
    });
    console.log(`Updated user ${owner.email} to OWNER.`);
  } else {
    console.log('No users found.');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
