/**
 * hooks/useDashboard.js
 * Hook for fetching dashboard stats and history.
 */

import { useState, useCallback } from 'react';
import dashboardService from '../services/dashboardService';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getDashboard();
      setDashboardData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getHistory();
      setHistory(res.data.data.reports);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load history.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { dashboardData, history, isLoading, error, fetchDashboard, fetchHistory };
};
