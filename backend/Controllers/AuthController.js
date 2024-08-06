import User from "../Models/UserModel.js";
import Product from "../Models/ProductModel.js";
import Cart from "../Models/CartModel.js";
import Coupon from "../Models/CouponModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import GenerateToken from "../Middlewares/GenerateJwtToken.js";
import { promisify } from "util";
import validateMonoDbid from "../Utils/ValidateMongoDbId.js";
import GenerateRefreshToken from "../Utils/RefreshToken.js";
import crypto from "crypto";
import sendMail from "../Middlewares/MailSender.js";
import Order from "../Models/OrderModel.js";
import Category from '../Models/CategoryModel.js'
import Address from '../Models/AddressModel.js';
import uniqid from "uniqid";
import { v2 as cloudinary } from 'cloudinary';

//Register User
const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNo, password } = req.body;

    if (!firstName || !lastName || !email || !password || !phoneNo) {
      return res.status(400).json({
        status: "error",
        message: "Please provide all required fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      //create a new user
      const newUser = await User.create(req.body);

      return res.status(200).json({
        status: "success",
        message: "User registered successfully",
        user: newUser,
      });
    } else {
      // User already exist
      return res.status(400).json({
        status: "error",
        message: "User with this email already exists",
      });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle validation error by sending a response with the error details
      return res.status(400).json({
        status: "error",
        message:
          "Validation error! Please Use Valid Email Address or Valid Pasword",
        //errors: error.errors,
      });
    }
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

//Login User
const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide both email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email ",
      });
    }

    const isMatch = await user.ispasswordMatched(password);

    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid password",
      });
    }
    const refreshToken = await GenerateRefreshToken(user?._id);

    const updateUser = await User.findOneAndUpdate(
      { _id: user.id },
      { refreshToken: refreshToken },
      {tokenVersion: user.tokenVersion + 1},
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None'
    });

    const token = GenerateToken({ id: user._id });

    return res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token,
      user:{
        email: user.email,
        username: user.firstName,
        userId:user._id,
      }
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Admin Login
const loginAdmin = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide both email and password",
      });
    }

    const admin = await User.findOne({ email }).select("+password");

    if (admin.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to access this This is Admin Route!",
      });
    }

    if (!admin) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email ",
      });
    }

    const isMatch = await admin.ispasswordMatched(password);

    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid password",
      });
    }
    const refreshToken = await GenerateRefreshToken(admin?._id);
    const updateUser = await User.findOneAndUpdate(
      { _id: admin.id },
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    const token = GenerateToken({ id: admin._id });

    return res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token,
      admin,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const handleRefreshToken = asyncHandler(async (req, res) => {
  try {
    const cookie = req.cookies;
    //console.log(cookie);

    if (!cookie?.refreshToken) {
      throw new Error("No REfresh Token in Cookies");
    }
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await User.findOne({ refreshToken });
    if (!user) {
      throw new Error("No Refresh Token present in DB or not matched");
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err || user.id !== decoded.id) {
          throw new Error("There is something wrong with refresh totken");
        }
      }
    });
    const accessToken = GenerateToken(user?.id);
    return res.status(200).json({
      status: "success",
      message: "User authenticated successfully",
      accessToken,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Logout
const logoutUser = asyncHandler(async (req, res) => {
  try {
    const cookie = req.cookies;

    if (!cookie?.refreshToken) {
      return res.status(204).json({
        status: "error",
        message: "No refresh token in cookies",
      }) // No cookies to clear
    }
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);

    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.clearCookie("refreshToken", {
        httpOnly: "true",
        secure: true,
      });
    }

    await User.findOneAndUpdate(
      { refreshToken },
      {
        refreshToken: "",
      }
    );
    res.clearCookie("refreshToken", {
      httpOnly: "true",
      secure: true,
    });
    return res.status(200).json({
      status: "success",
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

//Find user with token
const getUser = asyncHandler(async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else {
      return res.status(401).json({
        status: "error",
        message: "You are not authenticated Please Login Again!",
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //console.log('decoded',decoded);

    const user = await User.findById(decoded.id.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    req.user = user;
    req.id = user._id;
    console.log("id in middlwware", user._id);
    console.log("user", user);
    next();
  } catch (error) {
    throw new Error(error);
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.user;
    const user = await User.findOne({ email });
    if (user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "You are not authrise to perform this action",
      });
    } else {
      next();
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Update a User

const updateUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    //console.log(id);
    validateMonoDbid(id);
    //const { firstName, lastName, phoneNo } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if(req.files && req.files.length > 0) {
      const oldAvatar = user.images.map(images => images.public_id)

      const imagesUploadPromises = req.files.map(file => 
        new Promise((resolve,reject)=>{
          cloudinary.uploader.upload_stream(
            {folder:"MyEcomm/UserImages"},
            (error,result)=>{
              if(error){
                return reject(error)
              }
              resolve(result);
            }
          ).end(file.buffer);
        })
      );
      const uploadImages = await Promise.all(imagesUploadPromises);

      await Promise.all(
        oldAvatar.map(publicId => cloudinary.uploader.destroy(publicId, {resource_type:'image'}))
      );
      const imageDetails = uploadImages.map(image => ({
        public_id: image.public_id,
        url: image.secure_url,
        // width: image.width,
        // height: image.height,
      }));
      req.body.images = imageDetails;
    }


    // user.firstName = firstName || user.firstName;
    // user.lastName = lastName || user.lastName;
    // user.phoneNo = phoneNo || user.phoneNo;

    

    const updatedUser = await User.findByIdAndUpdate(user.id,req.body,{new:true,runValidators:true});

    if(!updateUser){
      return res.status(400).json({
        status: "error",
        message: "User not updated",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Block user
const blockUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMonoDbid(id);
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );

    if (!block) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "User blocked successfully",
      user: block,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//UnBlock user
const unBlockUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMonoDbid(id);
    const unBlock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );

    if (!unBlock) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "User unblocked successfully",
      user: unBlock,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// save user address

const saveUserAddress = asyncHandler(async (req, res) => {
  try {
    const {_id} = req.user;

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address:req?.body?.address,
      },
      {new:true},
    )
    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "User address saved successfully",
      user: updatedUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get All User

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getAllUser = await User.find();

    return res.status(200).json({
      status: "success",
      users: getAllUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Get a SINGle User
const getAUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    //console.log(id);
    validateMonoDbid(id);
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User Founded with this Id",
      user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Delete a User
const deleteAUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    //console.log(id);
    validateMonoDbid(id);
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User Deleted with this Id",
      user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Update password controller ID:", userId);
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        status: "error",
        message: "Password is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    user.password = password;
    const updatedUser = await user.save();

    return res.status(200).json({
      status: "success",
      message: "Password updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// const updatePassword = asyncHandler(async (req,res)=>{
//   try {
//     const {id} = req.user._id;
//     console.log('update password controller id',id);
//     const password = req.body;
//     //validateMonoDbid(id);
//     const user = await User.findById(_id);

//     if(password){
//       user.password = password;
//       const updatedPassword = await user.save();
//       return res.status(200).json({
//         status: "success",
//         message: "Password updated successfully",
//         user: updatedPassword,
//       });
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });

//Forgot Password

const forgotPasswordToken = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found with this email",
      });
    }
    const token = await user.createPasswordResetToken();
    await user.save();
    // console.log(
    //   "token in forgotpassword controller first where sending url ",
    //   token
    // );

    const resetUrl = `http://localhost:7000/auth/user/reset-password/${token}`;

    const emailData = {
      recipient: user.email,
      subject: "Reset Password",
      text: `Your reset Password Link is here please Click  valid on 10 minutes ${resetUrl}`,
      html: `<p>Your reset Password Link is here please Click  valid on 10 minutes <a href=${resetUrl}>Reset Password</a></p>`,
    };
    await sendMail(emailData);

    return res.status(200).json({
      status: "success",
      message: "Reset Password Email has been sent",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { password } = req.body;

    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        status: "error",
        message: "Token is missing",
      });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    console.log("direct token", token);
    console.log("token in reset password controller from params", hashedToken);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found or token expired",
      });
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Get Wishlist Item
const getWishlist = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id).populate("wishlist");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User's wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//delete single Item from wishlist
// const removeFromWishlist = asyncHandler(async (req, res) => {
//   try {
//     const { _id } = req.user; // Get the user ID from the request (assuming user is authenticated)
//     const { prodId } = req.body; // Get the product ID from the request body

//     // Find the user by ID
//     const user = await User.findById(_id);

//     if (!user) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found",
//       });
//     }

//     // Check if the product is in the user's wishlist
//     const productIndex = user.wishlist.findIndex((id) => id.toString() === prodId);

//     if (productIndex === -1) {
//       return res.status(404).json({
//         status: "error",
//         message: "Product not found in wishlist",
//       });
//     }

//     // Remove the product from the wishlist
//     user.wishlist.splice(productIndex, 1);
//     await user.save();

//     return res.status(200).json({
//       status: "success",
//       message: "Product removed from wishlist successfully",
//       wishlist: user.wishlist,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// });
const removeFromWishlist = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user; // Get the user ID from the request (assuming user is authenticated)
    const { prodId } = req.body; // Get the product ID from the request body

    // Find the user by ID and update their wishlist by pulling the product ID
    const user = await User.findByIdAndUpdate(
      _id,
      { $pull: { wishlist: prodId } },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Product removed from wishlist successfully",
      wishlist: user.wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// User Cart
// const userCart = asyncHandler(async (req, res) => {
//   try {
//     const { cart } = req.body;
//     const { id } = req.user;
//     let products = [];
//     const user = await User.findById(id);

//     // Check if cart already exists for the user
//     const alreadyExistCart = await Cart.findOne({ orderBy: user.id });
//     if (alreadyExistCart) {
//       await Cart.deleteOne({ _id: alreadyExistCart._id });
//     }

//     // Create new cart items
//     for (let i = 0; i < cart.length; i++) {
//       let object = {};
//       object.product = cart[i].id;
//       object.count = cart[i].count;
//       object.color = cart[i].color;
//       let getPrice = await Product.findById(cart[i].id).select("price").exec();
//       object.price = getPrice.price;
//       products.push(object);
//     }

//     // Calculate cart total
//     let cartTotal = 0;
//     for (let i = 0; i < products.length; i++) {
//       cartTotal += products[i].price * products[i].count;
//     }

//     // Save new cart
//     const newCart = await new Cart({
//       products,
//       cartTotal,
//       orderBy: user.id,
//     }).save();

//     return res.status(200).json({
//       status: "success",
//       message: "User's cart updated successfully",
//       cart: newCart,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: "error",
//       message: error.message || "An error occurred while updating the cart",
//     });
//   }
// });
// const userCart = asyncHandler(async (req, res) => {
//   try {
//     const { cart } = req.body;
//     const { id } = req.user;
//     const user = await User.findById(id);

//     // Retrieve the existing cart for the user
//     let existingCart = await Cart.findOne({ orderBy: user.id });

//     // Prepare the products array
//     let products = [];

//     // Process the cart items
//     for (let i = 0; i < cart.length; i++) {
//       let object = {};
//       object.product = cart[i].id;
//       object.count = cart[i].count;
//       object.color = cart[i].color;

//       // Get the price of the product
//       let getPrice = await Product.findById(cart[i].id).select("price").exec();
//       object.price = getPrice.price;

//       products.push(object);
//     }

//     // Calculate cart total
//     let cartTotal = 0;
//     for (let i = 0; i < products.length; i++) {
//       cartTotal += products[i].price * products[i].count;
//     }

//     if (existingCart) {
//       // Update the existing cart
//       const updatedProducts = [...existingCart.products];

//       for (let i = 0; i < products.length; i++) {
//         const index = updatedProducts.findIndex(
//           (item) =>
//             item.product.toString() === products[i].product.toString() &&
//             item.color.toString() === products[i].color.toString()
//         );

//         if (index !== -1) {
//           // Update existing product quantity
//           updatedProducts[index].count += products[i].count;
//         } else {
//           // Add new product
//           updatedProducts.push(products[i]);
//         }
//       }

//       // Update the cart total and save the cart
//       existingCart.products = updatedProducts;
//       existingCart.cartTotal = cartTotal;
//       await existingCart.save();

//       return res.status(200).json({
//         status: "success",
//         message: "User's cart updated successfully",
//         cart: existingCart,
//       });
//     } else {
//       // Create a new cart if none exists
//       const newCart = await new Cart({
//         products,
//         cartTotal,
//         orderBy: user.id,
//       }).save();

//       return res.status(200).json({
//         status: "success",
//         message: "User's cart created successfully",
//         cart: newCart,
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       status: "error",
//       message: error.message || "An error occurred while updating the cart",
//     });
//   }
// });


//Get User Cart

// const userCart = asyncHandler(async (req, res) => {
//   try {
//     const { cart } = req.body;
//     const { id } = req.user;
//     const user = await User.findById(id);

//     // Retrieve the existing cart for the user
//     let existingCart = await Cart.findOne({ orderBy: user.id });

//     // Prepare the products array
//     let products = [];

//     // Process the cart items
//     for (let i = 0; i < cart.length; i++) {
//       let object = {};
//       object.product = cart[i].id;
//       object.count = cart[i].count;
//       object.color = cart[i].color;

//       // Get the price of the product
//       let getPrice = await Product.findById(cart[i].id).select("price").exec();
//       object.price = getPrice ? getPrice.price : 0; // Default to 0 if price not found

//       products.push(object);
//     }

//     // Calculate cart total
//     let cartTotal = 0;
//     for (let i = 0; i < products.length; i++) {
//       cartTotal += products[i].price * products[i].count;
//     }

//     if (existingCart) {
//       // Update the existing cart
//       const updatedProducts = [...existingCart.products];

//       for (let i = 0; i < products.length; i++) {
//         const index = updatedProducts.findIndex(
//           (item) =>
//             item.product.toString() === products[i].product.toString() &&
//             (item.color ? item.color.toString() : '') === (products[i].color ? products[i].color.toString() : '')
//         );

//         if (index !== -1) {
//           // Update existing product quantity
//           updatedProducts[index].count += products[i].count;
//         } else {
//           // Add new product
//           updatedProducts.push(products[i]);
//         }
//       }

//       // Update the cart total and save the cart
//       existingCart.products = updatedProducts;
//       existingCart.cartTotal = cartTotal;
//       await existingCart.save();

//       return res.status(200).json({
//         status: "success",
//         message: "User's cart updated successfully",
//         cart: existingCart,
//       });
//     } else {
//       // Create a new cart if none exists
//       const newCart = await new Cart({
//         products,
//         cartTotal,
//         orderBy: user.id,
//       }).save();

//       return res.status(200).json({
//         status: "success",
//         message: "User's cart created successfully",
//         cart: newCart,
//       });
//     }
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     return res.status(500).json({
//       status: "error",
//       message: error.message || "An error occurred while updating the cart",
//     });
//   }
// });
const userCart = asyncHandler(async (req, res) => {
  try {
    const { cart } = req.body;
    const { id } = req.user;
    const user = await User.findById(id);

    // Retrieve the existing cart for the user
    let existingCart = await Cart.findOne({ orderBy: user.id });

    // Prepare the products array
    let products = [];

    // Process the cart items
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i].id;
      object.count = cart[i].count;
      object.color = cart[i].color;

      // Get the price of the product
      let getPrice = await Product.findById(cart[i].id).select("price").exec();
      object.price = getPrice ? getPrice.price : 0; // Default to 0 if price not found

      products.push(object);
    }

    // Debugging: Log product details and calculated cart total
    console.log('Products:', products);

    // Calculate cart total
    let cartTotal = products.reduce((total, item) => total + item.price * item.count, 0);

    console.log('Calculated Cart Total:', cartTotal);

    if (existingCart) {
      // Update the existing cart
      const updatedProducts = [...existingCart.products];
      
      // Log the existing products before updating
      console.log('Existing Cart Products:', updatedProducts);

      for (let i = 0; i < products.length; i++) {
        const index = updatedProducts.findIndex(
          (item) =>
            item.product.toString() === products[i].product.toString() &&
            (item.color ? item.color.toString() : '') === (products[i].color ? products[i].color.toString() : '')
        );

        if (index !== -1) {
          // Update existing product quantity
          updatedProducts[index].count += products[i].count;
        } else {
          // Add new product
          updatedProducts.push(products[i]);
        }
      }

      // Log the updated products
      console.log('Updated Products:', updatedProducts);

      // Update the cart total and save the cart
      existingCart.products = updatedProducts;
      existingCart.cartTotal = updatedProducts.reduce((total, item) => total + item.price * item.count, 0);
      await existingCart.save();

      return res.status(200).json({
        status: "success",
        message: "User's cart updated successfully",
        cart: existingCart,
      });
    } else {
      // Create a new cart if none exists
      const newCart = await new Cart({
        products,
        cartTotal,
        orderBy: user.id,
      }).save();

      return res.status(200).json({
        status: "success",
        message: "User's cart created successfully",
        cart: newCart,
      });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      status: "error",
      message: error.message || "An error occurred while updating the cart",
    });
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;

    // const cart = await Cart.findOne({ orderBy: id }).populate(
    //   "products.product",
    // ).populate('color');
    const cart = await Cart.findOne({ orderBy: id })
      .populate({
        path: 'products.product',
        populate: {
          path: 'color',
          model: 'Color'
        }
      });

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "No Any Items Available",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "User's cart",
      cart,
    });
  } catch (error) {
    throw new Error(error);
  }
});
//Empty Cart
const emptyCart = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;

    // Find the user by their ID
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Find and update the cart to clear it
    const cart = await Cart.findOneAndDelete(
      { orderBy: user._id },
      { products: [], cartTotal: 0 ,totalAfterDiscount:0,discountAmount:0},
      { new: true, runValidators: true } // Return the updated document
    );

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User's cart emptied successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "An error occurred while emptying the cart",
    });
  }
});

