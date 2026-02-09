import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts, createProduct as apiCreateProduct } from '../../services/api';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getProducts();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await apiCreateProduct(formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        loading: false,
        error: null,
        createStatus: 'idle', // idle, loading, succeeded, failed
    },
    reducers: {
        resetCreateStatus: (state) => {
            state.createStatus = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createProduct.pending, (state) => {
                state.createStatus = 'loading';
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.createStatus = 'succeeded';
                state.items.push(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.createStatus = 'failed';
                state.error = action.payload;
            });
    },
});

export const { resetCreateStatus } = productSlice.actions;
export default productSlice.reducer;
