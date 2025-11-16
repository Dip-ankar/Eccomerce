import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getProduct = createAsyncThunk(
  "product/getProduct",
  async ({ keyword = "", page = 1, limit = 10, category = "" }, { rejectWithValue }) => {
    try {
      // Build dynamic query
      let link = `/api/products?page=${page}&limit=${limit}`;

      if (category) link += `&category=${encodeURIComponent(category)}`;
      if (keyword) link += `&keyword=${encodeURIComponent(keyword)}`;
     

      const { data } = await axios.get(link);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);


// ✅ Fetch single product details by ID
export const getProductDetails = createAsyncThunk(
  "product/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/product/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    productCount: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null,
    product: null,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // All Products
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.productCount = action.payload.totalProducts;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.products = [];
      })

      // Product Details
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { removeErrors } = productSlice.actions;
export default productSlice.reducer;