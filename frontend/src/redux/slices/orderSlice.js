import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createOrder as apiCreateOrder } from '../../services/api';

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (cartId, { rejectWithValue }) => {
        try {
            const response = await apiCreateOrder(cartId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        currentOrder: null,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetOrderState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.currentOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currentOrder = action.payload;
                state.orders.push(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
