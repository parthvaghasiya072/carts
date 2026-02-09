import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getImageUrl } from '../services/api';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';

const Home = () => {
    const dispatch = useDispatch();
    const { items: products, loading, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleAddToCart = (productId) => {
        dispatch(addToCart({ productId, quantity: 1 }));
    };

    if (loading) return <div className="loading">Loading products...</div>;
    if (error) return <div className="error">Error: {error}</div>;

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
                                    onClick={() => handleAddToCart(product._id)}
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
