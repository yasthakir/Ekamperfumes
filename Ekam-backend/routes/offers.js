const express = require('express');
const multer = require('multer');
const path = require('path');
const Offer = require('../models/Offer');

const router = express.Router();

// Multer configuration for offer image uploads
const storage = multer.diskStorage({
    destination: './uploads/offers/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage: storage });

// GET /api/offers - Fetch all offers
router.get('/', async (req, res) => {
    try {
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.status(200).json(offers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching offers', error });
    }
});

// POST /api/offers - Add a new offer
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { code } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Offer image is required.' });
        }
        const newOffer = new Offer({
            code,
            image: `/uploads/offers/${req.file.filename}`,
        });
        const savedOffer = await newOffer.save();
        res.status(201).json(savedOffer);
    } catch (error) {
        console.error("--- OFFER CREATE ERROR ---", error);
        res.status(500).json({ message: 'Error creating offer', error });
    }
});

// DELETE /api/offers/:id - Delete an offer
router.delete('/:id', async (req, res) => {
    try {
        const deletedOffer = await Offer.findByIdAndDelete(req.params.id);
        if (!deletedOffer) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting offer', error });
    }
});

module.exports = router;