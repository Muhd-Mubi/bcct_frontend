'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserRole } from '@/lib/types';

interface User {
    username: string;
    name: string;
    email: string;
    role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<string, { pass: string, user: User }> = {
    leadership: {
        pass: 'password',
        user: { username: 'leadership', name: 'Leadership User', email: 'leadership@bcct.com', role: 'leadership' }
    },
    admin: {
        pass: 'password',
        user: { username: 'admin', name: 'Admin User', email: 'admin@bcct.com', role: 'admin' }
    },
    technical: {
        pass: 'password',
        user: { username: 'technical', name: 'Technical Staff', email: 'tech@bcct.com', role: 'technical' }
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    } else if (pathname !== '/login') {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    if (!user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, pathname, router]);

  const login = (username: string, pass: string) => {
    const userData = mockUsers[username];
    if (userData && userData.pass === pass) {
      setUser(userData.user);
      sessionStorage.setItem('user', JSON.stringify(userData.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    router.push('/login');
  };

  const switchRole = (role: UserRole) => {
    if (mockUsers[role]) {
        login(role, mockUsers[role].pass);
        router.push('/dashboard');
    }
  };

  const value = { user, login, logout, switchRole };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
