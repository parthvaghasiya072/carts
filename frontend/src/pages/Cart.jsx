import React, { useEffect, useState } from 'react';
import { getCart, createOrder, getImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const { clearCart } = useCart();

    useEffect(() => {
        const cartId = localStorage.getItem('cartId');
        if (cartId) {
            fetchCart(cartId);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchCart = async (cartId) => {
        try {
            const res = await getCart(cartId);
            setCart(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const checkout = async () => {
        try {
            const cartId = localStorage.getItem('cartId');
            if (!cartId) return;
            const res = await createOrder(cartId);
            toast.success(`Order placed successfully! Order ID: ${res.data._id}`);
            setCart(null);
            clearCart();
        } catch (err) {
            console.error(err);
            toast.error('Failed to place order');
        }
    };

    if (loading) return <div className="loading">Loading cart...</div>;
    if (!cart || !cart.items.length) return <div className="empty-cart">Your cart is empty. <a href="/">Go Shopping</a></div>;

    const total = cart.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

    return (
        <div className="page-container">
            <h1 className="page-title">Your Cart</h1>
            <div className="cart-container">
                <div className="cart-items">
                    {cart.items.map((item, index) => (
                        <div key={index} className="cart-item">
                            <img src={getImageUrl(item.product?.image)} alt={item.product?.name} className="cart-item-image" onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }} />
                            <div className="cart-item-details">
                                <h3>{item.product?.name || 'Unavailable Product'}</h3>
                                <p>Qty: {item.quantity}</p>
                            </div>
                            <div className="cart-item-price">
                                ${(item.product?.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <div className="cart-total">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn" onClick={checkout}>Proceed to Checkout</button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
