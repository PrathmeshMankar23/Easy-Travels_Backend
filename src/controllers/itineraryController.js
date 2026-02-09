import prisma from "../lib/prisma.js";

// GET BY DESTINATION: Fetch all itinerary days for a destination
export const getItineraryByDestination = async (req, res) => {
  try {
    const { destinationId } = req.params;
    
    const itinerary = await prisma.itinerary.findMany({
      where: { 
        destinationId,
        deletedAt: null 
      },
      orderBy: { day: 'asc' }
    });
    
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch itinerary" });
  }
};

// GET BY ID: Fetch single itinerary day
export const getItineraryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const itinerary = await prisma.itinerary.findUnique({
      where: { id, deletedAt: null },
      include: {
        destination: {
          select: { id: true, title: true }
        }
      }
    });
    
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch itinerary" });
  }
};

// CREATE: Add new itinerary day
export const createItinerary = async (req, res) => {
  try {
    const { destinationId, day, title, desc, image, activities } = req.body;
    
    // Check if destination exists
    const destination = await prisma.destination.findUnique({
      where: { id: destinationId, deletedAt: null }
    });
    
    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }
    
    // Check if day already exists for this destination
    const existingDay = await prisma.itinerary.findFirst({
      where: { 
        destinationId, 
        day: parseInt(day),
        deletedAt: null 
      }
    });
    
    if (existingDay) {
      return res.status(400).json({ error: `Day ${day} already exists for this destination` });
    }
    
    const newItinerary = await prisma.itinerary.create({
      data: {
        destinationId,
        day: parseInt(day),
        title,
        desc,
        image,
        activities: activities || []
      },
      include: {
        destination: {
          select: { id: true, title: true }
        }
      }
    });
    
    res.status(201).json(newItinerary);
  } catch (error) {
    res.status(500).json({ error: "Failed to create itinerary" });
  }
};

// UPDATE: Edit existing itinerary day
export const updateItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const { day, title, desc, image, activities } = req.body;
    
    const updateData = {};
    if (day !== undefined) updateData.day = parseInt(day);
    if (title !== undefined) updateData.title = title;
    if (desc !== undefined) updateData.desc = desc;
    if (image !== undefined) updateData.image = image;
    if (activities !== undefined) updateData.activities = activities;
    
    const updatedItinerary = await prisma.itinerary.update({
      where: { id },
      data: updateData,
      include: {
        destination: {
          select: { id: true, title: true }
        }
      }
    });
    
    res.json(updatedItinerary);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    res.status(500).json({ error: "Failed to update itinerary" });
  }
};

// DELETE: Soft delete itinerary day
export const deleteItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.itinerary.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    
    res.json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete itinerary" });
  }
};

// BULK UPDATE: Update all itinerary days for a destination
export const updateItineraryBulk = async (req, res) => {
  try {
    const { destinationId, itinerary } = req.body;
    
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing itinerary days
      await tx.itinerary.deleteMany({
        where: { destinationId }
      });
      
      // Create new itinerary days
      const newItinerary = await tx.itinerary.createMany({
        data: itinerary.map((item) => ({
          destinationId,
          day: parseInt(item.day),
          title: item.title,
          desc: item.desc,
          image: item.image,
          activities: item.activities || []
        }))
      });
      
      // Return the created itinerary
      return await tx.itinerary.findMany({
        where: { destinationId },
        orderBy: { day: 'asc' }
      });
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update itinerary" });
  }
};
