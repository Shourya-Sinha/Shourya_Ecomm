import express from 'express';



import { createBrand, deleteBrand, getABrand, getAllBrand, updateBrand } from '../Controllers/BrandController.js';
import { getUser, isAdmin } from '../Controllers/AuthController.js';

const router = express.Router();

router.post('/createBrand',getUser,isAdmin,createBrand);
router.put('/updateBrand/:id',getUser,isAdmin,updateBrand);
router.delete('/deleteBrand/:id',getUser,isAdmin,deleteBrand);
router.get('/getABrand/:id',getUser,isAdmin,getABrand);
router.get('/getAllBrand',getUser,isAdmin,getAllBrand);

export default router;