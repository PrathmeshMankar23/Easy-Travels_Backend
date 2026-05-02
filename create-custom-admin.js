import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const [username, email, password, role] = process.argv.slice(2);

  if (!username || !email || !password) {
    console.log('Usage: node create-custom-admin.js "username" "email" "password" "role"');
    console.log('Example: node create-custom-admin.js "Prathmesh" "prathmesh73831@gmail.com" "Prathmesh73831@" "SUPER_ADMIN"');
    process.exit(1);
  }

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingAdmin) {
      console.log('❌ Admin already exists:', existingAdmin.email === email ? 'Email' : 'Username');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || 'ADMIN'
      }
    });

    console.log('✅ Admin created successfully!');
    console.log('📝 Details:');
    console.log('   Username:', newAdmin.username);
    console.log('   Email:', newAdmin.email);
    console.log('   Role:', newAdmin.role);
    console.log('   Password:', password);
    console.log('');
    console.log('🔑 You can now login with these credentials');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