//Empty singlr product from user cart
const deleteSingleProFromCart= asyncHandler(async (req,res)=>{
  try {
    const { id } = req.user;
    const { productId } = req.params;

    let cart = await Cart.findOne({ orderBy: id });

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    cart.products = cart.products.filter(item => item.product.toString() !== productId);

    cart.cartTotal = cart.products.reduce((total, item) => total + (item.price * item.count), 0);

    cart.totalAfterDiscount = 0;
    cart.discountAmount = 0;

    await cart.save();

    return res.status(200).json({
      status: "success",
      message: "Product removed from cart successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "An error occurred while removing the product from the cart",
    });
  }
})

// Apply Coupon
const applyCoupon = asyncHandler(async (req, res) => {
  try {
    const { coupon } = req.body;
    const { _id } = req.user;

    // Validate coupon
    const validCoupon = await Coupon.findOne({ title: coupon });
    if (!validCoupon) {
      return res.status(400).json({
        status: "error",
        message: "Coupon not found",
      });
    }

    if (validCoupon.expiry < Date.now()) {
      return res.status(400).json({
        status: "error",
        message: "Coupon expired",
      });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ orderBy: _id });
    if (!cart || !cart.products.length) {
      return res.status(400).json({
        status: "error",
        message: "Cart is empty",
      });
    }

    // Calculate the discount amount
    const { cartTotal } = cart;
    const discountAmount = (cartTotal * validCoupon.discountPrice) / 100;
    const totalAfterDiscount = parseFloat((cartTotal - discountAmount).toFixed(2));

    // Update the cart with the new total after discount
    const updatedCart = await Cart.findOneAndUpdate(
      { orderBy: _id },
      { cartTotal: cartTotal,totalAfterDiscount:totalAfterDiscount,discountAmount: discountAmount.toFixed(2) },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      message: "Coupon applied successfully",
      totalAfterDiscount,
      discountAmount, // Return the discount amount
      cart: updatedCart, // Return the updated cart
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      status: "error",
      message: error.message || "An error occurred while applying the coupon",
    });
  }
});



