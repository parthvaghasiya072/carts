const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// POST add to cart
router.post('/', async (req, res) => {
    const { productId, quantity, cartId } = req.body;

    try {
        let cart;
        if (cartId) {
            cart = await Cart.findById(cartId);
        }

        if (!cart) {
            cart = new Cart({ items: [] });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += parseInt(quantity);
        } else {
            cart.items.push({ product: productId, quantity: parseInt(quantity) });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET cart
router.get('/:cartId', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cartId).populate('items.product');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
