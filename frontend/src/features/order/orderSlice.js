import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// 📌 Create New Order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (order, { rejectWithValue }) => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' }
      };

      const { data } = await axios.post('/api/new/order', order, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Order creating Failed');
    }
  }
);

// 📌 Get My Orders
export const getMyOrders = createAsyncThunk(
  'order/getMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/orders/user');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);

// 📌 Get Order Details
export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/order/${id}`);
      return data; // { success, order }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch order details');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    success: false,
    loading: false,
    error: null,
    orders: [],
    order: {},        // single order details
  },

  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = null;
    }
  },

  extraReducers: (builder) => {
    builder
      // ----------------------------------------
      // 📌 CREATE ORDER
      // ----------------------------------------
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
        state.success = action.payload.success;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Order Creating Failed';
      })

      // ----------------------------------------
      // 📌 GET MY ORDERS
      // ----------------------------------------
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch orders';
      })

      // ----------------------------------------
      // 📌 GET ORDER DETAILS
      // ----------------------------------------
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch order details';
      });
  }
});

export const { removeErrors, removeSuccess } = orderSlice.actions;
export default orderSlice.reducer;
