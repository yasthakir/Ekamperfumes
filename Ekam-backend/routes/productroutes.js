const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product'); // Ensure this path is correct

// --- Configure Cloudinary ---
// Itha unga .env file-la vechurukurathu nallathu
cloudinary.config({ 
  cloud_name: 'demc3euq6', 
  api_key: '119291618846383', 
  api_secret: '6D0x-2JvTmNtgxZO35M0OtGnG6k' 
});

// --- Configure Multer to use Cloudinary Storage ---
// Intha code thaan varra file-a neraya Cloudinary-kku anuppidum
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ekam-perfumes-products', // Cloudinary-la intha per-la oru folder create aagum
    format: async (req, file) => 'jpg', // JPG, PNG, etc. format-a save pannum
    public_id: (req, file) => Date.now() + '-' + file.originalname, // Unique name for each file
  },
});

const upload = multer({ storage: storage });

// --- API Routes ---

// GET: Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Create a new product
// Inga `upload.single('image')` middleware ippo Cloudinary-kku upload pannum
router.post('/', upload.single('image'), async (req, res) => {
  // Cloudinary-la upload aanathukku apram, req.file.path la permanent URL irukkum
  if (!req.file) {
    return res.status(400).send('Image upload failed.');
  }

  const newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    isInStock: req.body.isInStock,
    deliveryTime: req.body.deliveryTime,
    gender: req.body.gender,
    category: req.body.category,
    // MODIFIED: Ippo neraya Cloudinary URL-a save panrom
    image: req.file.path 
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).send('Product not found.');
    // Note: You might also want to delete the image from Cloudinary here to save space
    res.status(200).send('Product successfully deleted.');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;