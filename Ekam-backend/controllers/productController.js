const Product = require('../models/product'); // NOTE: Make sure your model file is named 'Product.js' (capital P)

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
};

// Add a new product
exports.addProduct = async (req, res) => {
    try {
        const { name, price, gender, category } = req.body;
        const image = `/uploads/${req.file.filename}`; 

        const newProduct = new Product({ name, price, gender, category, image });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error });
    }
};

// Get Top 5 Collection Products
exports.getTopProducts = async (req, res) => {
    try {
        const topProducts = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        res.status(200).json(topProducts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching top products", error });
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const products = await Product.find({ 
            $or: [{ gender: category }, { category: category }]
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products by category", error });
    }
};

// **ITHU THAAN MUKKIYAMANA PUTHU/SARI SEYTHA FUNCTION**
// Get a single product by its ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};

