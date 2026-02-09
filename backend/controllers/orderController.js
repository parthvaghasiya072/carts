const Order = require('../models/Order');
const Cart = require('../models/Cart');

const createOrder = async (req, res) => {
    const { cartId } = req.body;

    try {
        // Find and populate cart
        const cart = await Cart.findById(cartId).populate('items.product');

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found'
            });
        }

        if (cart.items.length === 0) {
            return res.status(400).json({
                message: 'Cart is empty'
            });
        }

        // Calculate total and prepare order items
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

        // Create new order
        const order = new Order({
            items: orderItems,
            totalAmount
        });

        await order.save();

        // Clear cart after successful order
        cart.items = [];
        await cart.save();

        // Populate product details for response
        await order.populate('items.product');

        res.status(201).json({
            message: 'Order placed successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating order',
            error: error.message
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('items.product')
            .sort({ createdAt: -1 }); // Most recent first

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product');

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching order',
            error: error.message
        });
    }
};

const updateOrderStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating order',
            error: error.message
        });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        res.status(200).json({
            message: 'Order deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting order',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
};