//Create Order
const createOrder = asyncHandler(async (req, res) => {
  const { COD, totalAfterDiscount, discountAmount, shippingFee, cartTotalNotDiscount, totalPaymentPaidByUser, address, products, paymentIntent, orderBy } = req.body;

  try {
    const newOrder = new Order({
      products,
      paymentIntent,
      orderBy,
      address,
      totalAfterDiscount,
      discountAmount,
      shippingFee,
      cartTotalNotDiscount,
      totalPaymentPaidByUser,
      COD
    });

    const savedOrder = await newOrder.save();

    res.status(200).json({
      status: 'success',
      message: 'Order created successfully',
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'An error occurred while creating the order',
    });
  }
});

//Get Order

// const getOrder = asyncHandler(async (req, res) => {
//   try {
//     const { _id } = req.user;

//     // Fetch orders and populate product details
//     const userOrders = await Order.find({ orderBy: _id })
//       .populate("products.product")
//       .exec();

//     if (!userOrders || userOrders.length === 0) {
//       return res.status(404).json({
//         status: "error",
//         message: "User orders not found",
//       });
//     }

//     // Initialize a dictionary to hold total amounts by category
//     //new 
//     const categories = await Category.find({});

//     const categoryTotals = {};

//     // Process each order and each product within the orders
//     userOrders.forEach(order => {
//       order.products.forEach(productEntry => {
//         const product = productEntry.product;
//         const category = product.category; // Assuming product has a category field
//         const price = product.price; // Assuming product has a price field
//         const quantity = productEntry.count; // Assuming each product entry has a count field

