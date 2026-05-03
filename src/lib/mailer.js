import nodemailer from "nodemailer";
import dotenv from "dotenv";
import dns from "dns";

// Force IPv4 as cloud environments like Render often have issues with IPv6 routing
dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const getEnv = (key, fallback = "") => (process.env[key] || fallback).toString().trim();
const SMTP_USER = getEnv("SMTP_USER");
const SMTP_PASS = getEnv("SMTP_PASS");
const SMTP_HOST = getEnv("SMTP_HOST", "smtp.gmail.com");
const SMTP_PORT = Number(getEnv("SMTP_PORT", "465"));
const SMTP_SECURE = getEnv("SMTP_SECURE", SMTP_PORT === 465 ? "true" : "false") === "true";
const SMTP_FROM = getEnv("SMTP_FROM", SMTP_USER);

if (!SMTP_USER || !SMTP_PASS) {
  console.error("❌ SMTP_USER / SMTP_PASS is missing. Emails will fail until env values are set.");
}

const createTransporter = (port, secure) =>
  nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    family: 4,
    secure,
    requireTLS: !secure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    // Hosted providers can be strict about modern TLS only.
    tls: { servername: SMTP_HOST, minVersion: "TLSv1.2" },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 45000,
    logger: false,
    debug: false,
  });

const primaryTransporter = createTransporter(SMTP_PORT, SMTP_SECURE);
const fallbackPort = SMTP_PORT === 465 ? 587 : 465;
const fallbackSecure = fallbackPort === 465;
const fallbackTransporter = createTransporter(fallbackPort, fallbackSecure);

// Verify connection immediately
primaryTransporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP Connection Error (primary):", error.message);
    console.log(`ℹ️ Will fallback to SMTP ${SMTP_HOST}:${fallbackPort} when needed.`);
  } else {
    console.log("✅ SMTP Transporter is ready to deliver messages");
  }
});

/**
 * General purpose mail sender
 */
export const sendMail = async ({ to, subject, html, fromName = "Travel Website" }) => {
  try {
    const info = await primaryTransporter.sendMail({
      from: `"${fromName}" <${SMTP_FROM}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent successfully via SMTP →", info.messageId);
    return info;

  } catch (error) {
    const errorCode = error?.code || "";
    const shouldRetry = ["ETIMEDOUT", "ESOCKET", "ECONNECTION", "ECONNRESET"].includes(errorCode);

    if (!shouldRetry) {
      console.error("❌ Email sending failed:", error.message);
      throw error;
    }

    console.warn(
      `⚠️ Primary SMTP failed (${errorCode || "unknown"}). Retrying with ${SMTP_HOST}:${fallbackPort}...`
    );

    try {
      const fallbackInfo = await fallbackTransporter.sendMail({
        from: `"${fromName}" <${SMTP_FROM}>`,
        to,
        subject,
        html,
      });

      console.log("📧 Email sent successfully via fallback SMTP →", fallbackInfo.messageId);
      return fallbackInfo;
    } catch (fallbackError) {
      console.error("❌ Email sending failed after fallback:", fallbackError.message);
      throw fallbackError;
    }
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