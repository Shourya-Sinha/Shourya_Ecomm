import express from 'express';
import { addToWishlist, createProduct, deleteAProduct, getAllProducts, getAProducts, ratings, updateProduct, uploadImages } from '../Controllers/ProductController.js';
import { getUser, isAdmin } from '../Controllers/AuthController.js';
import { handleFileSizeError, processImages, productImgResize, uploadPhoto } from '../Middlewares/UploadImages.js';


const router = express.Router();
router.post(
    '/createProduct',
    getUser,
    isAdmin,
    uploadPhoto.array('images', 10), // Handle up to 10 images
    processImages, // Process and resize images
    handleFileSizeError, // Handle file size errors
    createProduct // Controller to handle product creation
  );
// router.post('/createProduct',getUser,isAdmin,uploadPhoto.array("images",10),processImages,createProduct);
router.get('/getaProduct/:id',getAProducts);
router.get('/getallProduct',getAllProducts);
router.put('/updateAproduct/:id',getUser,isAdmin,uploadPhoto.array('images', 10),processImages,handleFileSizeError,updateProduct);
router.delete('/deleteAproduct/:id',getUser,isAdmin,deleteAProduct);
router.put('/addtoWuihlist',getUser,addToWishlist);
router.put('/ratings',getUser,ratings);
router.put('/upload/:id',getUser,isAdmin,uploadPhoto.array('images',10),productImgResize,uploadImages)

export default router;