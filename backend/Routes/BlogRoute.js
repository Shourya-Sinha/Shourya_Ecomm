import express from 'express';
import { getUser, isAdmin } from '../Controllers/AuthController.js';
import { createBlog, deleteABlog, dislikeABlog, getABlog, getAllBlogs, likeABlog, updateBlog } from '../Controllers/BlogController.js';
import { processImages, uploadPhoto } from '../Middlewares/UploadImages.js';

const router = express.Router();

router.post('/createblog',getUser,isAdmin,uploadPhoto.array("images",2),processImages,createBlog);
router.put('/updateBlog/:id',getUser,isAdmin,uploadPhoto.array('images',2),processImages,updateBlog);
router.get('/getaBlog/:id',getABlog);
router.get('/getallBlog',getAllBlogs);
router.delete('/deleteBlog/:id',getUser,isAdmin,deleteABlog);
router.post('/likeBlog',getUser,likeABlog);
router.post('/dislikeBlog',getUser,dislikeABlog);



export default router;