/**
 * services/validationService.js
 * API calls for validation report endpoints.
 */

import axiosInstance from '../utils/axiosInstance';

const validationService = {
  /**
   * Trigger a full validation pipeline for a startup.
   * This is expensive — calls Gemini + Tavily APIs.
   * @param {string} startupId
   */
  run: (startupId) => axiosInstance.post(`/validation/${startupId}`),

  /**
   * Get the latest validation report for a startup.
   * @param {string} startupId
   */
  getByStartup: (startupId) => axiosInstance.get(`/validation/${startupId}`),

  // TODO: V2 — Add methods for:
  //   exportPDF: (id) => axiosInstance.get(`/validation/${id}/export`, { responseType: 'blob' }),
  //   share: (id) => axiosInstance.post(`/validation/${id}/share`),
};

export default validationService;
