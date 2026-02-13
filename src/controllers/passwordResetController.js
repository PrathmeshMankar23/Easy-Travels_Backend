import prisma from "../lib/prisma.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    
    // Check if admin exists
    const admin = await prisma.admin.findFirst({
      where: { email }
    });
    
    if (!admin) {
      return res.status(404).json({ error: "Admin not found with this email" });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Store reset token with 1-hour expiry
    await prisma.admin.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 3600000) // 1 hour
      }
    });
    
    console.log('🔑 Password reset requested for:', email);
    console.log('🔗 Reset token:', resetToken);
    
    res.status(200).json({ 
      message: "Password reset token generated",
      resetToken,
      // For development - show token in response
      instructions: `Use this token to reset password: ${resetToken}`
    });
    
  } catch (error) {
    console.error('❌ Password reset error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required" });
    }
    
    // Find admin with valid reset token
    const admin = await prisma.admin.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });
    
    if (!admin) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password and clear reset token
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    
    console.log('✅ Password reset successful for:', admin.email);
    
    res.status(200).json({ 
      message: "Password reset successfully",
      email: admin.email
    });
    
  } catch (error) {
    console.error('❌ Password reset error:', error);
    res.status(500).json({ error: error.message });
  }
};
