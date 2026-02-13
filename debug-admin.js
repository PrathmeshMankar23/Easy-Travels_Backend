import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugAdmin() {
  try {
    console.log('🔍 Debugging admin login issue...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Check if admin table exists and has data
    const adminCount = await prisma.admin.count();
    console.log(`📊 Total admin count: ${adminCount}`);
    
    if (adminCount === 0) {
      console.log('❌ NO ADMIN USERS FOUND - This is the problem!');
      console.log('🛠️ Run: node create-admin.js to create first admin');
      return;
    }
    
    // List all admin users
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    console.log('👥 Found admin users:');
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. Email: ${admin.email}, Username: ${admin.username}, Role: ${admin.role}`);
    });
    
    // Test password comparison for first admin
    if (admins.length > 0) {
      const testAdmin = admins[0];
      console.log(`🧪 Testing login for: ${testAdmin.email}`);
      console.log('📝 To test login, use these credentials:');
      console.log(`   Email: ${testAdmin.email}`);
      console.log('   Password: [the password you set]');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
    console.log('🔧 Possible issues:');
    console.log('   1. Database URL not configured');
    console.log('   2. Prisma not generated');
    console.log('   3. Database connection failed');
  } finally {
    await prisma.$disconnect();
  }
}

debugAdmin();
