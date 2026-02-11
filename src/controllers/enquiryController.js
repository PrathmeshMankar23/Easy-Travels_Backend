import prisma from "../lib/prisma.js";
import transporter from "../lib/mailer.js";

// GET ALL: Fetch all enquiries for admin
export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await prisma.enquiry.findMany({
      where: { deletedAt: null },
      include: {
        destination: {
          select: { id: true, title: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
};

// CREATE: Submit new enquiry and send email
export const createEnquiry = async (req, res) => {
  try {
    const { customerName, name, email, phone, message, destinationId } = req.body;
    const finalName = customerName || name || "";

    // Save to database
    const newEnquiry = await prisma.enquiry.create({
      data: {
        customerName: finalName,
        email,
        phone,
        message,
        destinationId
      },
      include: {
        destination: true
      }
    });

    // Send email notification
    await sendEnquiryEmail(newEnquiry);

    res.status(201).json(newEnquiry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit enquiry" });
  }
};

// DELETE: Soft delete enquiry
export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.enquiry.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    res.json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete enquiry" });
  }
};

// Email sending function
const sendEnquiryEmail = async (enquiry) => {
  try {
    // Always send TO the SMTP user, as requested
    const fromAddress =
      process.env.SMTP_USER ||
      process.env.EMAIL_USER ||
      "no-reply@easy-travels.local";
    const toAddress =
      process.env.SMTP_USER ||
      process.env.EMAIL_USER ||
      process.env.ADMIN_EMAIL;

    const mailOptions = {
      from: fromAddress,
      to: toAddress,
      replyTo: enquiry.email || undefined,
      subject: `New Travel Enquiry - ${enquiry.customerName}`,
      html: `
        <h2>New Travel Enquiry</h2>
        <p><strong>Name:</strong> ${enquiry.customerName}</p>
        <p><strong>Email:</strong> ${enquiry.email}</p>
        <p><strong>Phone:</strong> ${enquiry.phone}</p>
        ${enquiry.destination ? `<p><strong>Destination:</strong> ${enquiry.destination.title}</p>` : ''}
        ${enquiry.message ? `<p><strong>Message:</strong> ${enquiry.message}</p>` : ''}
        <p><strong>Received:</strong> ${new Date(enquiry.createdAt).toLocaleString()}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Enquiry email sent to:", toAddress, "id:", info.messageId);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};
