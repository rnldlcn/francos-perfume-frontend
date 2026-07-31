import axios from "axios";
import { API_URL } from "../config/index.js";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
    (config) => {

      if (config.url.includes("/auth/login")) {
        return config;
      }
      
      const token = sessionStorage.getItem("accessToken");
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized access - token may be invalid or expired.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;