//         // Calculate total price for this product entry
//         const totalPrice = price * quantity;

//         // Aggregate totals by category
//         if (!categoryTotals[category]) {
//           categoryTotals[category] = 0;
//         }
//         categoryTotals[category] += totalPrice;
//       });
//     });

//     // Respond with the aggregated data
//     return res.status(200).json({
//       status: "success",
//       message: "User's orders",
//       orders: userOrders,
//       categoryTotals: categoryTotals
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: "error",
//       message: error.message
//     });
//   }
// });

const getOrder = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;

    // Fetch orders and populate product details
    const userOrders = await Order.find({ orderBy: _id })
      .populate("products.product")
      .exec();

    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User orders not found",
      });
    }

    // Fetch all categories
    const categories = await Category.find({}); // Assuming Category is your model

    // Create a map of category ID to category name
    const categoryMap = categories.reduce((map, category) => {
      map[category._id.toString()] = category.title; // Use title instead of name
      return map;
    }, {});

    // Initialize a dictionary to hold total amounts by category
    const categoryTotals = {};

    // Process each order and each product within the orders
    userOrders.forEach(order => {
      order.products.forEach(productEntry => {
        const product = productEntry.product;
        const categoryId = product.category; // Assuming product has a category field
        const price = product.price; // Assuming product has a price field
        const quantity = productEntry.count; // Assuming each product entry has a count field

        // Calculate total price for this product entry
        const totalPrice = price * quantity;

        // Use category name from the map or default to 'Unknown Category'
        const categoryName = categoryMap[categoryId] || 'Unknown Category';

        // Aggregate totals by category
        if (!categoryTotals[categoryName]) {
          categoryTotals[categoryName] = 0;
        }
        categoryTotals[categoryName] += totalPrice;
      });
    });

    res.status(200).json({
      status: "success",
      message: "User's orders",
      orders: userOrders,
      categoryTotals,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
});





