const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/product');

const router = express.Router();

// Multer configuration for product image uploads
const storage = multer.diskStorage({
    destination: './uploads/products/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage: storage });

// POST /api/products - Add a new product
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, gender, category, isInStock, deliveryTime } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'Product image is required.' });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            gender,
            category,
            isInStock: isInStock === 'true',
            deliveryTime,
            image: `/uploads/products/${req.file.filename}`,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("--- PRODUCT CREATE ERROR ---", error);
        res.status(500).json({ message: 'Error creating product', error });
    }
});

// GET /api/products - Fetch all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});
// ... existing routes ...

// GET /api/products - Fetch all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

// New Route: GET /api/products/category/:categoryName - Fetch products by category
router.get('/category/:categoryName', async (req, res) => {
    try {
        const categoryName = req.params.categoryName;
        
        // This finds products where the 'category' field exactly matches the name from the URL (e.g., "For Him")
        const products = await Product.find({ category: categoryName }).sort({ createdAt: -1 });
        
        if (products.length === 0) {
            // Check if products were tagged with 'Men' in the gender field instead of 'For Him' in category field
            // The admin form might be setting the 'gender' field to 'Men' for the 'For Him' selection.
            const genderFilter = (categoryName === 'For Him' || categoryName === 'For Her') ? 
                                 (categoryName === 'For Him' ? 'Men' : 'Women') : null;
            
            if (genderFilter) {
                const genderProducts = await Product.find({ gender: genderFilter }).sort({ createdAt: -1 });
                return res.status(200).json(genderProducts);
            }
        }

        res.status(200).json(products);
    } catch (error) {
        console.error("--- FETCH PRODUCTS BY CATEGORY ERROR ---", error);
        res.status(500).json({ message: 'Error fetching products by category', error });
    }
});


// --- THIS IS THE NEW ROUTE YOU ARE ADDING ---
// GET /api/products/:id - Fetch a single product by its ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("--- FETCH SINGLE PRODUCT ERROR ---", error);
        res.status(500).json({ message: 'Error fetching product details', error });
    }
});
// --- END OF NEW ROUTE ---

// DELETE /api/products/:id - Delete a product
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
});

module.exports = router;