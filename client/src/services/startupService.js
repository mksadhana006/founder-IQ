/**
 * services/startupService.js
 * API calls for startup idea endpoints.
 */

import axiosInstance from '../utils/axiosInstance';

const startupService = {
  /**
   * Create a new startup idea.
   * @param {{ title, problemStatement, targetUsers, keyFeatures, industry }} data
   */
  create: (data) => axiosInstance.post('/startups', data),

  /**
   * Get all startup ideas for the current user.
   */
  getAll: () => axiosInstance.get('/startups'),

  /**
   * Get a single startup idea by ID.
   * @param {string} id
   */
  getById: (id) => axiosInstance.get(`/startups/${id}`),

  // TODO: V2 — Add methods for:
  //   update: (id, data) => axiosInstance.patch(`/startups/${id}`, data),
  //   delete: (id) => axiosInstance.delete(`/startups/${id}`),
  //   bookmark: (id) => axiosInstance.post(`/startups/${id}/bookmark`),
  //   share: (id) => axiosInstance.post(`/startups/${id}/share`),
};

export default startupService;