//Get All Order

const getAllOrders = asyncHandler(async (req, res) => {
  try {

    const {id} = req.user;
    const user = User.findById({_id:id});
    console.log('userid',id);
    if (!user) {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized to access this route",
      });
    }
    const userOrders = await Order.find()
     .populate("products.product")
     .populate("orderBy", "email")
     .exec();
    if (!userOrders) {
      return res.status(404).json({
        status: "error",
        message: "No orders found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "All orders",
      orders: userOrders,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Update Order Status
const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {orderStatus:status,paymentIntent:{
        status:status,
      }},
      {new:true},
    );
    return res.status(200).json({
      status: "success",
      message: "Order status updated successfully",
      order: updateOrderStatus,
    })
  } catch (error) {
    throw new Error(error);
  }
});

// const getOrderMetrics = async (req, res) => {
//   try {
//     const { id } = req.user;
//     const user = await User.findById({ _id: id });

//     if (!user) {
//       return res.status(403).json({
//         status: "error",
//         message: "Unauthorized to access this route",
//       });
//     }

//     const orders = await Order.find({}).populate('products.product');
//     console.log('orders', orders);

//     // Ensure paymentIntent.amount exists
//     const totalSales = orders.reduce((acc, order) => {
//       return acc + (order.paymentIntent.amount || 0);
//     }, 0);

