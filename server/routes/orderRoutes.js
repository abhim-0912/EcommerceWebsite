const express = require('express');
const router = express.Router();
const {
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');

const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

router.post('/', protect, placeOrder);

router.get('/my', protect, getUserOrders);

router.get('/', protect, adminOnly, getAllOrders);

router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
