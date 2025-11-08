import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ===================== REGISTER API =====================
export const register = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.post("/api/register", formData, config);
      return data; // return API response
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed, please try again later"
      );
    }
  }
);

// ===================== LOGIN API =====================
export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post("/api/login", { email, password }, config);
      return data; // return API response
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed, please try again later"
      );
    }
  }
);

export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/me", { withCredentials: true });
      return data; // expects { success: true, user: {...} }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load user profile"
      );
    }
  }
);

// ===================== USER SLICE =====================
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
    isAuthenticated: false,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    // ------------------- REGISTER -------------------
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user || null;
        state.success = action.payload?.success || false;
        state.isAuthenticated = Boolean(action.payload?.user);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed, please try again later";
        state.success = false;
        state.isAuthenticated = false;
      });

    // ------------------- LOGIN -------------------
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user || null;
        state.success = action.payload?.success || false;
        state.isAuthenticated = Boolean(action.payload?.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed, please try again later";
        state.success = false;
        state.isAuthenticated = false;
      });

      //load User
      builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload?.user || null;
  state.isAuthenticated = Boolean(action.payload?.user);
})
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to user profiler";
        state.success = false;
        state.isAuthenticated = false;
      });
  },
});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;
