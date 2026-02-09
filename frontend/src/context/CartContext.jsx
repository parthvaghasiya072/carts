import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCart, addToCart as apiAddToCart } from '../services/api';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [cartId, setCartId] = useState(localStorage.getItem('cartId'));

    useEffect(() => {
        if (cartId) {
            fetchCartCount(cartId);
        }
    }, [cartId]);

    const fetchCartCount = async (id) => {
        try {
            const res = await getCart(id);
            const count = res.data.items.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(count);
        } catch (err) {
            console.error('Failed to fetch cart count', err);
            // If cart not found (e.g. server restart/db clear), clear local storage
            if (err.response && err.response.status === 404) {
                localStorage.removeItem('cartId');
                setCartId(null);
                setCartCount(0);
            }
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            const currentCartId = cartId || localStorage.getItem('cartId');
            const res = await apiAddToCart(productId, quantity, currentCartId);

            if (!cartId && res.data._id) {
                setCartId(res.data._id);
                localStorage.setItem('cartId', res.data._id);
            }

            // Calculate new count from response
            const newCount = res.data.items.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(newCount);
            toast.success('Added to cart!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to add to cart: ' + (err.response?.data?.message || err.message));
        }
    };

    const clearCart = () => {
        setCartCount(0);
        setCartId(null);
        localStorage.removeItem('cartId');
    };

    return (
        <CartContext.Provider value={{ cartCount, addToCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
