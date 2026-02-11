import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// ✅ Validate ENV early (prevents hidden bugs)
if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY is missing in environment variables");
}

if (!process.env.RESEND_FROM) {
  console.error("❌ RESEND_FROM is missing in environment variables");
}

const resend = new Resend(process.env.RESEND_API_KEY);


// ✅ Common mail function
export const sendMail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM,   // must be verified sender in Resend
      to,
      subject,
      html,
    });

    console.log("📧 Email sent successfully → id:", response.data?.id);

    return response.data;

  } catch (error) {
    console.error("❌ Resend email failed:", error.message);
    throw error;
  }
};
