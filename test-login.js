import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLogin() {
  try {
    // Check if admin user exists
    const admin = await prisma.admin.findFirst({
      where: { email: { contains: 'admin' } }
    });

    if (admin) {
      console.log('✅ Found admin user:');
      console.log('Email:', admin.email);
      console.log('Username:', admin.username);
      console.log('Password Hash:', admin.password.substring(0, 20) + '...');
      
      // Test password comparison
      const testPasswords = ['admin123', 'yourpassword'];
      for (const pwd of testPasswords) {
        const isValid = await bcrypt.compare(pwd, admin.password);
        console.log(`🔑 Password "${pwd}": ${isValid ? '✅ Valid' : '❌ Invalid'}`);
      }
    } else {
      console.log('❌ No admin users found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
