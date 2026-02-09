import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCart, addToCart as apiAddToCart, createOrder as apiCreateOrder } from '../../services/api'; // Import apiCreateOrder just in case, but we use orderSlice's thunk usually? No, cartSlice doesn't call createOrder API directly.
import { toast } from 'react-toastify';
import { createOrder } from './orderSlice'; // Import the thunk from orderSlice

// Helper to get cartId from localStorage
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

            // If we didn't have a cartId before, save the new one
            if (!cartId && response.data._id) {
                localStorage.setItem('cartId', response.data._id);
            }

            toast.success('Added to cart!');
            return response.data;
        } catch (error) {
            toast.error('Failed to add to cart: ' + (error.response?.data?.message || error.message));
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
        clearCart: (state) => {
            state.items = [];
            // state.count = 0; // Don't reset count immediately if purely local? Wait, clearCart means empty.
            state.count = 0;
            state.cartId = null;
            state.total = 0;
            localStorage.removeItem('cartId');
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.items = action.payload.items || [];
                    state.cartId = action.payload._id;
                    state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
                    state.total = state.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
                } else {
                    // Cart not found or empty
                    state.items = [];
                    state.count = 0;
                    state.cartId = null;
                    state.total = 0;
                }
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add To Cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.cartId = action.payload._id;
                state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
                state.total = state.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle Order Creation Success (Clear Cart)
            .addCase(createOrder.fulfilled, (state) => {
                state.items = [];
                state.count = 0;
                state.cartId = null;
                state.total = 0;
                localStorage.removeItem('cartId');
            });
    },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
