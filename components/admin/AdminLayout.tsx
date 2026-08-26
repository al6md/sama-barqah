'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  Volume2,
  VolumeX,
  UserCheck,
  ChevronRight,
  PlusCircle
} from 'lucide-react';
import { NotificationItem } from '@/lib/db';
import { SamaLogo } from '@/components/SamaLogo';

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
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [adminUser, setAdminUser] = useState<{ username: string; name: string; email?: string } | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('sama_admin_user');
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return null;
  });

  const prevUnreadCount = useRef<number>(0);
  const isFirstLoad = useRef<boolean>(true);

  // Listen for admin user updates
  useEffect(() => {
    const handleUserUpdate = () => {
      try {
        const cached = localStorage.getItem('sama_admin_user');
        if (cached) setAdminUser(JSON.parse(cached));
      } catch (e) {}
    };
    window.addEventListener('admin_user_updated', handleUserUpdate);
    window.addEventListener('storage', handleUserUpdate);
    return () => {
      window.removeEventListener('admin_user_updated', handleUserUpdate);
      window.removeEventListener('storage', handleUserUpdate);
    };
  }, []);

  // Play subtle chime on new booking
  const playChime = useCallback(() => {
    if (!soundEnabled) return;
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
      // audio restrictions
    }
  }, [soundEnabled]);

  const fetchNotifications = useCallback(async () => {
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
  }, [playChime]);

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
          if (data.user) {
            setAdminUser(data.user);
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('sama_admin_user', JSON.stringify(data.user));
              } catch (e) {}
            }
          }
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

    // Real-time notification polling only when authenticated and tab is active
    let interval: NodeJS.Timeout | null = null;
    if (authenticated && savedToken) {
      interval = setInterval(() => {
        if (typeof document !== 'undefined' && document.hidden) return;
        fetchNotifications();
      }, 20000);
    }

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [pathname, router, authenticated, fetchNotifications]);

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
      <div className="min-h-screen bg-[#FDFFF5] flex items-center justify-center text-[#1D2D2E]">
        <div className="text-center space-y-4 bg-white border-[3px] border-[#1D2D2E] p-8 rounded-3xl shadow-[6px_6px_0px_#1D2D2E]">
          <div className="w-12 h-12 border-4 border-[#FF7E47] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-[#1D2D2E]">جاري التحقق من صلاحيات المدير...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  const menuItems = [
    { name: 'لوحة التحكم المركزية', href: '/admin', icon: LayoutDashboard },
    {
      name: 'إدارة الحجوزات والطلبات',
      href: '/admin/bookings',
      icon: CalendarCheck,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined
    },
    { name: 'البرامج والرحلات السياحية', href: '/admin/trips', icon: Compass },
    { name: 'الرسائل والاستفسارات', href: '/admin/messages', icon: MessageSquare },
    { name: 'الإحصائيات والتحليلات', href: '/admin/analytics', icon: BarChart3 },
    { name: 'إعدادات المنظومة', href: '/admin/settings', icon: Settings }
  ];

  const isCurrent = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#FDFFF5] flex flex-col lg:flex-row text-[#1D2D2E] font-sans relative selection:bg-[#4CC9FE] selection:text-white">
      {/* Live Floating Booking Toast Alert */}
      {latestToast && (
        <div
          id="admin-live-toast"
          className="fixed top-5 left-5 z-50 max-w-sm w-full bg-[#FFD95A] text-[#1D2D2E] p-4 rounded-2xl shadow-[6px_6px_0px_#1D2D2E] border-[3px] border-[#1D2D2E] flex items-start gap-3 animate-in slide-in-from-top duration-300"
        >
          <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#1D2D2E] text-[#FF7E47] flex items-center justify-center shrink-0 mt-0.5 shadow-[2px_2px_0px_#1D2D2E]">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs uppercase tracking-wider bg-white px-2 py-0.5 rounded-md border border-[#1D2D2E]">حجز سياحي جديد!</span>
              <button
                onClick={() => setLatestToast(null)}
                className="p-1 text-[#1D2D2E] hover:bg-black/10 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs font-bold mt-1.5 text-[#1D2D2E] leading-relaxed">
              {latestToast.message}
            </p>
            <Link
              href="/admin/bookings"
              onClick={() => setLatestToast(null)}
              className="inline-block mt-2 text-xs font-black underline hover:text-[#FF7E47]"
            >
              عرض وتأكيد الحجز الآن ↗
            </Link>
          </div>
        </div>
      )}

      {/* Sidebar Desktop */}
      <aside
        id="admin-sidebar"
        className="hidden lg:flex w-72 bg-white border-l-[3px] border-[#1D2D2E] flex-col justify-between shrink-0 p-5 z-20 sticky top-0 h-screen max-h-screen overflow-y-auto overflow-x-hidden shadow-[4px_0px_0px_#1D2D2E]"
      >
        <div className="space-y-4">
          {/* Admin Brand & Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#1D2D2E]/15">
            <Link href="/admin" className="flex items-center gap-2 group">
              <SamaLogo size="xs" variant="emblem" />
              <div>
                <span className="text-sm font-black text-[#1D2D2E] block leading-tight">سما البارقة</span>
                <span className="text-[10px] text-[#FF7E47] font-black uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] border border-[#1D2D2E]"></span>
                  لوحة الإدارة المركزية
                </span>
              </div>
            </Link>
          </div>

          {/* Prominent Manager Profile Badge Card in Sidebar */}
          <Link
            href="/admin/settings"
            className="block p-3 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] hover:bg-[#FFD95A]/20 transition-colors group cursor-pointer"
            title="تعديل بيانات وحساب المدير"
          >
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#FFD95A] border-2 border-[#1D2D2E] flex items-center justify-center font-black text-sm text-[#1D2D2E] shadow-[1px_1px_0px_#1D2D2E]">
                  {adminUser?.name ? adminUser.name.charAt(0) : 'م'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#10B981] border-2 border-white shadow-xs"></span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-black text-[#1D2D2E] truncate group-hover:text-[#FF7E47] transition-colors">
                    {adminUser?.name || 'مدير المنظومة'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-gray-500 font-bold truncate">
                    @{adminUser?.username || 'admin'}
                  </span>
                  <span className="text-[9px] font-black bg-[#A5F3CF] text-[#1D2D2E] px-1.5 py-0.2 rounded border border-[#1D2D2E]">
                    المدير
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Quick Action Button */}
          <Link
            href="/admin/trips/new"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FF7E47] hover:bg-[#ff6b2f] text-white border-2 border-[#1D2D2E] text-xs font-black transition-all shadow-[3px_3px_0px_#1D2D2E] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#1D2D2E] group"
          >
            <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span>إضافة رحلة جديدة</span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const active = isCurrent(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  id={`admin-nav-${item.href.replace('/admin', '') || 'dash'}`}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                    active
                      ? 'bg-[#FFD95A] text-[#1D2D2E] border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] font-black'
                      : 'bg-white/60 hover:bg-white text-[#1D2D2E] border-transparent hover:border-[#1D2D2E]/20 hover:shadow-[2px_2px_0px_#1D2D2E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black border border-[#1D2D2E] ${
                        active ? 'bg-white text-[#1D2D2E]' : 'bg-[#FF7E47] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Session Info & Actions */}
        <div className="space-y-2 pt-4 mt-6 border-t-2 border-[#1D2D2E]/15">
          <div className="space-y-1.5">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#1D2D2E] bg-white border border-[#1D2D2E]/20 hover:border-[#1D2D2E] hover:shadow-[2px_2px_0px_#1D2D2E] transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FF7E47]" />
              <span>معاينة الموقع العام</span>
            </Link>

            <button
              id="admin-logout-btn"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Right Column: Topbar + Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Global Topbar */}
        <header className="hidden lg:flex bg-white border-b-[3px] border-[#1D2D2E] px-6 py-3 sticky top-0 z-20 shadow-[0px_3px_0px_#1D2D2E] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black bg-[#FDFFF5] text-[#1D2D2E] px-3 py-1.5 rounded-xl border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
              سما البارقة للسياحة والسفر 🌟
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500">
              <span>لوحة الإدارة</span>
              <span>/</span>
              <span className="text-[#1D2D2E] font-black">
                {menuItems.find((m) => isCurrent(m.href))?.name || 'لوحة التحكم'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border-2 border-[#1D2D2E] text-xs transition-transform active:translate-y-0.5 cursor-pointer ${
                soundEnabled
                  ? 'bg-[#A5F3CF] text-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]'
                  : 'bg-[#F3F4F6] text-gray-400'
              }`}
              title={soundEnabled ? 'صوت التنبيهات مفعّل' : 'صوت التنبيهات مكتوم'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Notifications Toggle */}
            <div className="relative">
              <button
                id="btn-admin-topbar-notifications"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl bg-white border-2 border-[#1D2D2E] text-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] hover:bg-[#FFD95A] transition-colors cursor-pointer"
                title="الإشعارات"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF7E47] text-white font-black text-[10px] flex items-center justify-center border-2 border-[#1D2D2E]">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {notificationsOpen && (
                <div className="absolute left-0 top-12 w-80 bg-white border-[3px] border-[#1D2D2E] rounded-2xl shadow-[6px_6px_0px_#1D2D2E] p-4 z-50 text-xs animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-[#1D2D2E]/15">
                    <span className="font-black text-[#1D2D2E] flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-[#FF7E47]" />
                      الإشعارات الواردة
                    </span>
                    {unreadNotifsCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-bold text-[#FF7E47] hover:underline cursor-pointer"
                      >
                        تعليم الكل كمقروء
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-[#1D2D2E]/10 my-2">
                    {notifications.length === 0 ? (
                      <p className="py-6 text-center text-gray-500 font-bold">لا توجد إشعارات جديدة</p>
                    ) : (
                      notifications.slice(0, 8).map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl transition-colors ${
                            !n.isRead ? 'bg-[#FFD95A]/30 border border-[#1D2D2E]/20 text-[#1D2D2E]' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#1D2D2E]">{n.title}</span>
                            {!n.isRead && (
                              <span className="w-2.5 h-2.5 rounded-full bg-[#FF7E47] border border-[#1D2D2E]"></span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#1D2D2E]/80 mt-1 leading-relaxed">
                            {n.message}
                          </p>
                          <div className="flex items-center justify-between mt-2 text-[10px] text-gray-500 font-mono">
                            <span>{new Date(n.createdAt).toLocaleTimeString('ar-IQ')}</span>
                            {n.bookingId && (
                              <Link
                                href="/admin/bookings"
                                onClick={() => setNotificationsOpen(false)}
                                className="text-[#FF7E47] font-bold hover:underline"
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

            {/* Prominent Manager Name & Badge on Desktop Bar */}
            <Link
              href="/admin/settings"
              id="admin-topbar-profile"
              className="flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-[#FDFFF5] hover:bg-[#FFD95A]/20 border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] transition-all group cursor-pointer"
              title="إعدادات الحساب وبيانات المدير"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-[#FFD95A] border-2 border-[#1D2D2E] flex items-center justify-center font-black text-xs text-[#1D2D2E] group-hover:scale-105 transition-transform">
                  {adminUser?.name ? adminUser.name.charAt(0) : 'م'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#10B981] border border-[#1D2D2E]"></span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-[#1D2D2E] group-hover:text-[#FF7E47] transition-colors leading-tight">
                    {adminUser?.name || 'مدير عام سما البارقة'}
                  </span>
                  <span className="text-[9px] font-black bg-[#A5F3CF] text-[#1D2D2E] px-1.5 py-0.2 rounded border border-[#1D2D2E]">
                    المدير
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 font-bold block leading-none mt-0.5">
                  @{adminUser?.username || 'admin'} • جلسة نشطة
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Mobile Topbar */}
        <div className="lg:hidden bg-white p-3 border-b-[3px] border-[#1D2D2E] flex items-center justify-between sticky top-0 z-30 shadow-[0px_3px_0px_#1D2D2E]">
          <div className="flex items-center gap-2">
            <SamaLogo size="xs" variant="emblem" />
            <div>
              <span className="text-xs font-black text-[#1D2D2E] block leading-tight">سما البارقة</span>
              <span className="text-[10px] text-[#FF7E47] font-bold">لوحة التحكم</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Manager Name on Mobile Bar */}
            <Link
              href="/admin/settings"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]"
            >
              <div className="w-6 h-6 rounded-md bg-[#FFD95A] border border-[#1D2D2E] flex items-center justify-center font-black text-[10px] text-[#1D2D2E]">
                {adminUser?.name ? adminUser.name.charAt(0) : 'م'}
              </div>
              <div className="text-right">
                <span className="text-[11px] font-black text-[#1D2D2E] block leading-none max-w-[90px] truncate">
                  {adminUser?.name || 'المدير'}
                </span>
                <span className="text-[9px] text-[#10B981] font-black block leading-none mt-0.5">
                  ● متصل
                </span>
              </div>
            </Link>

            {unreadNotifsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FF7E47] text-white border border-[#1D2D2E]">
                {unreadNotifsCount}
              </span>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white border-2 border-[#1D2D2E] text-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b-[3px] border-[#1D2D2E] p-4 space-y-2 z-30 max-h-[calc(100vh-75px)] overflow-y-auto animate-in slide-in-from-top shadow-[0px_4px_0px_#1D2D2E]">
            {/* Manager Box in Mobile Drawer */}
            <div className="p-3 bg-[#FDFFF5] rounded-xl border-2 border-[#1D2D2E] mb-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFD95A] border-2 border-[#1D2D2E] flex items-center justify-center font-black text-xs text-[#1D2D2E]">
                {adminUser?.name ? adminUser.name.charAt(0) : 'م'}
              </div>
              <div>
                <span className="text-xs font-black text-[#1D2D2E] block">
                  {adminUser?.name || 'مدير عام سما البارقة'}
                </span>
                <span className="text-[10px] text-gray-500 font-bold block">
                  @{adminUser?.username || 'admin'} • حساب المدير العام
                </span>
              </div>
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isCurrent(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold border-2 ${
                    active ? 'bg-[#FFD95A] text-[#1D2D2E] border-[#1D2D2E] font-black shadow-[2px_2px_0px_#1D2D2E]' : 'bg-[#FDFFF5] border-transparent text-[#1D2D2E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#FF7E47] text-white font-bold border border-[#1D2D2E]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-[#1D2D2E]/20 flex justify-between items-center text-xs">
              <Link href="/" target="_blank" className="text-[#1D2D2E] font-black p-2">
                معاينة الموقع العام ↗
              </Link>
              <button onClick={handleLogout} className="text-rose-600 font-bold p-2 cursor-pointer">
                تسجيل الخروج
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
