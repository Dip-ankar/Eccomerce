import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

/* =============================
   FETCH ALL ADMIN PRODUCTS
============================= */
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/admin/products");
      return data; // MUST return { products: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error While Fetching Products"
      );
    }
  }
);

/* =============================
   CREATE PRODUCT (WITH IMAGE)
============================= */
export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/admin/product/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data; // MUST return { product: {...} }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error While Creating Product"
      );
    }
  }
);

/* =============================
   MERGED ADMIN SLICE
============================= */
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    newProduct: null,
    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },

    removeSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ========= FETCH PRODUCTS =========*/
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })

      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Error while fetching products";
      })

      /* ========= CREATE PRODUCT =========*/
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.newProduct = action.payload.product;

        // OPTIONAL: Immediately push new product into admin products list
        state.products.push(action.payload.product);
      })

      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Error while creating product";
      });
  },
});

export const { removeErrors, removeSuccess } = adminSlice.actions;

export default adminSlice.reducer;
