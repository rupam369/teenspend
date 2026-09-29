import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [token, setToken] = useState(authService.getToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const existingToken = authService.getToken();
      if (existingToken) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
          setToken(existingToken);
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();

    // Listen for unauthorized events from api.js
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('teenspend:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('teenspend:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    setUser(res.data.user);
    setToken(res.data.token);
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    setUser(res.data.user);
    setToken(res.data.token);
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (data) => {
    const updated = await authService.updateProfile(data);
    setUser(updated);
    return updated;
  };

  const refreshUser = async () => {
    try {
      const freshUser = await authService.getMe();
      setUser(freshUser);
      return freshUser;
    } catch {
      return user;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
