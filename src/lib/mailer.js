import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Support both generic SMTP_* envs and older EMAIL_* envs (Gmail)
const HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const PORT = Number(process.env.SMTP_PORT || 587); // must be number
const USER = process.env.SMTP_USER || process.env.EMAIL_USER;
const PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  host: HOST,
  port: PORT,
  secure: PORT === 465, // true for 465, false for 587/others
  auth: USER && PASS ? { user: USER, pass: PASS } : undefined,
});

// Optional (helps debug misconfiguration)
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP Error (check SMTP_/EMAIL_ envs):", error);
  } else {
    console.log("✅ SMTP Ready");
  }
});

export default transporter;
