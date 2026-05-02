import express from "express";
import {
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);

export default router;
