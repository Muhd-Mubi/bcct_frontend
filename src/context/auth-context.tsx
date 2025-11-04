'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: any;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // On initial load, check if user is logged in (e.g., from a token in localStorage)
    // For this simple example, we'll just check if the user state is set.
    if (!user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, pathname, router]);

  const login = (username: string, pass: string) => {
    // Hardcoded credentials
    if (username === 'admin' && pass === 'password') {
      const userData = { username: 'admin', name: 'Admin User' };
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
