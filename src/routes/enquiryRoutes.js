import express from "express";
import {
  getAllEnquiries,
  createEnquiry,
  deleteEnquiry
} from "../controllers/enquiryController.js";
import { protect } from "../middleware/auth.js";
import { validateEnquiry } from "../middleware/validation.js";

const router = express.Router();

// Public route - for form submissions
router.post("/", validateEnquiry, createEnquiry);

// Protected routes (admin only)
router.get("/", protect, getAllEnquiries);
router.delete("/:id", protect, deleteEnquiry);

export default router;
