// frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  emailVerified?: boolean;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void; // ✅ AJOUTÉ
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType: string;
  }) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    const { token, user: userData } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const signup = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType: string;
  }) => {
    // ⚠️ NE PAS CONNECTER AUTOMATIQUEMENT L'UTILISATEUR
    const response = await api.post('/auth/register', data);

    // Ne pas stocker le token ni connecter l'utilisateur
    // L'utilisateur devra se connecter APRÈS avoir vérifié son email
    console.log('✅ Signup successful:', response.data.message);

    // Retourner la réponse sans connecter l'utilisateur
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser,  // ✅ AJOUTÉ
        login, 
        signup, 
        logout, 
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};