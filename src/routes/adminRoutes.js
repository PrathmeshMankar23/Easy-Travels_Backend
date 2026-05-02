import express from "express";
import { login, getAdmins, deleteAdmin, createAdmin } from "../controllers/adminController.js";
import { requestPasswordReset, resetPassword } from "../controllers/passwordResetController.js";
import { validateLogin } from "../middleware/validation.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Public / Login Routes
router.post("/login", validateLogin, login);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/create", protect, authorizeRoles("SUPER_ADMIN"), createAdmin);

// Super Admin Only: Admin Management Routes
router.get("/", protect, authorizeRoles("SUPER_ADMIN"), getAdmins);
router.delete("/:id", protect, authorizeRoles("SUPER_ADMIN"), deleteAdmin);

export default router;