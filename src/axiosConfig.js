import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: "https://college-assists-consequences-shop.trycloudflare.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: add interceptors for request or response
// Example: attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
