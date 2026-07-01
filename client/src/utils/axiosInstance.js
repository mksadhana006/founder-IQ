/**
 * utils/axiosInstance.js
 * Configured Axios instance with:
 *   - Base URL from environment
 *   - JWT Authorization header injection
 *   - Automatic 401 logout handling
 */

import axios from 'axios';
import { API_BASE_URL, LOCAL_STORAGE_KEYS } from './constants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds (AI calls can take time)
});

// ─── Request Interceptor: Attach JWT Token ────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle Errors Globally ────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // On 401: clear local auth state and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);

      // Only redirect if not already on auth pages
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
