import express from 'express';
import { getAllUsers, loginUser, registerUser,getAUser, deleteAUser, updateUser, getUser, isAdmin, blockUser, unBlockUser, handleRefreshToken, logoutUser, updatePassword, forgotPasswordToken, resetPassword, getWishlist, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrder, updateOrderStatus, saveUserAddress, getAllOrders, getOrderMetrics, loginWithCookie, deleteSingleProFromCart, removeFromWishlist, findMyDetails } from '../Controllers/AuthController.js';
import { handleFileSizeError, processImages, uploadPhoto } from '../Middlewares/UploadImages.js';

const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/token/login',loginWithCookie);
router.get('/getAllusers',getUser,isAdmin,getAllUsers);
router.get('/getAuser/:id',getUser,isAdmin,getAUser);
router.get('/my-detail',getUser,findMyDetails);
router.post('/deleteAuser/:id',getUser,isAdmin,deleteAUser);

//router.put('/updateAuser',getUser,uploadPhoto.array('images', 10),processImages,handleFileSizeError,updateUser);
router.post('/updateAuser',getUser,uploadPhoto.array('images', 10),processImages,handleFileSizeError,updateUser);
//router.post('/updateAuser',getUser,updateUser);

router.post('/logout',logoutUser);
router.post('/blockAUser/:id',getUser,isAdmin,blockUser);
router.post('/unBlockAUser/:id',getUser,isAdmin,unBlockUser);
router.get('/refresh',handleRefreshToken);
router.put('/updatePassword',getUser,updatePassword);
router.post('/forgotPassword-token',forgotPasswordToken);
router.post('/reset-password/:token',resetPassword);
router.get('/wishlist',getUser,getWishlist);
router.delete('/deletewishlist',getUser,removeFromWishlist);
router.post('/cart',getUser,userCart);
router.get('/getcart',getUser,getUserCart);
router.delete('/emptycart',getUser,emptyCart);
router.delete('/delete-single-pro/:productId',getUser,deleteSingleProFromCart);
router.post('/cart/apply-coupon',getUser,applyCoupon);
router.post('/cart/create-cashorder',getUser,createOrder);
router.get('/cart/get-order',getUser,getOrder);
router.put('/save-address',getUser,saveUserAddress);
router.put('/order/upadte-order/:id',getUser,isAdmin,updateOrderStatus);
router.get('/order/all-order/',getUser,isAdmin,getAllOrders);
router.get('/totalAcc',getUser,isAdmin,getOrderMetrics);


export default router;
