/**
 * context/AuthContext.jsx
 * Global authentication state using React Context.
 * Provides user state, login, logout, and register functions.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while checking stored auth

  // ─── Initialize from localStorage ──────────────────────────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        // Corrupt data — clear it
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
      }
    }
    setIsLoading(false);
  }, []);

  // ─── Persist auth state ─────────────────────────────────────────────────────
  const persistAuth = useCallback((tokenValue, userData) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, tokenValue);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  }, []);

  // ─── Register ───────────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    const response = await authService.register(formData);
    const { token: newToken, user: newUser } = response.data.data;
    persistAuth(newToken, newUser);
    return response.data;
  }, [persistAuth]);

  // ─── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (formData) => {
    const response = await authService.login(formData);
    const { token: newToken, user: newUser } = response.data.data;
    persistAuth(newToken, newUser);
    return response.data;
  }, [persistAuth]);

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
    // TODO: V2 — Call logout API endpoint (for server-side session invalidation)
  }, []);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access AuthContext. Must be used within AuthProvider.
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
