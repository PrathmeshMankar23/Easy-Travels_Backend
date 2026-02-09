import express from "express";
import {
  getItineraryByDestination,
  getItineraryById,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  updateItineraryBulk
} from "../controllers/itineraryController.js";
import { protect } from "../middleware/auth.js";
import { validateItinerary } from "../middleware/validation.js";

const router = express.Router();

// Public routes
router.get("/destination/:destinationId", getItineraryByDestination);
router.get("/:id", getItineraryById);

// Protected routes (admin only)
router.post("/", protect, validateItinerary, createItinerary);
router.put("/:id", protect, validateItinerary, updateItinerary);
router.delete("/:id", protect, deleteItinerary);
router.put("/bulk/:destinationId", protect, updateItineraryBulk);

export default router;
