import { PrismaClient } from '@lifeos/db';

const prisma = new PrismaClient();

console.log('Server starting...');

// Example: Health check endpoint
async function main() {
  try {
    await prisma.$connect();
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
