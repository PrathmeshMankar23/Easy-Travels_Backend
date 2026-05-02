import prisma from "../config/prisma.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../lib/mailer.js";
import crypto from "crypto";

// Forgot Password with OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return res.status(404).json({ error: "No admin found with this email" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 600000); // 10 minutes from now

    // Save OTP to database
    await prisma.admin.update({
      where: { email },
      data: {
        resetToken: otp,
        resetTokenExpiry: otpExpiry
      }
    });

    // Send OTP email
    await sendMail({
      to: email,
      subject: "Password Reset OTP - Easy Travels Admin",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset OTP</h2>
          <p>Hello ${admin.username},</p>
          <p>You requested to reset your password for Easy Travels Admin Panel.</p>
          <p>Your One-Time Password (OTP) is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 4px;">${otp}</span>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>Enter this OTP in the admin panel to reset your password.</p>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          <p>Best regards,<br>Easy Travels Team</p>
        </div>
      `
    });

    res.json({ 
      message: "OTP has been sent to your email",
      email: email // Return email for next step
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// Reset Password with OTP
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "Email, OTP, and new password are required" });
    }

    // Find admin with valid OTP
    const admin = await prisma.admin.findFirst({
      where: {
        email,
        resetToken: otp,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!admin) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update password and clear OTP
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    res.json({ message: "Password reset successfully" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
};
