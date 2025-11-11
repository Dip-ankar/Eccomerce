import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Add Item to Cart (with localStorage sync)
export const addItemsToCart = createAsyncThunk(
  "cart/addItemsToCart",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/product/${id}`);
      const data = await response.json();

      if (!data || !data.product) {
        throw new Error("Invalid product data");
      }

      return {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.image[0].url,
        stock: data.product.stock,
        quantity,
      };
    } catch (error) {
      return rejectWithValue(error.message || "An Error Occurred");
    }
  }
);

// ✅ Load initial cart items from localStorage
const storedCartItems = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: storedCartItems,
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeMessage: (state) => {
      state.message = null;
    },
    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.product !== action.payload
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      state.message = "Item removed from cart!";
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
      state.message = "Cart cleared!";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemsToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addItemsToCart.fulfilled, (state, action) => {
        const item = action.payload;
        state.loading = false;

        const existingItem = state.cartItems.find(
          (i) => i.product === item.product
        );

        if (existingItem) {
          // Update quantity if item already exists
          existingItem.quantity = item.quantity;
        } else {
          state.cartItems.push(item);
        }

        // ✅ Save updated cart to localStorage
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));

        state.success = true;
        state.message = `${item.name} added to cart successfully!`;
      })
      .addCase(addItemsToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An Error Occurred";
        state.success = false;
      });
  },
});

export const {
  removeErrors,
  removeMessage,
  removeCartItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
