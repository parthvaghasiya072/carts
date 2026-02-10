import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Automatically add Authorization header if token exists
api.interceptors.request.use(
    (config) => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const { token } = JSON.parse(savedUser);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('API Interceptor: Error parsing token', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getProducts = () => api.get('/products/getallproducts');

export const createProduct = (formData) => api.post('/products/createproduct', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const getProductById = (id) => api.get(`/products/getproduct/${id}`);

export const updateProduct = (id, productData) => api.put(`/products/updateproduct/${id}`, productData);

export const deleteProduct = (id) => api.delete(`/products/deleteproduct/${id}`);

export const getCart = (cartId) => api.get(`/cart/getcart/${cartId}`);

export const addToCart = (productId, quantity, cartId) =>
    api.post('/cart/addtocart', { productId, quantity, cartId });

export const updateCartItem = (cartId, productId, quantity) =>
    api.put(`/cart/updateitem/${cartId}/${productId}`, { quantity });

export const removeFromCart = (cartId, productId) =>
    api.delete(`/cart/removeitem/${cartId}/${productId}`);

export const clearCart = (cartId) =>
    api.delete(`/cart/clearcart/${cartId}`);

export const createOrder = (cartId) =>
    api.post('/orders/createorder', { cartId });

export const getAllOrders = () => api.get('/orders/getallorders');

export const getOrderById = (id) => api.get(`/orders/getorder/${id}`);

export const updateOrderStatus = (id, status) =>
    api.put(`/orders/updateorder/${id}`, { status });

export const deleteOrder = (id) =>
    api.delete(`/orders/deleteorder/${id}`);

export const getImageUrl = (path) => {
    return path
        ? (path.startsWith('http') ? path : `http://localhost:5000${path}`)
        : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800';
};

export default api;
