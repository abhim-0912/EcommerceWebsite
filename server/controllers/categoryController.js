const Category = require('../models/Category');

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    const categoryExists = await Category.findOne({ name: name.trim() });
    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
    }

    const newCategory = await Category.create({ name: name.trim() });

    return res.status(201).json({
      success: true,
      message: 'New category successfully created',
      category: newCategory,
    });

  } catch (error) {
    console.error("Error creating category:", error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating category',
      error: error.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: error.message,
    });
  }
};


const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });

  } catch (error) {
    console.error("Error fetching category:", error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching category',
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    category.name = name.trim();
    await category.save();

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category,
    });

  } catch (error) {
    console.error("Error updating category:", error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating category',
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });

  } catch (error) {
    console.error("Error deleting category:", error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting category',
      error: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
