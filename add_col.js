const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function run() {
  try {
    await db.$executeRawUnsafe('ALTER TABLE SiteSettings ADD COLUMN sectionsVisibility TEXT');
    console.log('COLUMN ADDED SUCCESS');
  } catch (e) {
    console.log('COLUMN RESULT:', e.message);
  } finally {
    await db.$disconnect();
  }
}

run();
