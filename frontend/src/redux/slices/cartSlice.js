import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getCart,
    addToCart as apiAddToCart,
    updateCartItem as apiUpdateCartItem,
    removeFromCart as apiRemoveFromCart,
    clearCart as apiClearCart
} from '../../services/api';
import { toast } from 'react-toastify';
import { createOrder } from './orderSlice';

const getLocalCartId = () => localStorage.getItem('cartId');

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        const cartId = getLocalCartId();
        if (!cartId) return null;

        try {
            const response = await getCart(cartId);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                localStorage.removeItem('cartId');
                return null;
            }
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ productId, quantity = 1 }, { rejectWithValue, getState }) => {
        const state = getState();
        let cartId = state.cart.cartId || getLocalCartId();

        try {
            const response = await apiAddToCart(productId, quantity, cartId);
            if (!cartId && response.data._id) {
                localStorage.setItem('cartId', response.data._id);
            }
            toast.success('Added to cart!');
            return response.data;
        } catch (error) {
            toast.error('Failed to add: ' + (error.response?.data?.message || error.message));
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ productId, quantity }, { rejectWithValue, getState }) => {
        const state = getState();
        const cartId = state.cart.cartId || getLocalCartId();
        if (!cartId) return rejectWithValue('No cart found');

        try {
            const response = await apiUpdateCartItem(cartId, productId, quantity);
            return response.data;
        } catch (error) {
            toast.error('Update failed');
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (productId, { rejectWithValue, getState }) => {
        const state = getState();
        const cartId = state.cart.cartId || getLocalCartId();
        if (!cartId) return rejectWithValue('No cart found');

        try {
            const response = await apiRemoveFromCart(cartId, productId);
            return response.data;
        } catch (error) {
            toast.error('Removal failed');
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        cartId: getLocalCartId(),
        count: 0,
        loading: false,
        error: null,
        total: 0,
    },
    reducers: {
        clearCartLocal: (state) => {
            state.items = [];
            state.count = 0;
            state.cartId = null;
            state.total = 0;
            localStorage.removeItem('cartId');
        }
    },
    extraReducers: (builder) => {
        const handleCartFulfilled = (state, action) => {
            state.loading = false;
            if (action.payload) {
                state.items = action.payload.items || [];
                state.cartId = action.payload._id;
                state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
                state.total = state.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
            }
        };

        builder
            .addCase(fetchCart.pending, (state) => { state.loading = true; })
            .addCase(fetchCart.fulfilled, handleCartFulfilled)
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addToCart.fulfilled, handleCartFulfilled)
            .addCase(updateCartItem.fulfilled, handleCartFulfilled)
            .addCase(removeFromCart.fulfilled, handleCartFulfilled)
            .addCase(createOrder.fulfilled, (state) => {
                state.items = [];
                state.count = 0;
                state.cartId = null;
                state.total = 0;
                localStorage.removeItem('cartId');
            });
    },
});

export const { clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
