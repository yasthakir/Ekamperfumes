const express = require('express');
const multer = require('multer');
const path = require('path');
const Review = require('../models/review'); // Import the Review model

const router = express.Router();

// --- Multer Configuration for Image Uploads ---
const storage = multer.diskStorage({
    // Define where to save the uploaded files
    destination: './uploads/reviews/',
    // Define how to name the files to avoid conflicts
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage: storage });


// --- API Endpoints ---

/**
 * @route   GET /api/reviews/:productId
 * @desc    Get all reviews for a specific product
 * @access  Public
 */
router.get('/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        console.error("--- FETCH REVIEWS ERROR ---", error);
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
});

/**
 * @route   POST /api/reviews
 * @desc    Create a new review for a product
 * @access  Private (should be protected by auth middleware in a real app)
 */
router.post('/', upload.single('image'), async (req, res) => {
    // The 'upload.single('image')' middleware handles the file upload
    const { product, user, username, rating, comment } = req.body;

    if (!product || !user || !username || !rating || !comment) {
        return res.status(400).json({ message: 'All required fields are not provided.' });
    }

    try {
        const newReview = new Review({
            product,
            user,
            username,
            rating,
            comment,
            // If a file was uploaded, save its path
            image: req.file ? `/uploads/reviews/${req.file.filename}` : undefined,
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        console.error("--- CREATE REVIEW ERROR ---", error);
        res.status(500).json({ message: 'Error creating review', error });
    }
});


module.exports = router;