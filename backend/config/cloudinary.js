const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Create a storage object with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      // The resource type based on the file's MIME type
      resource_type: file.mimetype.startsWith("video") ? "video" : "image",
      // Optional: Define public ID, folder, etc.
      public_id: `uploads/${Date.now()}_${file.originalname}`, // You can customize this as needed
    };
  },
});

// Middleware for handling file uploads
const multerMiddleware = multer({ storage: storage });

// Function to upload files to Cloudinary
const uploadFileToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    // Cloudinary already handles the upload
    cloudinary.uploader.upload(
      file.path,
      { resource_type: file.mimetype.startsWith("video") ? "video" : "image" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

module.exports = { uploadFileToCloudinary, multerMiddleware };
