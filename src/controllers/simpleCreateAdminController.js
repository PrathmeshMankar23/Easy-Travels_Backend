// Create a simple test endpoint without any validation
import express from "express";
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export const simpleCreateAdmin = async (req, res) => {
  try {
    console.log('🔧 Simple create admin - no validation');
    
    // Hardcode admin data to avoid any body parsing issues
    const adminData = {
      username: 'admin',
      email: 'admin@easytravels.com',
      password: 'admin123',
      role: 'ADMIN'
    };
    
    console.log('📝 Admin data to create:', adminData);
    
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: { email: adminData.email }
    });
    
    if (existingAdmin) {
      console.log('❌ Admin already exists:', existingAdmin.email);
      return res.status(200).json({
        message: "Admin already exists",
        success: true,
        admin: {
          id: existingAdmin.id,
          email: existingAdmin.email,
          username: existingAdmin.username
        }
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    console.log('🔐 Password hashed successfully');
    
    // Create new admin
    const admin = await prisma.admin.create({
      data: {
        username: adminData.username,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role
      }
    });
    
    console.log('✅ Admin created successfully:', admin.id);
    
    res.status(201).json({
      message: "Admin created successfully",
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
    
  } catch (error) {
    console.error('❌ Simple create admin error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: error.message,
      success: false
    });
  }
};
