import cloudinaryModule from 'cloudinary'; // 1. Import the entire module, not just v2
import pkg from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

const CloudinaryStorage = pkg.CloudinaryStorage || pkg;

dotenv.config();
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "It loaded!" : "MISSING/UNDEFINED");
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "It loaded!" : "MISSING/UNDEFINED");

// 2. Authenticate by targeting .v2 on the module explicitly
cloudinaryModule.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 3. Configure the Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryModule, // 4. Pass the whole module so the package can find .v2 internally
//   params: {
//     folder: 'mern_avatars',
//     allowed_formats: ['jpg', 'png', 'jpeg'], 
//   },
});

// Initialize Multer with Storage and Size Limits (5MB)
export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});