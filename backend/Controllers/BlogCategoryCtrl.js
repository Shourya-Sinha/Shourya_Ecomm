import asyncHandler from 'express-async-handler';
import BlogCat from '../Models/BlogCatModel.js';

//Create a Category
const createBlogCategory = asyncHandler(async (req, res) => {
    try {
      const newCateogory = await BlogCat.create(req.body);
  
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
  const updateBlogCategory = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
  
      const updatedCategory = await BlogCat.findByIdAndUpdate(id, req.body, {
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
  const deleteBlogCategory = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedCategory = await BlogCat.findByIdAndDelete(id);
  
      if (!deletedCategory) {
        return res.status(404).json({
          status: "error",
          message: "Category Not Found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Blog Category deleted successfully",
      });
    } catch (error) {
      throw new Error(error);
    }
  });
  
  //Get A Categorie
  const getABlogCategory = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
  
      const getCategory = await BlogCat.findById(id);
  
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
  const getAllBlogCategory = asyncHandler(async (req, res) => {
    try {
      const getCategory = await BlogCat.find();
  
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
    createBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
    getABlogCategory,
    getAllBlogCategory,
  };