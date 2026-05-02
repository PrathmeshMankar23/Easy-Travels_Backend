import express from "express";
import { createEnquiry, getAllEnquiries, deleteEnquiry } from "../controllers/enquiryController.js";

const router = express.Router();

/**
 * @route   POST /api/enquiry
 * @desc    Submit a new enquiry
 * @access  Public
 */
router.post("/", createEnquiry);

/**
 * @route   GET /api/enquiry
 * @desc    Get all active enquiries
 * @access  Private (Admin)
 */
router.get("/", getAllEnquiries);

/**
 * @route   DELETE /api/enquiry/:id
 * @desc    Soft delete an enquiry
 * @access  Private (Admin)
 */
router.delete("/:id", deleteEnquiry);

export default router;