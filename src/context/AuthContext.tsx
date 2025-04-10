
import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  // Mock implementations for auth functions
  const login = async (email: string, password: string) => {
    // In a real app, this would call an API
    console.log('Logging in with', email, password);
    setUser({
      id: '1',
      name: 'Demo User',
      email: email,
      avatar: '/placeholder.svg',
    });
  };

  const loginWithGoogle = async () => {
    // Mock Google login
    console.log('Logging in with Google');
    setUser({
      id: '2',
      name: 'Google User',
      email: 'google@example.com',
      avatar: '/placeholder.svg',
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    // Mock signup
    console.log('Signing up', name, email);
    setUser({
      id: '3',
      name: name,
      email: email,
      avatar: '/placeholder.svg',
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        loginWithGoogle,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
