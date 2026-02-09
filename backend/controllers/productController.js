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
    const { name, description, price, category } = req.body;

    // Handle image upload - either from file upload or URL
    const image = req.file
        ? `http://localhost:5000/uploads/${req.file.filename}`
        : req.body.image;

    try {
        const product = new Product({
            name,
            description,
            price,
            image,
            category
        });

        const savedProduct = await product.save();

        res.status(201).json({
            message: 'Product created successfully',
            product: savedProduct
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error creating product',
            error: error.message
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
