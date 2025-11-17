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

export const logout = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/logout', { withCredentials: true });
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to logout')
  }
})

// ===================== UPDATE PROFILE API =====================
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true };
      const { data } = await axios.put("/api/profile/update", formData, config);
      return data; // expects { success: true, user: {...} }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put("/api/password/update", formData, {
        headers: { "Content-Type": "application/json" },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/password/forgot", { email });
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);


export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, formData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const { data } = await axios.put(`/api/password/reset/${token}`, formData, config);

      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);



// ===================== USER SLICE =====================
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')):null,
    loading: false,
    error: null,
    success: false,
    isAuthenticated: localStorage.getItem('isAuthenticated')==='true',
    message:null
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
        state.success = action.payload.success;
        state.isAuthenticated = Boolean(action.payload?.user);

        localStorage.setItem('user',JSON.stringify(state.user));
        localStorage.setItem('isAuthenticated',JSON.stringify(state.isAuthenticated));
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

        localStorage.setItem('user',JSON.stringify(state.user));
        localStorage.setItem('isAuthenticated',JSON.stringify(state.isAuthenticated));
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

        localStorage.setItem('user',JSON.stringify(state.user));
        localStorage.setItem('isAuthenticated',JSON.stringify(state.isAuthenticated));
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to user profiler";
        state.success = false;
        state.user=null;
        state.isAuthenticated = false;

         if(action.payload?.statusCode===401){
          state.user=null;
          state.isAuthenticated=false;
          localStorage.removeItem('user')
          localStorage.removeItem('isAuthenticated')
        }
      });

    //logout user
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = null;
        state.isAuthenticated = false;
         localStorage.removeItem('user')
          localStorage.removeItem('isAuthenticated')
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed logout";

      });

    // ------------------- UPDATE PROFILE -------------------
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user || state.user; // update user info
        state.success = action.payload?.success || true;
        state.isAuthenticated = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update profile";
      });
    builder
      // 👉 UPDATE PASSWORD
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ------------------- FORGOT PASSWORD -------------------
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.success || false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send reset link";
        state.success = false;
      });
    //reset password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.success;
        state.error = null;
        state.user = null;
        state.isAuthenticated = false
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'failed reset password';
      });


  },
});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;