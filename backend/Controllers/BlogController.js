import asyncHandler from "express-async-handler";
import Blog from "../Models/BlogModel.js";
import User from "../Models/UserModel.js";
import slugify from "slugify";
import { v2 as cloudinary } from 'cloudinary';
import { request } from "express";

//Ceate A Blog
const createBlog = asyncHandler(async (req, res) => {
  try {
    //const newBlog = await Blog.create(req.body);
    const user = req.user;
    const foundUser = await User.findById(user._id);
    //const newblog = req.body;
    if (!foundUser) {
      return res.status(404).json({
        status: "error",
        message: "User Not Found",
      });
    }

    const images = req.files ? req.files : [];
    if(!Array.isArray(images) || images.length === 0){
      return res.status(400).json({
        status: "error",
        message: "Please upload at least one image",
      });
    }
    //upload images to Cloudinary
    const imageUploadPromise = images.map((file,index)=>{
      console.log(`Uploading image ${index + 1}`);
      return new Promise((resolve,reject)=>{
        cloudinary.uploader.upload_stream(
          {folder:'MyEcomm/BlogsImages'},
          (error,result)=>{
            if(error){
              return reject(error);
            }
            resolve(result);
          }
        ).end(file.buffer);
      });
    });

    const uploadedImages = await Promise.all(imageUploadPromise);

    const imageDeatils = uploadedImages.map(images =>({
      public_id: images.public_id,
      url: images.secure_url,
    }));

    const newBlog = (await Blog.create({...req.body,images:imageDeatils}));

    return res.status(201).json({
      status: "success",
      message: "Blog Created Successfully",
      blog: newBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Update A Blog

// const updateBlog = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params;

//     const existingBlog = await Blog.findById(id);

//     if (!existingBlog) {
//       return res.status(404).json({
//         status: "error",
//         message: "Blog Not Found",
//       });
//     }

//     if(req.files && req.files.length > 0) {
//       const oldImageublicIds = existingBlog.images.map(image => image.public_id);

//       const imageUloadPromises = req.files.map(file =>
//         new Promise((resolve,reject)=>{
//           cloudinary.uploader.upload_stream(
//             {folder:'MyEcomm/BlogsImages'},
//             (error,result)=>{
//               if(error){
//                 return reject(error);
//               }
//               resolve(result);
//             }
//           ).end(file.buffer);
//         })
//       );
//       const uloadImages = await Promise.all(imageUloadPromises);

//       await Promise.all(
//         oldImageublicIds.map(publicId =>
//           cloudinary.uploader.destroy(publicId, {resource_type:'image'})
//         )
//       );

//       const imageDeatils = uloadImages.map(image => ({
//         public_id: image.public_id,
//         url: image.secure_url,
//       }));
//       req.body.images = imageDeatils;
//     }

//     const updatedBlog = await Blog.findByIdAndUpdate(id,req.body,{new:true,runValidators:true});    return res.status(200).json({
//       status: "success",
//       message: "Blog Updated Successfully",
//       blog: updatedBlog,
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// });
const updateBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const existingBlog = await Blog.findById(id);

    if (!existingBlog) {
      return res.status(404).json({
        status: "error",
        message: "Blog Not Found",
      });
    }

    // Update slug if title is provided
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    if (req.files && req.files.length > 0) {
      // Get public IDs of old images
      const oldImagePublicIds = existingBlog.images.map(image => image.public_id);

      // Upload new images
      const imageUploadPromises = req.files.map(file =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'MyEcomm/BlogsImages' },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result);
            }
          ).end(file.buffer);
        })
      );

      const uploadedImages = await Promise.all(imageUploadPromises);

      // Delete old images from Cloudinary
      await Promise.all(
        oldImagePublicIds.map(publicId =>
          cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
        )
      );

      // Prepare new image details
      const imageDetails = uploadedImages.map(image => ({
        public_id: image.public_id,
        url: image.secure_url,
      }));

      req.body.images = imageDetails;
    }

    // Update the blog
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedBlog) {
      return res.status(500).json({
        status: "error",
        message: "An error occurred while updating the blog",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Blog Updated Successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    return res.status(500).json({
      status: "error",
      message: error.message || "An error occurred",
    });
  }
});

