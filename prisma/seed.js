import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default admin if it doesn't exist
  const existingAdmin = await prisma.admin.findFirst({
    where: { email: 'admin@easytravels.com' }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        email: 'admin@easytravels.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Default admin created:', admin);
  } else {
    console.log('📝 Admin already exists:', existingAdmin);
  }

  // Create additional admin
  const additionalAdmin = await prisma.admin.findFirst({
    where: { email: 'admin2@easytravels.com' }
  });

  if (!additionalAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin2 = await prisma.admin.create({
      data: {
        username: 'admin2',
        email: 'admin2@easytravels.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Additional admin created:', admin2);
  } else {
    console.log('📝 Additional admin already exists:', additionalAdmin);
  }

  // Create super admin
  const superAdmin = await prisma.admin.findFirst({
    where: { email: 'superadmin@easytravels.com' }
  });

  if (!superAdmin) {
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    const sAdmin = await prisma.admin.create({
      data: {
        username: 'superadmin',
        email: 'superadmin@easytravels.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN'
      }
    });
    
    console.log('✅ Super admin created:', sAdmin);
  } else {
    console.log('📝 Super admin already exists:', superAdmin);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
