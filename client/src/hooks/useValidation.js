/**
 * hooks/useValidation.js
 * Hook for running validations and fetching reports.
 */

import { useState, useCallback } from 'react';
import validationService from '../services/validationService';

export const useValidation = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const runValidation = useCallback(async (startupId) => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    try {
      const res = await validationService.run(startupId);
      setReport(res.data.data.report);
      return res.data.data.report;
    } catch (err) {
      const msg = err.response?.data?.message || 'Validation failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchReport = useCallback(async (startupId) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await validationService.getByStartup(startupId);
      setReport(res.data.data.report);
    } catch (err) {
      // 404 means no report exists yet — this is not an error, just means validation hasn't been run
      if (err.response?.status === 404) {
        setReport(null);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch report.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { report, isLoading, error, runValidation, fetchReport };
};
