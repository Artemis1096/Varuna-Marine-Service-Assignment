import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Simple query to test connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test query (will work even with empty schema)
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database query test successful!');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('Database connection closed.');
  }
}

testConnection();

