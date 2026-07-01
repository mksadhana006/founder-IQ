/**
 * services/dashboardService.js
 * API calls for dashboard and history endpoints.
 */

import axiosInstance from '../utils/axiosInstance';

const dashboardService = {
  /**
   * Get aggregated dashboard data (stats + recent items).
   */
  getDashboard: () => axiosInstance.get('/dashboard'),

  /**
   * Get full validation history.
   */
  getHistory: () => axiosInstance.get('/dashboard/history'),

  // TODO: V2 — Add methods for:
  //   getAnalytics: () => axiosInstance.get('/dashboard/analytics'),
  //   getBookmarks: () => axiosInstance.get('/dashboard/bookmarks'),
  //   exportHistory: () => axiosInstance.get('/dashboard/export', { responseType: 'blob' }),
};

export default dashboardService;
