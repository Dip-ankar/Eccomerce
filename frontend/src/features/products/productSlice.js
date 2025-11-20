import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* -------------------------------------------------------------
   📌 GET ALL PRODUCTS
----------------------------------------------------------------*/
export const getProduct = createAsyncThunk(
  "product/getProduct",
  async ({ keyword = "", page = 1, limit = 10, category = "" }, { rejectWithValue }) => {
    try {
      let link = `/api/products?page=${page}&limit=${limit}`;

      if (category) link += `&category=${encodeURIComponent(category)}`;
      if (keyword) link += `&keyword=${encodeURIComponent(keyword)}`;

      const { data } = await axios.get(link);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch products");
    }
  }
);

/* -------------------------------------------------------------
   📌 GET PRODUCT DETAILS
----------------------------------------------------------------*/
export const getProductDetails = createAsyncThunk(
  "product/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/product/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch product details");
    }
  }
);

/* -------------------------------------------------------------
   📌 CREATE PRODUCT REVIEW
----------------------------------------------------------------*/
export const createReview = createAsyncThunk(
  "product/createReview",
  async ({ rating, comment, productId }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.put(
        `/api/review`,
        { rating, comment, productId },
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to submit review");
    }
  }
);

/* -------------------------------------------------------------
   📌 SLICE
----------------------------------------------------------------*/
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

    // review states
    reviewSuccess: false,
    reviewLoading: false,
  },

  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.reviewSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder

      /* -------------------------------------------------------------
         📌 ALL PRODUCTS
      ---------------------------------------------------------------*/
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
        state.error = action.payload;
        state.products = [];
      })

      /* -------------------------------------------------------------
         📌 PRODUCT DETAILS
      ---------------------------------------------------------------*/
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
        state.error = action.payload;
      })

      /* -------------------------------------------------------------
         📌 CREATE REVIEW
      ---------------------------------------------------------------*/
      .addCase(createReview.pending, (state) => {
        state.reviewLoading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviewLoading = false;
        state.reviewSuccess = true; // ✔ Correct success flag
      })
      .addCase(createReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.error = action.payload;
      });
  },
});

export const { removeErrors, removeSuccess } = productSlice.actions;
export default productSlice.reducer;
