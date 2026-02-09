const Cart = require('../models/Cart');
const Product = require('../models/Product');

const addToCart = async (req, res) => {
    const { productId, quantity, cartId } = req.body;

    try {
        let cart;

        // Find existing cart or create new one
        if (cartId) {
            cart = await Cart.findById(cartId);
        }

        if (!cart) {
            cart = new Cart({ items: [] });
        }

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        // Check if item already exists in cart
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            // Update quantity if item exists
            cart.items[itemIndex].quantity += parseInt(quantity);
        } else {
            // Add new item to cart
            cart.items.push({
                product: productId,
                quantity: parseInt(quantity)
            });
        }

        await cart.save();

        // Populate product details before sending response
        await cart.populate('items.product');

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({
            message: 'Error adding to cart',
            error: error.message
        });
    }
};

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cartId)
            .populate('items.product');

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found'
            });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching cart',
            error: error.message
        });
    }
};

const updateCartItem = async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: 'Item not found in cart'
            });
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            cart.items.splice(itemIndex, 1);
        } else {
            // Update quantity
            cart.items[itemIndex].quantity = parseInt(quantity);
        }

        await cart.save();
        await cart.populate('items.product');

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({
            message: 'Error updating cart',
            error: error.message
        });
    }
};

const removeFromCart = async (req, res) => {
    const { cartId, productId } = req.params;

    try {
        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found'
            });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();
        await cart.populate('items.product');

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({
            message: 'Error removing item from cart',
            error: error.message
        });
    }
};

const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cartId);

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found'
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            message: 'Cart cleared successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error clearing cart',
            error: error.message
        });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
