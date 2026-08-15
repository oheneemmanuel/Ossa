import { v2 as cloudinary } from "cloudinary";

console.log("Cloudinary config check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret_length: process.env.CLOUDINARY_API_SECRET?.length,
  api_secret_first3: process.env.CLOUDINARY_API_SECRET?.slice(0, 3),
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;