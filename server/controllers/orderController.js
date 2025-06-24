const Order = require('../models/Order');

const placeOrder = async (req, res) => {
    try {
        const { items, shippingAddress, totalPrice } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No order items' });
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            totalPrice
        });

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order
        });
    } catch (error) {
        console.error('Place Order Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to place order',
            error: error.message
        });
    }
};


const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('items.product');

        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Fetch User Orders Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch user orders',
            error: error.message
        });
    }
};


const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').populate('items.product');

        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Fetch All Orders Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
};


const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            success: true,
            message: 'Order status updated',
            order
        });
    } catch (error) {
        console.error('Update Order Status Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to update status',
            error: error.message
        });
    }
};

module.exports = {
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus
};
