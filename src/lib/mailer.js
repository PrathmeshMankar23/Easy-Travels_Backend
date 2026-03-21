import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

let envTransporter = null;

const createEnvTransporter = () => {
  if (envTransporter) return envTransporter;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;

  const port = Number(process.env.SMTP_PORT ?? 465);
  
  const options = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { 
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASS 
    },
    tls: { 
      // Changed to false as Render environments often hit self-signed CA issues with Google SMTP proxies
      rejectUnauthorized: false 
    }
  };

  envTransporter = nodemailer.createTransport(options);
  return envTransporter;
};

export const sendMail = async ({ to, subject, html }) => {
  try {
    // 1. Resend API Fallback (Safe fallback if Render absolutely drops SMTP entirely)
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const resendFrom = process.env.RESEND_FROM || "onboarding@resend.dev";
      
      const { data, error } = await resend.emails.send({
        from: `Travel Website <${resendFrom}>`,
        to,
        subject,
        html,
      });

      if (error) throw error;
      console.log("📧 Email sent successfully via Resend API →", data?.id);
      return data;
    }

    // 2. Exact Nodemailer implementation from snippet
    const transporter = createEnvTransporter();

    if (!transporter) {
      throw new Error("❌ SMTP transporter could not be initialized (Missing ENV variables).");
    }

    const info = await transporter.sendMail({
      from: `"Travel Website" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent successfully via Nodemailer SMTP →", info.messageId);
    return info;

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};