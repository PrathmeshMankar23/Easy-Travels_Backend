import express from "express";
import { login } from "../controllers/adminController.js";
import { createAdmin } from "../controllers/createAdminController.js";
import { simpleCreateAdmin } from "../controllers/simpleCreateAdminController.js";
import { requestPasswordReset, resetPassword } from "../controllers/passwordResetController.js";
import { validateLogin } from "../middleware/validation.js";

const router = express.Router();

router.post("/login", validateLogin, login);
router.post("/create", createAdmin);
router.post("/simple-create", simpleCreateAdmin);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;