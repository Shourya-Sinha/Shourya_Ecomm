import multer from "multer";
import sharp from "sharp";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb({ message: 'Unsupported File Format' }, false);
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5000000 }, // Increase to 5 MB
});

const handleFileSizeError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File too large. The maximum file size allowed is 5 MB.',
      });
    }
  }
  next(err); // Pass other errors to the next error handler
};

const processImages = async (req, res, next) => {
  try {
    if (!req.files || !Array.isArray(req.files.images)) {
      return next(); // No files to process
    }

    console.log('Processing files:', req.files.images);

    const resizedImages = await Promise.all(
      req.files.images.map(async (file) => {
        const maxSize = 1000000; // 1 MB
        let buffer = file.buffer;

        if (buffer.length > maxSize) {
          console.log(`Resizing image of size ${buffer.length}`);
          buffer = await sharp(file.buffer)
            .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toBuffer();
        }

        return {
          ...file,
          buffer, // Updated buffer after resizing
        };
      })
    );

    req.files.images = resizedImages;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};

const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
    req.body.images = [];
    await Promise.all(
      req.files.map(async (file) => {
        const filename = `${Date.now()}_${Math.round(Math.random() * 1e9)}.jpg`;
        const buffer = await sharp(file.buffer)
          .resize(300, 300)
          .toFormat('jpg')
          .jpeg({ quality: 90 })
          .toBuffer();

        const uploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: "MyEcomm/products", public_id: filename, format: "jpg" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          ).end(buffer);
        });
  
        req.body.images.push(uploadResponse.secure_url);
      })
    );
    next();
  };
  
  const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();
    req.body.images = [];
    await Promise.all(
      req.files.map(async (file) => {
        const filename = `${Date.now()}_${Math.round(Math.random() * 1e9)}.jpg`;
        const buffer = await sharp(file.buffer)
          .resize(300, 300)
          .toFormat('jpg')
          .jpeg({ quality: 90 })
          .toBuffer();
        const uploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: "MyEcomm/products", public_id: filename, format: "jpg" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          ).end(buffer);
        });
  
        req.body.images.push(uploadResponse.secure_url);
      })
    );
    next();
  };

export {uploadPhoto,productImgResize,blogImgResize,processImages,handleFileSizeError};
