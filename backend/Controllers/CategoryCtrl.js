import asyncHandler from "express-async-handler";
import Category from "../Models/CategoryModel.js";

//Create a Category
const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCateogory = await Category.create(req.body);

    if (!newCateogory) {
      return res.status(400).json({
        status: "error",
        message: "Category Name Required",
      });
    }

    return res.status(200).json({
      status: "success",
      data: newCateogory,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Mongoose validation error
      return res.status(400).json({
        status: "error",
        message: "Duplicate Title Not Allowed",
        errors: error.errors,
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Server Error",
      error: error.message,
    });
  }
});

//Update Category
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({
        status: "error",
        message: "Category Not Found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: updatedCategory,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Mongoose validation error
      return res.status(400).json({
        status: "error",
        message: "Duplicate Title Not Allowed",
        errors: error.errors,
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Server Error",
      error: error.message,
    });
  }
});

//Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        status: "error",
        message: "Category Not Found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get A Categorie
const getACategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const getCategory = await Category.findById(id);

    if (!getCategory) {
      return res.status(404).json({
        status: "error",
        message: "Category Not Found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: getCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get All Category
const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const getCategory = await Category.find();

    //Filter out categories

    if (getCategory.length === 0) {
      return res.status(200).json({
        status: "error",
        message: "No Category Found",
      });
    }
    return res.status(200).json({
      status: "success",
      getCategory,
    });
  } catch (error) {
    throw new Error(error);
  }
});



export {
  createCategory,
  updateCategory,
  deleteCategory,
  getACategory,
  getAllCategory,
};
