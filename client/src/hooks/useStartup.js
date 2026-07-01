/**
 * hooks/useStartup.js
 * Hook for startup idea CRUD operations with loading/error state.
 */

import { useState, useCallback } from 'react';
import startupService from '../services/startupService';

export const useStartup = () => {
  const [startups, setStartups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStartups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await startupService.getAll();
      setStartups(res.data.data.startups);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch startups.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createStartup = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await startupService.create(formData);
      return res.data.data.startup;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create startup.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { startups, isLoading, error, fetchStartups, createStartup };
};
