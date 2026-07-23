const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
async function run() {
  const cols = await db.$queryRawUnsafe(`PRAGMA table_info("SiteSettings")`);
  console.log('SiteSettings Columns:', cols);
  await db.$disconnect();
}
run();
