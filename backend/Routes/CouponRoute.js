import express from 'express';
import { createCoupon, deleteCoupon, getACoupon, getAllCoupons, updateCoupon } from '../Controllers/CouponCtrl.js';
import { getUser, isAdmin } from '../Controllers/AuthController.js';

const router = express.Router();

router.post('/create-coupon',getUser,isAdmin,createCoupon); 
router.get('/getAll-coupon',getUser,isAdmin,getAllCoupons); 
router.get('/getA-coupon/:id',getUser,isAdmin,getACoupon); 
router.put('/update-coupon/:id',getUser,isAdmin,updateCoupon); 
router.delete('/delete-coupon/:id',getUser,isAdmin,deleteCoupon); 

export default router;