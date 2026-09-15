import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getLoggedInUser, setLoggedInUser } from '../services/auth/authService';
import { authenticate } from '../services/auth/userService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getLoggedInUser());

  useEffect(() => {
    setLoggedInUser(user);
  }, [user]);

  const login = (email: string, password: string) => {
    const authenticatedUser = authenticate(email, password);
    setUser(authenticatedUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
