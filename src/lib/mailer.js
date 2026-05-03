import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Resend } from "resend";
import dns from "dns";

// Force IPv4 as cloud environments like Render often have issues with IPv6 routing
dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const { SMTP_USER, SMTP_PASS, SMTP_HOST, SMTP_PORT } = process.env;

// Create transporter at top level like GigFactory
const port = Number(SMTP_PORT) || 465;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST || 'smtp.gmail.com',
  port,
  secure: port === 465,   // ✅ FIXED
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  logger: true,
  debug: true
});

// Verify connection immediately
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP Connection Error:", error.message);
  } else {
    console.log("✅ SMTP Transporter is ready to deliver messages");
  }
});

/**
 * General purpose mail sender
 */
export const sendMail = async ({ to, subject, html, fromName = "Travel Website" }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent successfully via SMTP →", info.messageId);
    return info;

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};

/**
 * Specifically formatted email for Travel Enquiries
 */
export const sendEnquiryEmail = async (enquiryData) => {
  const { customerName, email, phone, message, destinationTitle } = enquiryData;
  const adminEmail = process.env.ADMIN_EMAIL || SMTP_USER;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .email-container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
        .header { background: #1a73e8; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; line-height: 1.6; color: #333; }
        .field { margin-bottom: 20px; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px; }
        .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
        .value { font-size: 16px; color: #111; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #777; }
        .badge { display: inline-block; background: #e8f0fe; color: #1a73e8; padding: 4px 12px; border-radius: 20px; font-weight: 500; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h2 style="margin:0;">New Travel Enquiry</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Customer Name</div>
            <div class="value">${customerName}</div>
          </div>
          <div class="field">
            <div class="label">Email Address</div>
            <div class="value"><a href="mailto:${email}">${email}</a></div>
          </div>
          <div class="field">
            <div class="label">Phone Number</div>
            <div class="value">${phone || "Not provided"}</div>
          </div>
          ${destinationTitle ? `
          <div class="field">
            <div class="label">Interested Destination</div>
            <div class="value"><span class="badge">${destinationTitle}</span></div>
          </div>` : ""}
          <div class="field" style="border-bottom: none;">
            <div class="label">Message</div>
            <div style="background: #fdfdfd; padding: 15px; border-left: 4px solid #1a73e8; font-style: italic;">
              ${message || "No message provided."}
            </div>
          </div>
        </div>
        <div class="footer">
          Received from Easy Travels Website Enquiry Form<br>
          ${new Date().toLocaleString()}
        </div>
      </div>
    </body>
    </html>
  `;

  return sendMail({
    to: adminEmail,
    subject: `New Travel Enquiry: ${customerName}`,
    html,
  });
};