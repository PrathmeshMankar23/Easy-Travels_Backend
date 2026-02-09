import express from 'express';
import { 
  getAllDestinations, 
  createDestination, 
  updateDestination, 
  deleteDestination 
} from '../controllers/destinationController.js';
import { protect } from '../middleware/auth.js';
import { validateDestination } from '../middleware/validation.js';

const router = express.Router();

// Public: Fetch destinations for your website
router.get('/', getAllDestinations);

// Admin: Manage destinations (protected routes)
router.post('/', protect, validateDestination, createDestination);      // Create
router.put('/:id', protect, validateDestination, updateDestination);    // Edit
router.delete('/:id', protect, deleteDestination); // Delete

export default router;