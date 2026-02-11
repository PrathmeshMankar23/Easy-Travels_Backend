import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const PORT = Number(process.env.SMTP_PORT || 587);
const USER = process.env.SMTP_USER || process.env.EMAIL_USER;
const PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  host: HOST,
  port: PORT,
  secure: false, // Gmail 587 uses TLS
  requireTLS: true, // ⭐ force TLS

  auth: {
    user: USER,
    pass: PASS,
  },

  tls: {
    family: 4, // ⭐⭐⭐ FORCE IPv4 (FIXES Render ENETUNREACH)
  },

  connectionTimeout: 10000,
});

// Debug
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP Error:", error);
  } else {
    console.log("✅ SMTP Ready");
  }
});

export default transporter;
