import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";

// FORCE IPv4 globally to prevent ENETUNREACH errors on cloud platforms like Render
dns.setDefaultResultOrder("ipv4first");

// ROUTES
import enquiryRoutes from "./routes/enquiryRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();

/* ================= SETUP ================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ================= CORS ================= */

app.use(
  cors({
    origin: true,
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
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);


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

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});