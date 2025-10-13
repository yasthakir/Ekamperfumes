// models/Offer.js

const mongoose = require('mongoose');

// Define the schema (the structure) for an offer
const offerSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true, // Each offer code must be unique
    },
    image: {
        type: String,
        required: true, // The path to the image
    },
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

// Create and export the model
module.exports = mongoose.model('Offer', offerSchema);