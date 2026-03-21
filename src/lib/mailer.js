import nodemailer from "nodemailer";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

// Force IPv4 for dns resolution to avoid IPv6 connection timeouts on Render
dns.setDefaultResultOrder("ipv4first");

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
  const hostName = process.env.SMTP_HOST || "smtp.gmail.com";

  try {
    // RESOLVER FIX: Forcefully fetch the IPv4 address of the SMTP server
    // This entirely avoids Node.js silently trying to use IPv6 on Render
    const ipv4Addresses = await dns.promises.resolve4(hostName);
    const hostIp = ipv4Addresses[0];

    const transporter = nodemailer.createTransport({
      host: hostIp, // Use the resolved IPv4 string directly
      port: port,
      secure: port === 465, // true only for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      requireTLS: port === 587,
      tls: {
        rejectUnauthorized: false, // helps on Render
        servername: hostName,      // Ensure the TLS certificate still matches the domain name!
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