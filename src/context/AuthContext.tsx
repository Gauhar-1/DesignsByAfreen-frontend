'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

type AuthContextType = {
  userId: string | null;
  role: string | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  userId: null,
  role: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const login = (token: string) => {
    try {
      const decoded = jwtDecode<{ id: string; role: string }>(token);
      localStorage.setItem('token', token);
      setUserId(decoded.id || null);
      setRole(decoded.role || null);
    } catch (err) {
      console.error("Invalid token", err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserId(null);
    setRole(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<{ id: string; role: string }>(token);
        setUserId(decoded.id || null);
        setRole(decoded.role || null);
      } catch {
        logout(); // Clear invalid token
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
     userId,
     role,
     isLoggedIn: !!userId,
     login,
     logout
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
