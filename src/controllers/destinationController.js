import prisma from "../lib/prisma.js";

// GET ALL: For your website and admin list
export const getAllDestinations = async (req, res) => {
  try {
    const destinations = await prisma.destination.findMany({
      where: { deletedAt: null }, // Only fetch active trips
      include: {
        itinerary: { orderBy: { day: 'asc' } }, // Sort days 1, 2, 3...
        category: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
};

// GET BY ID: For single destination details (public and admin)
export const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await prisma.destination.findFirst({
      where: { 
        id: id,
        deletedAt: null // Only fetch if not deleted
      },
      include: {
        itinerary: { orderBy: { day: 'asc' } },
        category: true,
      },
    });

    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    res.json(destination);
  } catch (error) {
    console.error("Get destination by ID error:", error);
    res.status(500).json({ error: "Failed to fetch destination" });
  }
};

// CREATE: Saves new trip from Admin Panel
export const createDestination = async (req, res) => {
  try {
    const { itinerary, image, ...rest } = req.body;
    const img = rest.img || image;
    const payload = { ...rest, img, about: rest.about || rest.description || "See description." };
    const itineraryList = Array.isArray(itinerary) ? itinerary : [];

    const newDest = await prisma.destination.create({
      data: {
        ...payload,
        itinerary: {
          create: itineraryList.map((item) => ({
            day: parseInt(item.day, 10) || 1,
            title: item.title || "",
            desc: item.desc || "",
            image: item.image || "",
            activities: Array.isArray(item.activities) ? item.activities : [],
          })),
        },
      },
      include: { itinerary: true },
    });

    res.status(201).json(newDest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving destination" });
  }
};

// UPDATE: Edits existing trip
export const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const { itinerary, ...rest } = req.body;

    const updatedDest = await prisma.$transaction(async (tx) => {
      // 1. Clear old itinerary days to avoid duplicates
      await tx.itinerary.deleteMany({ where: { destinationId: id } });

      // 2. Update destination details and add new itinerary days
      return await tx.destination.update({
        where: { id },
        data: {
          ...rest,
          itinerary: {
            create: itinerary.map((item) => ({
              day: parseInt(item.day),
              title: item.title,
              desc: item.desc,
              image: item.image,
              activities: item.activities,
            })),
          },
        },
        include: { itinerary: true }
      });
    });

    res.json(updatedDest);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
};

// DELETE: Soft delete (hides trip without erasing from DB)
export const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.destination.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
};