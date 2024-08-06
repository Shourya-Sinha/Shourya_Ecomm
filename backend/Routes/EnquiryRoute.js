import express from 'express';
import { createEnquiry, deleteEnquiry, getAllEnquiries, getSingleEnquiry, updateEnqStatus } from '../Controllers/EnqController.js';
import { getUser, isAdmin } from '../Controllers/AuthController.js';

const router = express.Router();

// Import routes

router.post('/create-enquiry',createEnquiry);
router.get('/get-enquiry/:id',getUser,isAdmin,getSingleEnquiry);
router.get('/get-Allenquiry',getUser,isAdmin,getAllEnquiries);
router.delete('/delete-enquiry/:id',getUser,isAdmin,deleteEnquiry);
router.put('/update-enquiry/:id',getUser,isAdmin,updateEnqStatus);

export default router;