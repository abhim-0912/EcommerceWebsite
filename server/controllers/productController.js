const Product = require('../models/Product');

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ success: false, message: "Product already exists" });
        }

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

        const newProduct = await Product.create({
            name,
            description,
            price,
            category,
            images: imageUrl ? [imageUrl] : []
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: newProduct
        });

    } catch (error) {
        console.error("Create Product Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error creating product",
            error: error.message
        });
    }
};



const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, products });
    } catch (error) {
        console.error("Get All Products Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error.message
        });
    }
};


const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({ success: true, product });
    } catch (error) {
        console.error("Get Product By ID Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error fetching product",
            error: error.message
        });
    }
};


const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedFields = { ...req.body };
        if (req.file) {
            updatedFields.images = [`/uploads/${req.file.filename}`];
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, {
            new: true,
            runValidators: true
        });

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        console.error("Update Product Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error updating product",
            error: error.message
        });
    }
};



const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error("Delete Product Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error deleting product",
            error: error.message
        });
    }
};

const addProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const alreadyReviewed = product.reviews.find(
            (rev) => rev.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ success: false, message: "Product already reviewed" });
        }

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.averageRating =
            product.reviews.reduce((acc, item) => acc + item.rating, 0) / product.reviews.length;

        await product.save();

        return res.status(201).json({ success: true, message: "Review added" });

    } catch (error) {
        console.error("Add Review Error:", error.message);
        return res.status(500).json({ success: false, message: "Error adding review", error: error.message });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).select('reviews');

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.status(200).json({ success: true, reviews: product.reviews });

    } catch (error) {
        console.error("Get Reviews Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error fetching reviews",
            error: error.message
        });
    }
};



module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addProductReview,
    getProductReviews
};
