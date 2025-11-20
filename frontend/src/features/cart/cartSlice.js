import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Async Thunk: Fetch product details and add to cart
export const addItemsToCart = createAsyncThunk(
  "cart/addItemsToCart",
  async ({ id, quantity, userId }, { rejectWithValue }) => {
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
        image: data.product.image?.[0]?.url || "",
        stock: data.product.stock,
        quantity,
        userId,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Error adding product to cart");
    }
  }
);

// ✅ Helper: Load cart items for a specific user
const getCartItems = (userId) => {
  if (!userId) return [];
  const saved = localStorage.getItem(`cartItems_${userId}`);
  return saved ? JSON.parse(saved) : [];
};

// ✅ Helper: Load shipping info (if exists)
const getShippingInfo = () => {
  const saved = localStorage.getItem("shippingInfo");
  return saved ? JSON.parse(saved) : {};
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems:[],
    loading: false,
    error: null,
    success: false,
    message: null,
    shippingInfo: getShippingInfo(),
  },

  reducers: {
    // ✅ Load user's cart (called when login)
    loadCartForUser: (state, action) => {
      const userId = action.payload;
      state.cartItems = getCartItems(userId);
    },

    // ✅ Remove item
    removeCartItem: (state, action) => {
      const { id, userId } = action.payload;
      state.cartItems = state.cartItems.filter((i) => i.product !== id);
      localStorage.setItem(
        `cartItems_${userId}`,
        JSON.stringify(state.cartItems)
      );
      state.message = "Item removed from cart!";
    },

    // ✅ Clear cart
    clearCart: (state, action) => {
      const userId = action.payload;
      state.cartItems = [];
      localStorage.removeItem(`cartItems_${userId}`);
      localStorage.removeItem('shippingInfo')
    },

    // ✅ Update quantity
    updateQuantity: (state, action) => {
      const { id, quantity, userId } = action.payload;
      const item = state.cartItems.find((i) => i.product === id);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem(
          `cartItems_${userId}`,
          JSON.stringify(state.cartItems)
        );
      }
    },

    // ✅ Save shipping info
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(action.payload));
    },

    // ✅ Reset error & message
    removeErrors: (state) => {
      state.error = null;
    },
    removeMessage: (state) => {
      state.message = null;
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

        const existing = state.cartItems.find(
          (i) => i.product === item.product
        );

        if (existing) {
          existing.quantity = item.quantity;
        } else {
          state.cartItems.push(item);
        }

        localStorage.setItem(
          `cartItems_${item.userId}`,
          JSON.stringify(state.cartItems)
        );

        state.success = true;
        state.message = `${item.name} added to cart successfully!`;
      })
      .addCase(addItemsToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add to cart";
      });
  },
});

export const {
  loadCartForUser,
  removeCartItem,
  clearCart,
  updateQuantity,
  removeErrors,
  removeMessage,
  saveShippingInfo,
} = cartSlice.actions;

export default cartSlice.reducer;