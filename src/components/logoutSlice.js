import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticatied: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // login(state, action) {
    //   state.isAuthenticated = true;
    //   state.user = action.payload;
    // },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
