import prisma from "../lib/prisma.js";
import { sendEnquiryEmail } from "../lib/mailer.js";

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

    const finalName = customerName || name || "Anonymous";

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

    // ✅ Send professional email to admin
    try {
      await sendEnquiryEmail({
        customerName: finalName,
        email,
        phone,
        message,
        destinationTitle: enquiry.destination?.title || "General Interest"
      });
      console.log("📧 Enquiry email sent to admin successfully");
    } catch (emailError) {
      console.error("⚠️ Enquiry saved but email failed:", emailError.message);
      // We don't fail the entire request if just the email fails, 
      // but the user might want to know.
    }

    res.status(201).json(enquiry);

  } catch (error) {
    console.error("❌ Failed to submit enquiry:", error);
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
