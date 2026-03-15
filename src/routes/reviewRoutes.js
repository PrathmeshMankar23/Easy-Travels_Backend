import express from "express";
import {
  submitReview,
  getReviews,
  getApprovedReviews,
  updateReviewStatus,
  deleteReview
} from "../controllers/reviewController.js";

const router = express.Router();

// User submit review
router.post("/", submitReview);

// Admin fetch all reviews
router.get("/", getReviews);

// Public approved reviews
router.get("/approved", getApprovedReviews);

// Admin approve/reject
router.put("/:id", updateReviewStatus);

// Admin delete
router.delete("/:id", deleteReview);

export default router;