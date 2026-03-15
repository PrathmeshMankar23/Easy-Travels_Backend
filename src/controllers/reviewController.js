import prisma from "../config/prisma.js";

/* =========================
   Submit Review (User)
========================= */
export const submitReview = async (req, res) => {
  try {
    const { name, email, rating, review } = req.body;

    const newReview = await prisma.review.create({
      data: {
        name,
        email,
        rating,
        review,
        isApproved: false
      }
    });

    res.status(201).json(newReview);

  } catch (error) {
    console.error("Submit Review Error:", error);
    res.status(500).json({ error: "Failed to submit review" });
  }
};


/* =========================
   Get All Reviews (Admin)
========================= */
export const getReviews = async (req, res) => {
  try {

    const reviews = await prisma.review.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(reviews);

  } catch (error) {
    console.error("Fetch Reviews Error:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};


/* =========================
   Get Approved Reviews
========================= */
export const getApprovedReviews = async (req, res) => {
  try {

    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" }
    });

    res.json(reviews);

  } catch (error) {
    console.error("Approved Reviews Error:", error);
    res.status(500).json({ error: "Failed to fetch approved reviews" });
  }
};


/* =========================
   Approve / Reject Review
========================= */
export const updateReviewStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { isApproved } = req.body;

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { isApproved }
    });

    res.json(updatedReview);

  } catch (error) {
    console.error("Update Review Error:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
};


/* =========================
   Delete Review
========================= */
export const deleteReview = async (req, res) => {
  try {

    const { id } = req.params;

    await prisma.review.delete({
      where: { id }
    });

    res.json({ message: "Review deleted successfully" });

  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
};