//     const totalOrders = orders.length;
//     const averageOrderValue = totalOrders ? (totalSales / totalOrders) : 0;

//     res.status(200).json({
//       status: 'success',
//       data: {
//         orders,
//         totalSales,
//         averageOrderValue,
//         totalOrders
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 'error',
//       message: error.message,
//     });
//   }
// };
// const getOrderMetrics = async (req, res) => {
//   try {
//     const { id } = req.user;
//     const user = await User.findById({ _id: id });

//     if (!user) {
//       return res.status(403).json({
//         status: "error",
//         message: "Unauthorized to access this route",
//       });
//     }

//     const orders = await Order.find({}).populate('products.product').sort({ createdAt: -1 }).limit(10).populate('orderBy');
//     const monthlySales = {};
//     let totalSales = 0;

//     orders.forEach(order => {
//       const month = new Date(order.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
//       if (!monthlySales[month]) {
//         monthlySales[month] = 0;
//       }
//       const orderAmount = order.paymentIntent.amount || 0;
//       monthlySales[month] += orderAmount;
//       totalSales += orderAmount;
//     });

//     const data = Object.keys(monthlySales).map(month => ({
//       month,
//       sales: monthlySales[month]
//     }));

//     const totalOrders = orders.length;
//     const averageOrderValue = totalOrders ? (totalSales / totalOrders) : 0;

