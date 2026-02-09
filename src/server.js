import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import enquiryRoutes from "./routes/enquiryRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();

/* ================= SETUP ================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* =====================================================
   ✅ SIMPLE CORS (Fixes ALL Vercel + localhost issues)
   Allows any frontend to access backend
===================================================== */

app.use(
  cors({
    origin: true, // allow all origins automatically
    credentials: true,
  })
);

/* ================= MIDDLEWARE ================= */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ================= ROUTES ================= */

app.use("/api/enquiry", enquiryRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/itinerary", itineraryRoutes);

/* ================= HEALTH CHECK ================= */

app.get("/api/health", (req, res) => {
  res.json({
    status: "Backend running ✅",
    timestamp: new Date().toISOString(),
  });
});

/* ================= ERROR HANDLING ================= */

app.use(notFound);
app.use(errorHandler);

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
