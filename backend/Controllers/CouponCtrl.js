import Coupon from '../Models/CouponModel.js';
import asyncHandler from 'express-async-handler';

// Create Coupans

const createCoupon = asyncHandler(async (req, res) => {
    try {
        const { title, discountPrice, expiryDate } = req.body;

        // Check for required fields
        if (!title || !discountPrice || !expiryDate) {
            return res.status(400).json({ status: 'error', message: 'All fields are required' });
        }

        // Convert expiry to a valid date
        const expiry = new Date(expiryDate);
        if (isNaN(expiry.getTime())) {
            return res.status(400).json({ status: 'error', message: 'Invalid date format' });
        }

        const newCoupon = await Coupon.create({ title, discountPrice, expiryDate: expiry });

        return res.status(200).json({
            status: 'success',
            message: 'Coupon created successfully',
            data: newCoupon,
        });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error code
            return res.status(400).json({ status: 'error', message: 'Coupon name already exists' });
        }
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Get All Coupons
const getAllCoupons = asyncHandler(async (req,res) =>{
    try {
        const couons = await Coupon.find();

        if(couons.length < 0){
            return res.status(404).json({status:'error',message: 'No Coupons found'});
        }
        return res.status(200).json({
            status:'success',
            data: couons
        })
    } catch (error) {
        throw new Error(error.message);
    }
});

// Get Single Coupon

const getACoupon = asyncHandler(async (req,res) =>{
    try {
        const {id} = req.params;

        const coupon = await Coupon.findById(id);

        if(!coupon){
            return res.status(404).json({status:'error',message: 'Coupon not found'});
        }
        return res.status(200).json({
            status:'success',
            message:'Coupon Fetched Successfully!',
            data: coupon
        })
    } catch (error) {
        throw new Error(error.message);
    }
});

// Update Coupon
const updateCoupon = asyncHandler(async (req,res)=>{
    try {
        const {id} = req.params;

        const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {new:true});

        if(!updatedCoupon){
           return res.status(404).json({
            status:'error',
            message: 'Coupon not found'
           });
        }
        return res.status(200).json({
            status:'success',
            message: 'Coupon updated successfully',
            data: updatedCoupon
        })
    } catch (error) {
        throw new Error(error.message);
    }
});

// Delete Coupon
const deleteCoupon = asyncHandler(async (req,res) =>{
    try {
        const {id} = req.params;

        const deletedCoupon = await Coupon.findByIdAndDelete(id);

        if(!deletedCoupon){
            return res.status(404).json({
                status:'error',
                message: 'Coupon not found'
            });
        }

        return res.status(200).json({
            status:'success',
            message: 'Coupon deleted successfully'
        })
    } catch (error) {
        throw new Error(error.message);
    }
})

export {createCoupon,getAllCoupons,getACoupon,updateCoupon,deleteCoupon};


