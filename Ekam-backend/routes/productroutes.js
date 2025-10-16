// routes/productroutes.js

const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { uploadProduct } = require('../config/cloudinary'); // ++ புதிய import ++

// --- MULTER CONFIGURATION NEEKKAPATTATHU ---
// பழைய multer diskStorage code-ஐ এখান থেকে നീക്കം ചെയ്യുക

// POST /api/products - Add a new product
// upload.single('image') என்பதற்குப் பதிலாக uploadProduct.single('image') என மாற்றவும்
router.post('/', uploadProduct.single('image'), async (req, res) => {
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
            // ++ MUKIYAMANA MAATRAM: Cloudinary URL-ஐப் பெறுதல் ++
            image: req.file.path, 
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("--- PRODUCT CREATE ERROR ---", error);
        res.status(500).json({ message: 'Error creating product', error });
    }
});

// மற்ற routes (GET, DELETE etc.) அப்படியே இருக்கும்...
// GET /api/products - Fetch all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

// GET /api/products/category/:categoryName - Fetch products by category
router.get('/category/:categoryName', async (req, res) => {
    try {
        const categoryName = req.params.categoryName;
        const products = await Product.find({ category: categoryName }).sort({ createdAt: -1 });
        
        if (products.length === 0) {
            const genderFilter = (categoryName === 'For Him' || categoryName === 'For Her') ? 
                                 (categoryName === 'For Him' ? 'Men' : 'Women') : null;
            if (genderFilter) {
                const genderProducts = await Product.find({ gender: genderFilter }).sort({ createdAt: -1 });
                return res.status(200).json(genderProducts);
            }
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products by category', error });
    }
});

// GET /api/products/:id - Fetch a single product by its ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product details', error });
    }
});

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