import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";
import { protect } from "../middleware/auth.js";
import { validateCategory } from "../middleware/validation.js";

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Protected routes (admin only)
router.post("/", protect, validateCategory, createCategory);
router.put("/:id", protect, validateCategory, updateCategory);
router.delete("/:id", protect, deleteCategory);

export default router;
