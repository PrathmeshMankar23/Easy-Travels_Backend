import prisma from "../lib/prisma.js";

// GET ALL: Fetch all active categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { deletedAt: null, isActive: true },
      include: {
        _count: {
          select: { destinations: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// GET BY ID: Fetch single category with destinations
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id, deletedAt: null },
      include: {
        destinations: {
          where: { deletedAt: null },
          include: {
            _count: {
              select: { itinerary: true }
            }
          }
        }
      }
    });
    
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

// CREATE: Add new category
export const createCategory = async (req, res) => {
  try {
    const { name, slug, isActive = true } = req.body;
    
    // Generate slug if not provided
    const categorySlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const newCategory = await prisma.category.create({
      data: {
        name,
        slug: categorySlug,
        isActive
      }
    });
    
    res.status(201).json(newCategory);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Category name or slug already exists" });
    }
    res.status(500).json({ error: "Failed to create category" });
  }
};

// UPDATE: Edit existing category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, isActive } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData
    });
    
    res.json(updatedCategory);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Category name or slug already exists" });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(500).json({ error: "Failed to update category" });
  }
};

// DELETE: Soft delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category has destinations
    const destinationCount = await prisma.destination.count({
      where: { categoryId: id, deletedAt: null }
    });
    
    if (destinationCount > 0) {
      return res.status(400).json({ 
        error: "Cannot delete category with existing destinations. Please delete or reassign destinations first." 
      });
    }
    
    await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};
