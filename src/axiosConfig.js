import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: "http://192.168.111.53:8080", 
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
