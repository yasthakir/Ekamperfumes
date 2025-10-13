const Order = require('../models/Order');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { userMobile, products, totalAmount, shippingAddress, paymentId } = req.body;
        
        const orderId = `AURORA-${Date.now()}`;

        const newOrder = new Order({
            orderId,
            userMobile,
            products,
            totalAmount,
            shippingAddress,
            paymentId
        });
        const savedOrder = await newOrder.save();
        res.status(201).json({ success: true, message: "Order created successfully!", order: savedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create order.", error });
    }
};

// Get all orders for a specific user
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userMobile: req.params.mobile }).sort({ orderDate: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders.", error });
    }
};

