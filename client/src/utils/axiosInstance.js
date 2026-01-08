// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

// Add JWT token to every request if available
axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("vihaara_token"); // store JWT on login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
 
export default axiosInstance;
