/**
 * services/authService.js
 * API calls for authentication endpoints.
 */

import axiosInstance from '../utils/axiosInstance';

const authService = {
  /**
   * Register a new user.
   * @param {{ name: string, email: string, password: string }} data
   */
  register: (data) => axiosInstance.post('/auth/register', data),

  /**
   * Login with email and password.
   * @param {{ email: string, password: string }} data
   */
  login: (data) => axiosInstance.post('/auth/login', data),

  /**
   * Get the current authenticated user profile.
   */
  getMe: () => axiosInstance.get('/auth/me'),

  // TODO: V2 — Add methods for:
  //   forgotPassword: (email) => axiosInstance.post('/auth/forgot-password', { email }),
  //   resetPassword: (token, password) => axiosInstance.post(`/auth/reset-password/${token}`, { password }),
  //   updateProfile: (data) => axiosInstance.patch('/auth/update-profile', data),
  //   changePassword: (data) => axiosInstance.patch('/auth/change-password', data),
};

export default authService;
