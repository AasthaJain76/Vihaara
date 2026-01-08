import { createSlice } from "@reduxjs/toolkit";

// 🛡️ Safe parse helper
const safeParse = (key) => {
  try {
    const value = localStorage.getItem(key);
    if (!value || value === "undefined") return null;
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const initialState = {
  status: !!localStorage.getItem("token"), // true if token exists
  userData: safeParse("userData"),
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { userData, token } = action.payload;
      state.status = true;
      state.userData = userData;
      state.token = token;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(userData));
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.token = null;

      // Remove from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
