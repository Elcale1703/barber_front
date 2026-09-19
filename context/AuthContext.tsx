'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole, UserSession, LoginCredentials } from '@/types/auth';
import { getStoredToken, getStoredUser, setAuthSession, clearAuthSession } from '@/lib/auth';

interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: UserRole, barberId?: number, barberName?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load session from storage on mount
  useEffect(() => {
    try {
      const savedToken = getStoredToken();
      const savedUser = getStoredUser();

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
      } else {
        // Set default demo session as ADMIN for convenient first load
        const defaultAdmin: UserSession = {
          id: 'admin-1',
          name: 'Administrador General',
          email: 'admin@barberia.com',
          role: 'ADMIN',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
        };
        const defaultToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbi0xIiwibmFtZSI6IkFkbWluaXN0cmFkb3IgR2VuZXJhbCIsInJvbGUiOiJBRE1JTiJ9.demo_token';
        setAuthSession(defaultToken, defaultAdmin);
        setUser(defaultAdmin);
        setToken(defaultToken);
      }
    } catch (e) {
      console.error('Failed to restore auth session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }

      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      setAuthSession(data.token, data.user);

      if (data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/barber');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthSession();
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  const switchRole = async (newRole: UserRole, barberId?: number, barberName?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: newRole,
          barberId: barberId || (newRole === 'BARBER' ? 1 : undefined),
          email: newRole === 'ADMIN' ? 'admin@barberia.com' : `barbero${barberId || 1}@barberia.com`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (barberName && data.user) {
          data.user.name = barberName;
        }
        setToken(data.token);
        setUser(data.user);
        setAuthSession(data.token, data.user);

        if (newRole === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/barber');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role ?? null,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
