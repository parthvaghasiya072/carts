import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { cartCount } = useCart();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">ShopStream</Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Shop</Link>
                    <Link to="/cart" className="nav-link">
                        Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>
                    <Link to="/admin" className="nav-link admin-link">Admin Panel</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
