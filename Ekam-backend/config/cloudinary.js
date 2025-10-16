// config/cloudinary.js

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// உங்கள் Cloudinary credentials-ஐ உள்ளமைத்தல்
// (இவற்றை .env கோப்பிலிருந்து பெறுவது சிறந்த பழக்கம்)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// தயாரிப்புகளுக்கான (Products) சேமிப்பகத்தை உள்ளமைத்தல்
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ekam-products', // Cloudinary-ல் கோப்புகளைச் சேமிக்க ஒரு கோப்புறை
    allowed_formats: ['jpeg', 'png', 'jpg'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // கோப்பின் பெயர்
  },
});

// ஆஃபர்களுக்கான (Offers) சேமிப்பகத்தை உள்ளமைத்தல்
const offerStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'ekam-offers', // ஆஃபர் படங்களுக்கான தனி கோப்புறை
      allowed_formats: ['jpeg', 'png', 'jpg'],
      public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
  });

const uploadProduct = multer({ storage: productStorage });
const uploadOffer = multer({ storage: offerStorage });

module.exports = {
  uploadProduct,
  uploadOffer
};