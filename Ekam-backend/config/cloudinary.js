// config/cloudinary.js

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// For Products
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ekam-products',
    allowed_formats: ['jpeg', 'png', 'jpg'],
  },
});

// For Offers
const offerStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'ekam-offers',
      allowed_formats: ['jpeg', 'png', 'jpg'],
    },
});

// ++ NEW: Add this new storage configuration for Reviews ++
const reviewStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'ekam-reviews', // A separate folder for review images
      allowed_formats: ['jpeg', 'png', 'jpg'],
    },
});


const uploadProduct = multer({ storage: productStorage });
const uploadOffer = multer({ storage: offerStorage });
// ++ NEW: Create a multer instance for reviews ++
const uploadReview = multer({ storage: reviewStorage });

module.exports = {
  uploadProduct,
  uploadOffer,
  uploadReview // ++ NEW: Export the review uploader ++
};