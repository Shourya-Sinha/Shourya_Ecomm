import express from 'express';
import { createCategory, deleteCategory, getACategory, getAllCategory, updateCategory } from '../Controllers/CategoryCtrl.js';
import { getUser, isAdmin } from '../Controllers/AuthController.js';

const router = express.Router();

router.post('/createCategory',getUser,isAdmin,createCategory);
router.put('/updateCategory/:id',getUser,isAdmin,updateCategory);
router.delete('/deleteCategory/:id',getUser,isAdmin,deleteCategory);
router.get('/getACategory/:id',getUser,isAdmin,getACategory);
router.get('/getAllCategory',getUser,getAllCategory);

export default router;