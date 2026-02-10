const mongoose = require('mongoose');

/**
 * Product Schema
 * Defines the structure for product documents in the database
 */
const productSchema = new mongoose.Schema(
    {
        // Product basic information
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [100, 'Product name cannot exceed 100 characters']
        },

        description: {
            type: String,
            required: [true, 'Product description is required'],
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },

        // Pricing information
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative']
        },

        // Product media
        image: {
            type: String,
            default: 'https://via.placeholder.com/400x400?text=No+Image'
        },

        // Product categorization
        category: {
            type: String,
            required: [true, 'Product category is required'],
            trim: true
        }
    },
    {
        // Automatically add createdAt and updatedAt fields
        timestamps: true
    }
);

// Export the Product model
module.exports = mongoose.model('Product', productSchema);
