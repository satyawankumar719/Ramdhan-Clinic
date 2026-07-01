import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // IMPORTANT: Enable cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor (no longer needs to set Authorization header manually for cookies)
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const publicRoutes = ["/", "/login", "/forgot-password", "/signup"];
    const isPublicRoute = publicRoutes.includes(window.location.pathname) || 
                          window.location.pathname.startsWith("/reset-password");

    if (error.response?.status === 401 && !isPublicRoute) {
      // Handle unauthorized error (e.g., redirect to login)
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
