import prisma from "../lib/prisma.js";
import { sendMail } from "../lib/mailer.js";

// GET ALL
export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await prisma.enquiry.findMany({
      where: { deletedAt: null },
      include: {
        destination: {
          select: { id: true, title: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(enquiries);
  } catch {
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
};


// CREATE ENQUIRY + SEND EMAIL
export const createEnquiry = async (req, res) => {
  try {
    const { customerName, name, email, phone, message, destinationId } = req.body;

    const finalName = customerName || name || "";

    // Save to DB
    const enquiry = await prisma.enquiry.create({
      data: {
        customerName: finalName,
        email,
        phone,
        message,
        destinationId
      },
      include: { destination: true }
    });

    // ✅ Send email via Resend
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Travel Enquiry - ${finalName}`,
      html: `
        <h2>New Travel Enquiry</h2>
        <p><b>Name:</b> ${finalName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        ${enquiry.destination ? `<p><b>Destination:</b> ${enquiry.destination.title}</p>` : ""}
        ${message ? `<p><b>Message:</b> ${message}</p>` : ""}
      `
    });

    console.log("📧 Email sent to admin");

    res.status(201).json(enquiry);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit enquiry" });
  }
};


// DELETE
export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.enquiry.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    res.json({ message: "Enquiry deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete enquiry" });
  }
};
