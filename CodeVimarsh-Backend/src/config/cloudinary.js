import { v2 as cloudinary } from "cloudinary";

/**
 * Configure the Cloudinary SDK using environment variables.
 * All credentials are read from .env — never hardcoded.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Always use HTTPS URLs
});

export default cloudinary;