//     res.status(200).json({
//       status: 'success',
//       data: {
//         totalSales,
//         averageOrderValue,
//         totalOrders,
//         monthlySales: data,
//         orders,
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 'error',
//       message: error.message,
//     });
//   }
// };
const getOrderMetrics = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById({ _id: id });

    if (!user) {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized to access this route",
      });
    }

    const orders = await Order.find({}).populate('products.product').sort({ createdAt: -1 }).limit(20).populate('orderBy');
    
    const monthlySales = {};
    let totalSales = 0;
    let previousMonthSales = 0;
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const month = orderDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlySales[month]) {
        monthlySales[month] = 0;
      }
      const orderAmount = order.paymentIntent.amount || 0;
      monthlySales[month] += orderAmount;
      totalSales += orderAmount;

      if (orderDate.getMonth() === previousMonth.getMonth() && orderDate.getFullYear() === previousMonth.getFullYear()) {
        previousMonthSales += orderAmount;
      }
    });

    const data = Object.keys(monthlySales).map(month => ({
      month,
      sales: monthlySales[month]
    }));

    const totalOrders = orders.length;
    const averageOrderValue = totalOrders ? (totalSales / totalOrders) : 0;
    const previousMonthAverageOrderValue = previousMonthSales ? (previousMonthSales / totalOrders) : 0;

    res.status(200).json({
      status: 'success',
      data: {
        totalSales,
        averageOrderValue,
        totalOrders,
        previousMonthSales,
        previousMonthAverageOrderValue,
        previousMonthTotalOrders: totalOrders, // Adjust this if you have different total orders data
        monthlySales: data,
        orders,
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const loginWithCookie = asyncHandler( async (req,res)=>{
  try {
    const refreshToken = req.cookies.refreshToken;
    const tokenVersion = req.cookies.tokenVersion;

    if(refreshToken){
      const user = await User.findOne({ refreshToken });
      
      if(!user){
        return res.status(401).json({
          status: 'error',
          message: 'Invalid refresh token'
        });
      }
      
      if (user.tokenVersion !== tokenVersion) {
        return res.status(401).json({
          status: 'error',
          message: 'Token version mismatch',
        });
      }
      
      const accessToken = GenerateRefreshToken(user._id);
      
     return res.json({
        status:'success',
        message: 'Auto Logged in successfully',
        user: {
          name: user.firstName,
          email: user.email,
        },
        accessToken,
        refreshToken,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

const findMyDetails = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;

    // Fetch user details with specific fields
    const user = await User.findById(_id)
      .select('firstName lastName phoneNo email isBlocked images') // Select only the required fields
      .lean(); // Convert Mongoose document to plain JavaScript object

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Fetch related address details
    const address = await Address.findOne({ user: _id }).lean(); // Find the address associated with the user

    // Format response
    return res.json({
      status: 'success',
      user: {
        firstname: user.firstName,
        lastname: user.lastName,
        phoneNo: user.phoneNo,
        image:user.images,
        email: user.email,
        isBlocked: user.isBlocked,
        address: address || null, // Include address details if available
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});



export {
  findMyDetails,
  removeFromWishlist,
  deleteSingleProFromCart,
  loginWithCookie,
  getOrderMetrics,
  getAllOrders,
  saveUserAddress,
  updateOrderStatus,
  getOrder,
  createOrder,
  applyCoupon,
  emptyCart,
  getUserCart,
  userCart,
  getWishlist,
  resetPassword,
  forgotPasswordToken,
  updatePassword,
  registerUser,
  loginUser,
  getUser,
  getAllUsers,
  getAUser,
  deleteAUser,
  updateUser,
  isAdmin,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logoutUser,
  loginAdmin,
};
