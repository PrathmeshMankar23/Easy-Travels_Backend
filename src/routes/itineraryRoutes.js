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
import { uploadImage } from "../lib/cloudinary.js";

const router = express.Router();

// Public routes
router.get("/destination/:destinationId", getItineraryByDestination);
router.get("/:id", getItineraryById);

// Protected routes (admin only)
router.post("/", protect, validateItinerary, createItinerary);
router.put("/:id", protect, validateItinerary, updateItinerary);
router.delete("/:id", protect, deleteItinerary);
router.put("/bulk/:destinationId", protect, updateItineraryBulk);

// Cloudinary image upload route
router.post("/upload-image", protect, async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Image present:', !!req.body.image);
    console.log('Image length:', req.body.image?.length || 0);
    
    const { image } = req.body;
    
    if (!image) {
      console.log('No image provided in request');
      return res.status(400).json({ error: "No image provided" });
    }
    
    console.log('Attempting to upload image...');
    const result = await uploadImage(image, "itinerary-uploads");
    console.log('Upload successful:', result);
    
    res.json({ 
      url: result.url,
      publicId: result.publicId,
      message: "Image uploaded successfully" 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: error.message || "Failed to upload image",
      details: error.toString()
    });
  }
});

export default router;
