const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching products',
            error: error.message
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        // Log received data for debugging
        console.log('=== Product Creation Request ===');
        console.log('Body:', req.body);
        console.log('File:', req.file);

        // Validation
        if (!name || !description || !price || !category) {
            return res.status(400).json({
                message: 'Missing required fields',
                error: 'Name, description, price, and category are required'
            });
        }

        // Handle image upload - either from file upload or use placeholder
        let image;
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
            console.log('Image uploaded:', image);
        } else if (req.body.image) {
            image = req.body.image;
            console.log('Image URL provided:', image);
        } else {
            image = 'https://via.placeholder.com/400x400?text=No+Image';
            console.log('Using placeholder image');
        }

        // Create product
        const product = new Product({
            name,
            description,
            price: parseFloat(price),
            image,
            category
        });

        const savedProduct = await product.save();
        const totalProducts = await Product.countDocuments();
        console.log(`✅ Product saved! ID: ${savedProduct._id}. Total in DB: ${totalProducts}`);

        res.status(201).json({
            message: 'Product created successfully',
            product: savedProduct,
            totalCount: totalProducts
        });
    } catch (error) {
        console.error('=== Product Creation Error ===');
        console.error('Error:', error);
        console.error('Stack:', error.stack);

        res.status(400).json({
            message: 'Error creating product',
            error: error.message,
            details: error.errors ? Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            })) : null
        });
    }
};


const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching product',
            error: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error updating product',
            error: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting product',
            error: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
};
