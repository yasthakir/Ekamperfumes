// routes/reviews.js

const express = require('express');
const router = express.Router();
const Review = require('../models/review');
// ++ UPDATED: Import the Cloudinary uploader for reviews ++
const { uploadReview } = require('../config/cloudinary'); 

// --- Local Multer Configuration has been REMOVED ---

// GET /api/reviews/:productId
router.get('/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
});

// POST /api/reviews
// ++ UPDATED: Use the Cloudinary middleware 'uploadReview' ++
router.post('/', uploadReview.single('image'), async (req, res) => {
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
            // ++ UPDATED: Get the image URL from Cloudinary via req.file.path ++
            image: req.file ? req.file.path : undefined,
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        console.error("--- CREATE REVIEW ERROR ---", error);
        res.status(500).json({ message: 'Error creating review', error });
    }
});

module.exports = router;