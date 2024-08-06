import Product from "../Models/ProductModel.js";
import User from "../Models/UserModel.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import { v2 as cloudinary } from 'cloudinary';
//Create A product
// const createProduct = asyncHandler(async (req, res) => {
//   try {
//     if (req.body.title) {
//       req.body.slug = slugify(req.body.title);
//     }
//     // req.body.images = req.body.images || [];
//     // const newProduct = await Product.create(req.body);

//      const imageUploadsPromises = req.files.map(file => 
//       cloudinary.uploader.upload(file.path, {folder: 'MyEcomm/products'})
//      );

//      const uploadImages = await Promise.all(imageUploadsPromises);

//      const images = uploadImages.map(image => ({
//       public_id: image.public_id,
//       url: image.secure_url,
//      }));

//      const newProduct = await Product.create({...req.body, images});

//     return res.status(200).json({
//       status: "success",
//       message: "Product Created Successfully",
//       product: newProduct,
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// });
const createProduct = asyncHandler(async (req, res) => {
  try {
    // Add slug if title is provided
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    
    // Extract images from req.files and other fields from req.body
    const images = req.files ? req.files : [];
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No images provided or images are not in expected format.',
      });
    }

    // Upload images to Cloudinary
    const imageUploadPromises = images.map((file, index) => {
      console.log(`Uploading image ${index + 1}`);
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'MyEcomm/products' },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        ).end(file.buffer); // Upload file buffer to Cloudinary
      });
    });

    const uploadedImages = await Promise.all(imageUploadPromises);

    const imageDetails = uploadedImages.map(image => ({
      url: image.secure_url,
      public_id: image.public_id,
    }));

    // Create new product with uploaded image details
    const newProduct = await Product.create({ ...req.body, images: imageDetails });

    return res.status(200).json({
      status: 'success',
      message: 'Product Created Successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'An error occurred',
    });
  }
});

// GeT a pRODUCT
const getAProducts = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id", id);
    const findProduct = await Product.findById(id).populate('brand').populate('category').populate('color');

    if (!findProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product Not Found",
      });
    }
    return res.status(200).json({
      status: "success",
      product: findProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get all Product
const getAllProducts = asyncHandler(async (req, res) => {
  try {

    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|eq|in)\b/g,
      (match) => `$${match}`
    );
    let query = Product.find(JSON.parse(queryStr)).populate('brand').populate('color').populate('category');

    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exist");
    }

    const product = await query;

    if (product.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No Products Found",
      });
    }
    return res.status(200).json({
      status: "success",
      products: product,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Delete a Product
// const deleteAProduct = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find the product by ID
//     const product = await Product.findById(id);

//     if (!product) {
//       return res.status(404).json({
//         status: "error",
//         message: "Product Not Found",
//       });
//     }

//     // Extract public IDs from image URLs
//     const imagePublicIds = product.images.map(url => {
//       // Example URL: https://res.cloudinary.com/<cloud_name>/image/upload/v1625810832/MyEcomm/products/<public_id>.jpg
//       const parts = url.split('/');
//       const publicIdWithExtension = parts[parts.length - 1]; // <public_id>.jpg
//       const publicId = publicIdWithExtension.split('.')[0]; // <public_id>
//       return `MyEcomm/products/${publicId}`;
//     });

//     // Delete images from Cloudinary
//     await Promise.all(
//       imagePublicIds.map(publicId => cloudinary.uploader.destroy(publicId))
//     );

//     // Delete the product from the database
//     await Product.findByIdAndDelete(id);

//     return res.status(200).json({
//       status: "success",
//       message: "Product Deleted Successfully",
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// });
const deleteAProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product Not Found",
      });
    }

    // Extract public IDs from the product's image array
    const imagePublicIds = product.images.map(image => image.public_id);

    console.log('Public IDs to delete:', imagePublicIds);

    // Delete images from Cloudinary
    const deletionResults = await Promise.all(
      imagePublicIds.map(publicId =>
        cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
          .then(result => ({ publicId, result }))
          .catch(error => ({ publicId, error }))
      )
    );

    console.log('Cloudinary deletion results:', deletionResults);

    // Delete the product from the database
    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({
      status: "error",
      message: error.message || 'An error occurred while deleting the product',
    });
  }
});
//Update a product

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    if (req.files && req.files.length > 0) {
      const oldImagePublicIds = existingProduct.images.map(image => image.public_id);

      const imageUploadPromises = req.files.map(file => 
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'MyEcomm/products' },
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

      await Promise.all(
        oldImagePublicIds.map(publicId =>
          cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
        )
      );

      const imageDetails = uploadedImages.map(image => ({
        public_id: image.public_id,
        url: image.secure_url,
      }));

      req.body.images = imageDetails;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(500).json({
        status: "error",
        message: "An error occurred while updating the blog",
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'An error occurred while updating the product',
    });
  }
});

//Add to Wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const { prodId } = req.body;

    const user = await User.findById(_id);

    const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyAdded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        { new: true }
      );
      //res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        { $push: { wishlist: prodId } },
        { new: true }
      );
      //res.json(user);
    }
    return res.status(200).json({
      status: "success",
      message: "Product added to wishlist Successfully!",
      data: user,
    });
  } catch (error) {
    throw new Error(error);
  }
});


// Ratings

const ratings = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    //console.log('user id',_id);
    const { star, prodId,comment,revTitle, name,email} = req.body;

    const product = await Product.findById(prodId);
    let alreadyAdded = product.ratings.find(
      (userId) => userId.postedBy.toString() === _id.toString()
    );

    if (alreadyAdded) {
        const upadtedRating = await Product.updateOne({
            ratings:{$elemMatch:alreadyAdded}
        },
        {
            $set:{"ratings.$.star":star,"ratings.$.comment":comment}},{new:true});
           // res.json(upadtedRating);
    } else {
      const ratedroduct = await Product.findByIdAndUpdate(
        prodId,
        { $push: { ratings: { star: star,comment:comment ,postedBy: _id ,name:name,email:email,revTitle:revTitle} } },
        { new: true }
      );
      //res.json(ratedroduct);
    }
    const getallRatings = await Product.findById(prodId);
    let totalRating = getallRatings.ratings.length;
    let ratingsum = getallRatings.ratings.map((item) => item.star).reduce((prev,cur)=>prev+cur,0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalProduct = await Product.findByIdAndUpdate(prodId, {totalRatings:actualRating},{new:true});

    res.json(finalProduct);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
});

//upload Images on Product
const uploadImages = asyncHandler(async (req,res) =>{
  console.log(req.files);
  return res.status(200).json({
    status:'success',
    message: 'Images uploaded successfully!',
  })
});

//


//Exporting the functions
export {
  createProduct,
  getAProducts,
  getAllProducts,
  updateProduct,
  deleteAProduct,
  addToWishlist,
  ratings,
  uploadImages,
};
