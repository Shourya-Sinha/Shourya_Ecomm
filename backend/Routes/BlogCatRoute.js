import express from 'express';

import { createBlogCategory, deleteBlogCategory, getABlogCategory, getAllBlogCategory, updateBlogCategory } from '../Controllers/BlogCategoryCtrl.js';
import { getUser, isAdmin } from '../Controllers/AuthController.js';

const router = express.Router();

router.post('/createBlogCategory',getUser,isAdmin,createBlogCategory);
router.put('/updateBlogCategory/:id',getUser,isAdmin,updateBlogCategory);
router.delete('/deleteBlogCategory/:id',getUser,isAdmin,deleteBlogCategory);
router.get('/getABlogCategory/:id',getUser,isAdmin,getABlogCategory);
router.get('/getAllBlogCategory',getUser,getAllBlogCategory);

export default router;