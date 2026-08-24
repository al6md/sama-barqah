'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  CalendarCheck,
  Compass,
  BarChart3,
  Settings,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Shield,
  Bell,
  Check,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { NotificationItem } from '@/lib/db';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [latestToast, setLatestToast] = useState<NotificationItem | null>(null);

  const prevUnreadCount = useRef<number>(0);
  const isFirstLoad = useRef<boolean>(true);

  // Play subtle chime on new booking
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  const fetchNotifications = async () => {
    try {
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('sama_admin_token') : null;
      const res = await fetch('/api/admin/notifications', {
        headers: savedToken ? { Authorization: `Bearer ${savedToken}`, 'x-admin-token': savedToken } : {}
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        const unread = data.unreadCount || 0;
        setUnreadNotifsCount(unread);

        // If new notification arrived after initial load, play sound and show toast
        if (!isFirstLoad.current && unread > prevUnreadCount.current && data.notifications?.length > 0) {
          const newest = data.notifications[0];
          if (!newest.isRead) {
            setLatestToast(newest);
            playChime();
            setTimeout(() => setLatestToast(null), 6500);
          }
        }
        prevUnreadCount.current = unread;
        isFirstLoad.current = false;
      }
    } catch (e) {}
  };

  useEffect(() => {
    let isMounted = true;
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('sama_admin_token') : null;

    fetch('/api/admin/auth', {
      headers: savedToken ? { Authorization: `Bearer ${savedToken}`, 'x-admin-token': savedToken } : {}
    })
      .then((res) => {
        if (!res.ok) {
          if (isMounted) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('sama_admin_token');
              sessionStorage.removeItem('sama_admin_token');
            }
            router.replace('/admin/login');
          }
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data?.isAuthenticated) {
          setAuthenticated(true);
          fetchNotifications();
        } else {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('sama_admin_token');
            sessionStorage.removeItem('sama_admin_token');
          }
          router.replace('/admin/login');
        }
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) {
          router.replace('/admin/login');
          setLoading(false);
        }
      });

    // Real-time notification polling every 6 seconds
    const interval = setInterval(() => {
      if (authenticated) {
        fetchNotifications();
      }
    }, 6000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pathname, router, authenticated]);

  const handleMarkAllRead = async () => {
    try {
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('sama_admin_token') : null;
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(savedToken ? { Authorization: `Bearer ${savedToken}`, 'x-admin-token': savedToken } : {})
        },
        body: JSON.stringify({ all: true })
      });
      setUnreadNotifsCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sama_admin_token');
        sessionStorage.removeItem('sama_admin_token');
        try {
          document.cookie = 'sama_admin_token=; path=/; max-age=0; SameSite=None; Secure';
        } catch (e) {}
      }
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      });
      router.push('/admin/login');
    } catch (e) {
      router.push('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">جاري التحقق من صلاحيات الدخول...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  const menuItems = [
    { name: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard },
    {
      name: 'إدارة الحجوزات',
      href: '/admin/bookings',
      icon: CalendarCheck,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined
    },
    { name: 'إدارة الرحلات', href: '/admin/trips', icon: Compass },
    { name: 'رسائل واستفسارات', href: '/admin/messages', icon: MessageSquare },
    { name: 'الإحصائيات والزوار', href: '/admin/analytics', icon: BarChart3 },
    { name: 'إعدادات الموقع', href: '/admin/settings', icon: Settings }
  ];

  const isCurrent = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col lg:flex-row text-slate-100 font-sans relative">
      {/* Live Floating Booking Toast Alert */}
      {latestToast && (
        <div
          id="admin-live-toast"
          className="fixed top-5 left-5 z-50 max-w-sm w-full bg-amber-400 text-slate-950 p-4 rounded-2xl shadow-2xl border-2 border-slate-950 flex items-start gap-3 animate-in slide-in-from-top duration-300"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs uppercase tracking-wider">🔔 حجز جديد وارد!</span>
              <button
                onClick={() => setLatestToast(null)}
                className="p-1 text-slate-950 hover:bg-slate-900/10 rounded-lg cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs font-bold mt-1 text-slate-950 leading-relaxed">
              {latestToast.message}
            </p>
            <Link
              href="/admin/bookings"
              onClick={() => setLatestToast(null)}
              className="inline-block mt-2 text-[11px] font-black underline hover:text-slate-800"
            >
              عرض وتأكيد الحجز الآن ↗
            </Link>
          </div>
        </div>
      )}

      {/* Sidebar Desktop */}
      <aside
        id="admin-sidebar"
        className="hidden lg:flex w-72 bg-slate-950 border-l border-slate-800 flex-col justify-between shrink-0 p-6 z-20"
      >
        <div className="space-y-8">
          {/* Admin Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-black text-white block">سما البارقة</span>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Admin Control
                </span>
              </div>
            </div>

            {/* Notification Bell Dropdown Toggle */}
            <div className="relative">
              <button
                id="btn-admin-notifications-toggle"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-400 transition-colors cursor-pointer"
                title="الإشعارات"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center border-2 border-slate-950 animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Drawer */}
              {notificationsOpen && (
                <div className="absolute left-0 top-12 w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-xs animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-amber-400" />
                      الإشعارات الواردة
                    </span>
                    {unreadNotifsCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-bold text-amber-400 hover:underline cursor-pointer"
                      >
                        تعليم الكل كمقروء
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 my-2">
                    {notifications.length === 0 ? (
                      <p className="py-6 text-center text-slate-500">لا توجد إشعارات جديدة</p>
                    ) : (
                      notifications.slice(0, 8).map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl transition-colors ${
                            !n.isRead ? 'bg-amber-400/10 text-slate-200' : 'text-slate-400 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-100">{n.title}</span>
                            {!n.isRead && (
                              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                            {n.message}
                          </p>
                          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
                            <span>{new Date(n.createdAt).toLocaleTimeString('ar-IQ')}</span>
                            {n.bookingId && (
                              <Link
                                href="/admin/bookings"
                                onClick={() => setNotificationsOpen(false)}
                                className="text-amber-400 font-bold hover:underline"
                              >
                                عرض الحجز #{n.bookingId}
                              </Link>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const active = isCurrent(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  id={`admin-nav-${item.href.replace('/admin', '') || 'dash'}`}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        active ? 'bg-slate-950 text-amber-300' : 'bg-amber-500 text-slate-950 animate-pulse'
                      }`}
                    >
                      {item.badge} جديد
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 pt-6 border-t border-slate-800">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-slate-500" />
            <span>معاينة الموقع العام</span>
          </Link>

          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="lg:hidden bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white">إدارة سما البارقة</span>
        </div>

        <div className="flex items-center gap-2">
          {unreadNotifsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
              {unreadNotifsCount} جديد
            </span>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 text-slate-200 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-2 z-30 animate-in slide-in-from-top">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrent(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold ${
                  active ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-600 text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex justify-between">
            <Link href="/" target="_blank" className="text-xs text-slate-400 p-2">
              الموقع العام ↗
            </Link>
            <button onClick={handleLogout} className="text-xs text-rose-400 p-2 font-bold cursor-pointer">
              تسجيل الخروج
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}


