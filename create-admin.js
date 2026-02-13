import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: { email: 'admin@easytravels.com' }
    });

    if (existingAdmin) {
      console.log('❌ Admin user already exists with email: admin@easytravels.com');
      return;
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        email: 'admin@easytravels.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@easytravels.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Username: admin');
    console.log('🎯 Role: ADMIN');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
