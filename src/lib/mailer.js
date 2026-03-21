import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let envTransporter = null;

// ✅ Create transporter (only once)
const createEnvTransporter = async () => {
  if (envTransporter) return envTransporter;

  // ❌ Validate ENV
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("❌ SMTP credentials missing in ENV");
    return null;
  }

  const port = Number(process.env.SMTP_PORT ?? 587);

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: port,
      secure: port === 465, // true only for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      requireTLS: port === 587,
      tls: {
        rejectUnauthorized: false, // helps on Render
      },
    });

    // ✅ Verify connection (VERY IMPORTANT)
    await transporter.verify();
    console.log("✅ SMTP server is ready to send emails");

    envTransporter = transporter;
    return transporter;

  } catch (error) {
    console.error("❌ SMTP connection failed:", error.message);
    return null;
  }
};

// ✅ Main mail function
export const sendMail = async ({ to, subject, html }) => {
  try {
    const transporter = await createEnvTransporter();

    if (!transporter) {
      throw new Error("SMTP transporter not initialized");
    }

    const info = await transporter.sendMail({
      from: `"Travel Website" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent via SMTP →", info.messageId);

    return info;

  } catch (error) {
    console.error("❌ SMTP email failed:", error.message);
    throw error;
  }
};