//Get A Blog
const getABlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const getBlog = await Blog.findById(id).populate("likes").populate('disLikes');

    const updateViews = await Blog.findByIdAndUpdate(
        id,
        {$inc: {numViews:1},
    },
    {new:true}
    )

    if (!getBlog) {
      return res.status(404).json({
        status: "error",
        message: "Blog Not Found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Blog Found",
      blog: getBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get All Blogs

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const getallBlog = await Blog.find().populate("category");

    if (getallBlog.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No Blogs Found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "All Blogs Found",
      blogs: getallBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Delete A Blog
const deleteABlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findById(id);

    if (!deletedBlog) {
      return res.status(404).json({
        status: "error",
        message: "Blog Not Found",
      });
    }
    //Extract Public Ids
    const imagePublicIds = deletedBlog.images.map((image) => image.public_id);

    //Delete images from cloudinary
    const deletionResult = await Promise.all(
      imagePublicIds.map(publicId => 
        cloudinary.uploader.destroy(publicId, {resource_type:'image'})
            .then(result => ({publicId,result}))
            .catch(error => ({publicId,error}))
      )
    );
    await Blog.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "Blog Deleted Successfully",
      blog: deletedBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Like a Blog
const likeABlog = asyncHandler(async (req, res) => {
  try {
    const { blogid } = req.body;
    //find current user id which user currently seen or logidin
    const loggedUserId = req?.user?.id;
    //find the blog which you seen
    const blog = await Blog.findById(blogid);

    //find if user already disliked the blog
    // const alreadyDisLiked = Blog?.disLikes?.find(
    //   (userId) => userId?.toString() === loggedUserId.toString()
    // );
    const alreadyDisLiked = blog.disLikes.includes(loggedUserId);

    if (alreadyDisLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogid,
        {
          $pull: { disLikes: loggedUserId },
          isDisLiked: false,
        },
        { new: true }
      );
    }

    // Check if user already liked the blog
    const isliked = blog.likes.includes(loggedUserId);

    if (isliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogid,
        {
          $pull: { likes: loggedUserId },
          isLiked: false,
        },
        { new: true }
      );
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogid,
        {
          $push: { likes: loggedUserId },
          isLiked: true,
        },
        { new: true }
      );
    }
    return res.status(200).json({
      status: "success",
      message: "Blog Liked Successfully",
      blog: blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Dislike a Blog
const dislikeABlog = asyncHandler(async (req,res) =>{
    try {
        const {blogId} = req.body;
        const logginUserId = req?.user?.id;

        const blog = await Blog.findById(blogId);
        //console.log('Blogid ',blogId);

        if(!blog){
            return res.status(404).json({
                status:'error',
                message:"Blog Not Found"
            });
        }


        // const alreadyLiked = Blog?.likes?.find(
        //     (userId) => userId?.toString() === logginUserId.toString()
        // );

        const alreadyLiked = blog.likes.includes(logginUserId);

        if (alreadyLiked) {
            const updatedBlog = await Blog.findByIdAndUpdate(
                blogId,
                {
                    $pull: { likes: logginUserId },
                    isLiked: false,
                },
                { new: true }
            );
        }

            // Check if user already disliked the blog
           const isDisliked = blog.disLikes.includes(logginUserId);

           if(isDisliked) {
            const updatedBlog = await Blog.findByIdAndUpdate(
                blogId,
                {
                    $pull: { disLikes: logginUserId },
                    isDisLiked: false,
                }
            )
           }else{
            const updatedBlog = await Blog.findByIdAndUpdate(
                blogId,{
                    $push: { disLikes: logginUserId },
                    isDisLiked: true,
                }
            );
           
           }
           return res.status(200).json({
            status: "success",
            message: "Blog Disliked Successfully",
            blog: blog,
        })
    } catch (error) {
        throw new Error(error);
    }
});



export {
  createBlog,
  updateBlog,
  getABlog,
  getAllBlogs,
  deleteABlog,
  likeABlog,
  dislikeABlog,
};
