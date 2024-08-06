import asyncHandler from "express-async-handler";
import Enquiry from "../Models/EnqModel.js";
import User from '../Models/UserModel.js';
//Create Enquiry
const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);

    if (!newEnquiry) {
      return res.status(400).json({
        status: "error",
        message: "Failed to create Enquiry",
      });
    }
    return res.status(201).json({
      status: "success",
      message: "Enquiry created successfully",
      enquiry: newEnquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//delete Enquiry
const deleteEnquiry = asyncHandler(async (req,res) =>{
    try {
        const {id} = req.params;
        const {_id} = req.user;

        const user = await User.findById(_id);
        if(!user || user.role!=='admin'){
            return res.status(403).json({
                status:'error',
                message: 'Unauthorized to delete this enquiry'
            });
        }

        const deletedEnquiry = await Enquiry.findByIdAndDelete(id);

        if(!deletedEnquiry){
            return res.status(404).json({
                status:'error',
                message: 'Enquiry not found'
            });
        }
        return res.status(200).json({
            status:'success',
            message:'Enquiry deleted successfully',
            enquiry: deletedEnquiry
        })
    } catch (error) {
        throw new Error(error);
    }
});

//get Single Enquiry

const getSingleEnquiry = asyncHandler(async (req, res) => {
  try {
    const {id} = req.params;
    const {_id} = req.user;

    const user = await User.findById(_id);
    if(!user || user.role!=='admin'){
        return res.status(403).json({
            status:'error',
            message: 'Unauthorized to view this enquiry'
        });
    }
    const enquiry = await Enquiry.findById(id);

    if (!enquiry) {
      return res.status(404).json({
        status: "error",
        message: "Enquiry not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Enquiry found",
      enquiry,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//get All Enquiries

const getAllEnquiries = asyncHandler(async (req, res) => {
  try {
    const {id} = req.user;
    const user = await User.findById(id);
    if(!user || user.role!=='admin'){
        return res.status(403).json({
            status:'error',
            message: 'Unauthorized to view all enquiries'
        });
    }
    const enquiries = await Enquiry.find();
    if(enquiries.length < 0){
        return res.status(404).json({
            status:'error',
            message:'Enquiries not found'
        });
    }
    return res.status(200).json({
      status: "success",
      message: "All Enquiries",
      enquiries,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateEnqStatus = asyncHandler(async (req,res)=>{
  try {
    const {id} = req.params;
    const {_id} = req.user;
    const user = await User.findById(_id);
    if(!user || user.role!=='admin'){
      return res.status(403).json({
        status:'error',
        message: 'Unauthorized to update enquiry status'
      });
    }
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {new:true});
    if(!updatedEnquiry){
      return res.status(404).json({
        status:'error',
        message: 'Enquiry not found'
      });
    }
    return res.status(200).json({
      status:'success',
      message: 'Enquiry status updated successfully',
      enquiry: updatedEnquiry
    });
  } catch (error) {
    throw new Error(error);
  }
})

export {createEnquiry,getAllEnquiries,getSingleEnquiry,deleteEnquiry,updateEnqStatus};