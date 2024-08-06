import asyncHandler from 'express-async-handler';
import Color from '../Models/ColorModel.js';

// Create a Color
const createColor = async (req, res) => {
  try {
    const newColor = await Color.create(req.body);

    if (!newColor) {
      return res.status(400).json({
        status: 'error',
        message: 'Color Name Required',
      });
    }

    res.status(201).json({
      status: 'success',
      data: newColor,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

//Update Color
const updateColor = asyncHandler(async (req,res)=>{
    try {
        const {id} = req.params;
        const updatedColor = await Color.findByIdAndUpdate(id, req.body, {new: true});
        if(!updatedColor){
            return res.status(404).json({
                status:'error',
                message: 'Color not found'
            });
        }
        res.status(200).json({
            status:'success',
            message: 'Color updated successfully',
            data: updatedColor
        });
    } catch (error) {
        throw new Error(error);
    }
});

//Delete Color
const deleteColor = asyncHandler(async (req,res)=>{
    try {
        const {id} = req.params;
        const deletedColor = await Color.findByIdAndDelete(id);
        if(!deletedColor){
            return res.status(404).json({
                status:'error',
                message: 'Color not found'
            });
        }
        res.status(200).json({
            status:'success',
            message: 'Color deleted successfully',
            data: deletedColor
        });
    } catch (error) {
        throw new Error(error);
    }
});

//Get All Colors
const getAllColors = asyncHandler(async (req,res)=>{
    try {
        const colors = await Color.find();
        if(colors.length < 0){
            return res.status(404).json({
                status:'error',
                message:'Colors not found'
            });
        }
        return res.status(200).json({
            status:'success',
            data: colors
        })
    } catch (error) {
        throw new Error(error);
    }
});
//Get A Colors
const getAColor = asyncHandler(async (req,res)=>{
    try {
        const {id} = req.params;

        const color = await Color.findById(id);

        if(!color){
            return res.status(404).json({
                status:'error',
                message: 'Color not found'
            });
        }
        return res.status(200).json({
            status:'success',
            message:'Volor Founded',
            data: color
        })
    } catch (error) {
        throw new Error(error);
    }
})
export {createColor,updateColor,deleteColor,getAllColors,getAColor};