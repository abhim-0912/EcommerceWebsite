const express = require('express');
const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addProductReview,
    getProductReviews
} = require('../controllers/productController');

const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post('/', protect, adminOnly,upload.single('image'), createProduct);
router.put('/:id', protect, adminOnly,upload.single('image'), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/:id/reviews', protect, addProductReview);
router.get('/:id/reviews',protect,getProductReviews);

module.exports = router;
