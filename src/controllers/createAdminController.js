import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export const createAdmin = async (req, res) => {
  try {
    console.log('🔧 Create admin request received:', req.body);
    
    const { username, email, password, role = 'ADMIN' } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: "Username, email, and password are required" 
      });
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: { 
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingAdmin) {
      console.log('❌ Admin already exists:', existingAdmin.email);
      return res.status(400).json({ 
        message: "Admin with this email or username already exists" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new admin
    const admin = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role
      }
    });

    console.log('✅ New admin created:', { username, email, role });
    
    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
    
  } catch (error) {
    console.error('❌ Create admin error:', error);
    res.status(500).json({ 
      error: error.message 
    });
  }
};
