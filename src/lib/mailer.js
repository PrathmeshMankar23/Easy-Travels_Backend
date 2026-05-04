import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ENV
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

// ❗ FORCE Gmail working config
const transporter = nodemailer.createTransport({
  service: "gmail", // ✅ important (better than host/port on cloud)
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS, // App Password (NOT normal password)
  },
});

// Verify
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP Connection Error:", error.message);
  } else {
    console.log("✅ SMTP Ready");
  }
});

/**
 * Send Mail
 */
export const sendMail = async ({ to, subject, html, fromName = "Travel Website" }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent:", info.messageId);
    return info;

  } catch (error) {
    console.error("❌ Email failed:", error.message);
    throw error;
  }
};

/**
 * Enquiry Email
 */
export const sendEnquiryEmail = async (enquiryData) => {
  const { customerName, email, phone, message } = enquiryData;
  const adminEmail = process.env.ADMIN_EMAIL || SMTP_USER;

  const html = `
  <html>
  <body>
    <h2>New Travel Enquiry</h2>
    <p><b>Name:</b> ${customerName}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Phone:</b> ${phone || "Not provided"}</p>
    <p><b>Message:</b> ${message}</p>
  </body>
  </html>
  `;

  return sendMail({
    to: adminEmail,
    subject: `New Travel Enquiry: ${customerName}`,
    html,
  });
};