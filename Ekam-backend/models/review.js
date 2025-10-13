const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    // To link this review to a specific product
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Links to the 'Product' model
        required: true,
    },
    // To link this review to the user who wrote it
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links to the 'User' model
        required: true,
    },
    // To display the user's name easily
    username: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
    // To store the path of an optional uploaded image
    image: {
        type: String,
        required: false, // This is optional
    },
}, { 
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('Review', reviewSchema);