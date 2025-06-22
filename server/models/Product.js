    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    const productSchema = new Schema({
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        countInStock: {
            type: Number,
            required: true,
            min: 0,
        },
        images: [
            {
                type: String,
            }
        ],
        rating: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                name: { type: String, required: true },
                rating: { type: Number, required: true },
                comment: { type: String, required: true },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        averageRating: { 
            type: Number, 
            default: 0 
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    });

    module.exports = mongoose.model('Product', productSchema);
