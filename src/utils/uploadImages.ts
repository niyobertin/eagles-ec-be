import multer from "multer";
import {v2 as cloudinary} from 'cloudinary';
import cloudinaryConfig from "../config/claudinary";
export const upload = multer({ dest: 'uploads/' });
export const uploadMultipleImages = async(files:any) =>{
    try {
      const uploadedImages = [];
  
      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'uploads',
          use_filename: true 
        });
  
        uploadedImages.push(result.secure_url);
      }
      return uploadedImages;
    } catch (error:any) {
      throw new Error('Failed to upload images to Cloudinary: ' + error.message);
    }
  }

export const uploadImage = async(file:any) => {
  try {
  const result = await cloudinary.uploader.upload(file.path,{
    folder: 'uploads',
    use_filename: true
  })
  return result.secure_url;
  } catch (error:any) {
    throw new Error('Failed to upload images to Cloudinary: ' + error.message);
  }
}  