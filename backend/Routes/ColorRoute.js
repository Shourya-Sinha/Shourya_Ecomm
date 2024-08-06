import express from 'express';
import { getUser, isAdmin } from '../Controllers/AuthController.js';
import { createColor, deleteColor, getAColor, getAllColors, updateColor } from '../Controllers/ColorControlelr.js';


const router = express.Router();

router.post('/create-color',getUser,isAdmin,createColor);
router.put('/update-color/:id',getUser,isAdmin,updateColor);
router.delete('/delete-color/:id',getUser,isAdmin,deleteColor);
router.get('/getA-color/:id',getUser,isAdmin,getAColor);
router.get('/getAll-color',getUser,isAdmin,getAllColors);

export default router;