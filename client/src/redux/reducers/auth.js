import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    updateUserSuccess: (state, action) => {
      state.user = action.payload;
    },
    deleteUserSuccess: (state) => {
      state.user = null;
  },
  },
});

export const { login, logout,updateUserSuccess,deleteUserSuccess } = authSlice.actions;
export default authSlice.reducer;