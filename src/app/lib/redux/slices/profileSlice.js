// redux/slices/profileSlice.js
import { getUserProfile } from "@/app/api/profileAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserProfile();
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  userData: null,
  roleData: null, // buyer or seller data
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setRoleData: (state, action) => {
      state.roleData = action.payload;
    },
    clearProfile: (state) => {
      state.userData = null;
      state.roleData = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setUserData, setRoleData, clearProfile, setLoading, setError } =
  profileSlice.actions;

export default profileSlice.reducer;
