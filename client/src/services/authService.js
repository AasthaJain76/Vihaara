// services/authService.js
import axiosInstance from "../utils/axiosInstance";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// ✅ Register user
export const register = async (userData) => {
  const res = await axiosInstance.post('/auth/signup', userData);
  // Store JWT token
  if (res.data.token) {
    sessionStorage.setItem("vihaara_token", res.data.token);
  }
  return res.data.user;
};

// ✅ Login user
export const login = async (userData) => {
  const res = await axiosInstance.post('/auth/login', userData);
  // Store JWT token
  if (res.data.token) {
    sessionStorage.setItem("vihaara_token", res.data.token);
  }
  return res.data.user;
};

// ✅ Logout user
export const logout = async () => {
  // For JWT, logout is frontend-only: remove token
  sessionStorage.removeItem("vihaara_token");
  return { success: true };
};

// ✅ Get current logged-in user
export const getCurrentUser = async () => {
  try {
    const res = await axiosInstance.get('/auth/me');
    return res.data.user;
  } catch (err) {
    console.error("User not authenticated", err);
    return null;
  }
};
