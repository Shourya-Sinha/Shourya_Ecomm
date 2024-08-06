import asyncHandler from 'express-async-handler';
import Brand from '../Models/BrandModel.js';

//Create a Category
const createBrand = asyncHandler(async (req, res) => {
  try {
    const newCategory = await Brand.create(req.body);

    if (!newCategory) {
      return res.status(400).json({
        status: "error",
        message: "Brand Name Required",
      });
    }

    return res.status(200).json({
      status: "success",
      data: newCategory,
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
  const updateBrand = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
  
      const updatedCategory = await Brand.findByIdAndUpdate(id, req.body, {
        new: true,
      });
  
      if (!updatedCategory) {
        return res.status(404).json({
          status: "error",
          message: "Brand Not Found",
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
  const deleteBrand = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedCategory = await Brand.findByIdAndDelete(id);
  
      if (!deletedCategory) {
        return res.status(404).json({
          status: "error",
          message: "Brand Not Found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Brand Name deleted successfully",
      });
    } catch (error) {
      throw new Error(error);
    }
  });
  
  //Get A Categorie
  const getABrand = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
  
      const getCategory = await Brand.findById(id);
  
      if (!getCategory) {
        return res.status(404).json({
          status: "error",
          message: "Brand Not Found",
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
  const getAllBrand = asyncHandler(async (req, res) => {
    try {
      const getBrand = await Brand.find();
  
      //Filter out categories
  
      if (getBrand.length === 0) {
        return res.status(200).json({
          status: "error",
          message: "No Brand Found",
        });
      }
      return res.status(200).json({
        status: "success",
        getBrand,
      });
    } catch (error) {
      throw new Error(error);
    }
  });
  
  
  
  export {
    createBrand,
    updateBrand,
    deleteBrand,
    getABrand,
    getAllBrand,
  };