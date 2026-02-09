import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getImageUrl } from '../services/api';
import { createOrder } from '../redux/slices/orderSlice';
import { toast } from 'react-toastify';

const Cart = () => {
    const dispatch = useDispatch();
    const { items, total, cartId, loading } = useSelector((state) => state.cart);
    const { loading: orderLoading } = useSelector((state) => state.orders);

    const checkout = async () => {
        if (!cartId) return;
        const resultAction = await dispatch(createOrder(cartId));
        if (createOrder.fulfilled.match(resultAction)) {
            toast.success(`Order placed successfully! Order ID: ${resultAction.payload._id}`);
        } else {
            toast.error('Failed to place order: ' + (resultAction.payload || 'Unknown error'));
        }
    };

    if (loading) return <div className="loading">Loading cart...</div>;
    if (!items || items.length === 0) return <div className="empty-cart">Your cart is empty. <a href="/">Go Shopping</a></div>;

    return (
        <div className="page-container">
            <h1 className="page-title">Your Cart</h1>
            <div className="cart-container">
                <div className="cart-items">
                    {items.map((item, index) => (
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
                    <button
                        className="checkout-btn"
                        onClick={checkout}
                        disabled={orderLoading}
                    >
                        {orderLoading ? 'Processing...' : 'Proceed to Checkout'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
