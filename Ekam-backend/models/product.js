const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Men', 'Women', 'Unisex'],
    },
    category: {
        type: String,
        required: true,
    },
    isInStock: {
        type: Boolean,
        default: true, // New products are in stock by default
    },
    deliveryTime: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);