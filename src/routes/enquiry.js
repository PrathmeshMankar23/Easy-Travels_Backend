import express from "express";
import prisma from "../lib/prisma.js";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message, destinationId } = req.body;

    // 1. Save to Database
    // Note: Using destinationId to match your Prisma schema
    const newEnquiry = await prisma.enquiry.create({
      data: {
        customerName: name,
        email,
        phone,
        message,
        destinationId: destinationId || null, 
      },
    });

    // 2. Setup Transporter using your new App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // The 16-character app password
      },
    });

    // 3. Send Professional HTML Email
    const mailOptions = {
      from: `"Travel Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Sending the notification to yourself
      subject: `✈️ New Enquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2c3e50;">New Trip Enquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong> ${message || "No message provided"}</p>
          <hr />
          <p style="font-size: 12px; color: #7f8c8d;">Sent from your Easy Travels Backend</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: "Enquiry sent successfully!",
      data: newEnquiry 
    });

  } catch (err) {
    console.error("Enquiry Error:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

export default router;