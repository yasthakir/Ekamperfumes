const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User'); // Import the User model to find users by mobile

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
    try {
        const { user, products, totalAmount, shippingAddress, paymentMethod, paymentId } = req.body;

        const newOrder = new Order({
            user,
            products,
            totalAmount,
            shippingAddress,
            paymentMethod,
            paymentId
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ success: true, message: "Order created successfully!", order: savedOrder });
    } catch (error) {
        console.error("--- CREATE ORDER ERROR ---", error);
        res.status(500).json({ success: false, message: "Failed to create order.", error });
    }
});

// GET /api/orders - Fetch all orders for the admin panel
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email mobile') // Get user details
            .populate('products.product', 'name price') // Get product details
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all orders', error });
    }
});

// GET /api/orders/user/:mobile - Get all orders for a specific user
router.get('/user/:mobile', async (req, res) => {
    try {
        // Find the user by their mobile number first to get their ID
        const user = await User.findOne({ mobile: req.params.mobile });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Find all orders that belong to this user's ID
        const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
        res.status(200).json(orders);

    } catch (error) {
        console.error("--- FETCH USER ORDERS ERROR ---", error);
        res.status(500).json({ message: 'Error fetching user orders', error });
    }
});

// GET /api/orders/:id - Fetch a single order by its ID (for tracking)
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name mobile')
            .populate('products.product', 'name image');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order details', error });
    }
});


// PUT /api/orders/:id/status - Update the status of an order
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
});

module.exports = router;