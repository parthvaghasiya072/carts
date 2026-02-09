import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const getProducts = () => api.get('/products');
export const createProduct = (formData) => api.post('/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const getCart = (cartId) => api.get(`/cart/${cartId}`);
export const addToCart = (productId, quantity, cartId) => api.post('/cart', { productId, quantity, cartId });
export const createOrder = (cartId) => api.post('/orders', { cartId });

export const getImageUrl = (path) => {
    return path ? (path.startsWith('http') ? path : `http://localhost:5000${path}`) : 'https://via.placeholder.com/150';
};

export default api;
