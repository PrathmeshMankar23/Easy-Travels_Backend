import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let envTransporter = null;

const createEnvTransporter = async () => {
  if (envTransporter) return envTransporter;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("❌ SMTP credentials missing");
    return null;
  }

  const port = Number(process.env.SMTP_PORT ?? 587);

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      requireTLS: port === 587,
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.verify();
    console.log("✅ SMTP ready");

    envTransporter = transporter;
    return transporter;

  } catch (error) {
    console.error("❌ SMTP connection failed:", error.message);
    return null;
  }
};

export const sendMail = async ({ to, subject, html }) => {
  try {
    const transporter = await createEnvTransporter();

    if (!transporter) throw new Error("SMTP not initialized");

    const info = await transporter.sendMail({
      from: `"Easy Travels" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent:", info.messageId);
    return info;

  } catch (error) {
    console.error("❌ Mail failed:", error.message);
    throw error;
  }
};