// src/context/AuthContext.tsx

import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; // Importer toast

type User = {
  id: number;
  firstName: string;
  role: 'buyer' | 'seller' | 'admin';
  [key: string]: any;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: Record<string, any>) => Promise<void>;
  signup: (userData: Record<string, any>) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/auth';

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage) {
      const userString = localStorage.getItem('user');
      const userFromStorage = userString ? JSON.parse(userString) : null;
      setUser(userFromStorage);
      setToken(tokenFromStorage);
    }
    setLoading(false);
  }, []);
  
  const signup = async (userData: Record<string, any>) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
    toast.success(`Welcome, ${user.firstName}!`);
  };

  const login = async (credentials: Record<string, any>) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
    toast.success(`Welcome back, ${user.firstName}!`);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Successfully logged out.');
  };

  const value = { user, token, loading, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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