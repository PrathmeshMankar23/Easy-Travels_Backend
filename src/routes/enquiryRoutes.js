import express from "express";
import { sendMail } from "../lib/mailer.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log("📩 New enquiry received");

    // 👉 (Optional: save to DB here)

    // ✅ SEND EMAIL TO ADMIN
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: "📩 New Enquiry from Website",
      html: `
        <h2>New Enquiry</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    console.log("📧 Enquiry email sent");

    res.status(200).json({
      success: true,
      message: "Enquiry submitted successfully",
    });

  } catch (error) {
    console.error("❌ Enquiry Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry",
    });
  }
});

export default router;