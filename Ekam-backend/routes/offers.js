// routes/offers.js

const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const { uploadOffer } = require('../config/cloudinary'); // ++ புதிய import ++

// --- MULTER CONFIGURATION NEEKKAPATTATHU ---

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
// upload.single('image') என்பதற்குப் பதிலாக uploadOffer.single('image') என மாற்றவும்
router.post('/', uploadOffer.single('image'), async (req, res) => {
    try {
        const { code } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Offer image is required.' });
        }
        const newOffer = new Offer({
            code,
            // ++ MUKIYAMANA MAATRAM: Cloudinary URL-ஐப் பெறுதல் ++
            image: req.file.path,
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