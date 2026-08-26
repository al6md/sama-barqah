'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserAccount, Booking } from '@/lib/db';

interface UserAuthContextType {
  user: UserAccount | null;
  isLoggedIn: boolean;
  isGuest: boolean;
  loading: boolean;
  userBookings: Booking[];
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'guest';
  openAuthModal: (tab?: 'login' | 'register' | 'guest') => void;
  closeAuthModal: () => void;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  register: (data: { name: string; phone: string; email?: string; password: string }) => Promise<{ success: boolean; error?: string; message?: string }>;
  continueAsGuest: (name?: string, phone?: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<UserAccount>) => Promise<{ success: boolean; error?: string; message?: string }>;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'sama_customer_user_v1';
const LOCAL_STORAGE_TOKEN_KEY = 'sama_customer_token_v1';

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'guest'>('login');

  const openAuthModal = useCallback((tab: 'login' | 'register' | 'guest' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) : null;
      const headers: HeadersInit = {};
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
        headers['x-customer-token'] = storedToken;
      }

      const res = await fetch('/api/auth/me', { headers }).catch(() => null);
      if (!res || !res.ok) {
        // Fallback to local storage if API is temporarily unavailable
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              setUser(parsed);
            } catch {
              setUser(null);
            }
          }
        }
        return;
      }

      const data = await res.json().catch(() => null);

      if (data && data.success && data.user) {
        setUser(data.user);
        setUserBookings(data.bookings || []);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
        }
      } else {
        // Check if there is cached local storage
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              setUser(parsed);
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    } catch {
      // Graceful silent fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadAuth() {
      try {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) : null;
        const headers: HeadersInit = {};
        if (storedToken) {
          headers['Authorization'] = `Bearer ${storedToken}`;
          headers['x-customer-token'] = storedToken;
        }

        const res = await fetch('/api/auth/me', { headers }).catch(() => null);
        if (!isMounted) return;

        if (!res || !res.ok) {
          if (typeof window !== 'undefined') {
            const cached = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
            if (cached) {
              try {
                const parsed = JSON.parse(cached);
                setUser(parsed);
              } catch {
                setUser(null);
              }
            } else {
              setUser(null);
            }
          }
          return;
        }

        const data = await res.json().catch(() => null);
        if (!isMounted) return;

        if (data && data.success && data.user) {
          setUser(data.user);
          setUserBookings(data.bookings || []);
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
          }
        } else {
          if (typeof window !== 'undefined') {
            const cached = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
            if (cached) {
              try {
                const parsed = JSON.parse(cached);
                setUser(parsed);
              } catch {
                setUser(null);
              }
            } else {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      } catch {
        // Fallback gracefully without console error
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
          if (data.token) {
            localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
          }
        }
        setIsAuthModalOpen(false);
        refreshUser();
        return { success: true, message: data.message };
      }

      return { success: false, error: data.error || 'فشل تسجيل الدخول' };
    } catch (err: any) {
      return { success: false, error: 'حدث خطأ في الاتصال بالخادم' };
    }
  };

  const register = async (userData: { name: string; phone: string; email?: string; password: string }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
          if (data.token) {
            localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
          }
        }
        setIsAuthModalOpen(false);
        refreshUser();
        return { success: true, message: data.message };
      }

      return { success: false, error: data.error || 'فشل إنشاء الحساب' };
    } catch (err: any) {
      return { success: false, error: 'حدث خطأ في الاتصال بالخادم' };
    }
  };

  const continueAsGuest = async (name?: string, phone?: string) => {
    try {
      const res = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone })
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
          if (data.token) {
            localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
          }
        }
        setIsAuthModalOpen(false);
        refreshUser();
        return { success: true, message: data.message };
      }

      // Local fallback for guest
      const fallbackGuest: UserAccount = {
        id: `guest-${Date.now()}`,
        name: name?.trim() || 'زائر سما البارقة',
        phone: phone?.trim() || '',
        role: 'guest',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUser(fallbackGuest);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fallbackGuest));
      }
      setIsAuthModalOpen(false);
      return { success: true, message: 'مرحباً بك كزائر في سما البارقة' };
    } catch (err: any) {
      const fallbackGuest: UserAccount = {
        id: `guest-${Date.now()}`,
        name: name?.trim() || 'زائر سما البارقة',
        phone: phone?.trim() || '',
        role: 'guest',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUser(fallbackGuest);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fallbackGuest));
      }
      setIsAuthModalOpen(false);
      return { success: true, message: 'مرحباً بك كزائر في سما البارقة' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setUser(null);
    setUserBookings([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    }
  };

  const updateProfile = async (data: Partial<UserAccount>) => {
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) : null;
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
        headers['x-customer-token'] = storedToken;
      }

      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data)
      });
      const resData = await res.json();

      if (resData.success && resData.user) {
        setUser(resData.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(resData.user));
        }
        refreshUser();
        return { success: true, message: resData.message };
      }

      return { success: false, error: resData.error || 'تعذر حفظ التعديلات' };
    } catch (err: any) {
      return { success: false, error: 'حدث خطأ في الاتصال' };
    }
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isGuest: user?.role === 'guest',
        loading,
        userBookings,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        continueAsGuest,
        logout,
        refreshUser,
        updateProfile
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
}
