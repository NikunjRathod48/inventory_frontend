import { createContext, useContext, useState, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('access_token') || null);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'Admin';
  const isManager = user?.role === 'Manager';
  const isCashier = user?.role === 'Cashier';

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, isManager, isCashier, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
