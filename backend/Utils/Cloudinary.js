import cloudinary from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadImg = async (fileToUploads)=>{
    return new Promise((resolve) =>{
        cloudinary.uploader.upload(fileToUploads,(result)=>{
            resolve(
                {url:result.secure_url},
                {resource_type:"auto"},
            );
        });
    });
}
export default {cloudinaryUploadImg};