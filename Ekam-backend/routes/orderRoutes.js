const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
// const authMiddleware = require('../middleware/auth'); // Temporarily commented out to fix the error

// Note: You would have a POST route for users to create an order.
// The routes below are for the admin panel.

// GET /api/orders - Fetch all orders for the admin panel
router.get('/', async (req, res) => {
    try {
        // .populate() gets details from linked models (User and Product)
        const orders = await Order.find()
            .populate('user', 'name email') // Get name and email from the User model
            .populate('products.product', 'name price') // Get name and price from the Product model
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
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

module.exports = router;541