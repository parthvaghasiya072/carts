import React, { useState, useEffect } from 'react';
import { getProducts, getImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const Home = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getProducts();
                setProducts(res.data);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load products');
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="page-container">
            <h1 className="page-title">Featured Products</h1>
            <div className="product-grid">
                {products.length === 0 ? <p>No products found. Add some from Admin panel!</p> : products.map(product => (
                    <div key={product._id} className="product-card">
                        <div className="image-container">
                            <img src={getImageUrl(product.image)} alt={product.name} className="product-image" onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} />
                        </div>
                        <div className="product-info">
                            <h2 className="product-name">{product.name}</h2>
                            <p className="product-desc">{product.description}</p>
                            <div className="product-footer">
                                <span className="product-price">${product.price}</span>
                                <button
                                    onClick={() => addToCart(product._id)}
                                    className="add-btn"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
