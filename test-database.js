import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check if admin table exists
    const adminCount = await prisma.admin.count();
    console.log(`📊 Admin count: ${adminCount}`);
    
    // List existing admins
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    if (admins.length > 0) {
      console.log('👥 Existing Admins:');
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.username} (${admin.email}) - ${admin.role}`);
      });
    } else {
      console.log('❌ No admin users found in database');
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
