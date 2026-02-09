import express from "express";
import { login } from "../controllers/adminController.js";
import { validateLogin } from "../middleware/validation.js";

const router = express.Router();

router.post("/login", validateLogin, login);

export default router;