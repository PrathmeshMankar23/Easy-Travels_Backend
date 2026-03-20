import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ROUTES
import enquiryRoutes from "./routes/enquiryRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

// ✅ IMPORT MAIL FUNCTION
import { sendMail } from "./lib/mailer.js";

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

/* ================= TEST MAIL ROUTE ================= */

app.get("/test-mail", async (req, res) => {
  try {
    console.log("🔥 Test mail route hit");

    await sendMail({
      to: "prathmesh73831@gmail.com",
      subject: "Test Mail",
      html: "<h1>SMTP Working ✅</h1>",
    });

    res.send("Mail Sent ✅");
  } catch (err) {
    console.log("❌ ERROR:", err);
    res.status(500).send("Mail Failed ❌");
  }
});

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