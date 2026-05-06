// utils/api.js
import axios from "axios";
import { toast } from "react-hot-toast";
import authConfig from "src/configs/auth";

const baseURL = process.env.NEXT_PUBLIC_APP_API_BASE_URL;

const api = axios.create({
  baseURL,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can modify the request config here before sending the request
    // For example, you can add headers, transform request data, etc.
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

let isBannedMessageShown = false;

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // You can modify the response data here before passing it to the calling function
    return response;
  },
  (error) => {
    if (error?.response?.data?.status === 403 && error?.response?.data?.message === "Forbidden: User is banned") {
      if (!isBannedMessageShown) {
        window.localStorage.removeItem(authConfig.storageUserDataKeyName);
        window.localStorage.removeItem(authConfig.storageTokenKeyName);
        window.location.href = '/login';
        toast.error(error?.response?.data?.message, {
          duration: 5000,
        });
        isBannedMessageShown = true;
      }
    } else {
      error?.response?.data?.message && toast.error(error?.response?.data?.message, {
        duration: 5000,
      });
    }
    return Promise.reject(error);
  }
);

export default api;