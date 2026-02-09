const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// POST create order from cart
router.post('/', async (req, res) => {
    const { cartId } = req.body;
    try {
        const cart = await Cart.findById(cartId).populate('items.product');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        if (cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

        let totalAmount = 0;
        const orderItems = cart.items.map(item => {
            const price = item.product.price * item.quantity;
            totalAmount += price;
            return {
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            };
        });

        const order = new Order({
            items: orderItems,
            totalAmount
        });

        await order.save();

        // Clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET all orders (Admin)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('items.product').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
