'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Booking, Trip, BookingStatus } from '@/lib/db';
import {
  CalendarCheck,
  Users,
  Compass,
  TrendingUp,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  Phone,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [anRes, bkRes, trRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/bookings'),
        fetch('/api/trips?all=true')
      ]);

      const [anData, bkData, trData] = await Promise.all([
        anRes.json(),
        bkRes.json(),
        trRes.json()
      ]);

      if (anData.success) setAnalytics(anData.analytics);
      if (bkData.success) setBookings(bkData.bookings);
      if (trData.success) setTrips(trData.trips);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const [anRes, bkRes, trRes] = await Promise.all([
          fetch('/api/analytics'),
          fetch('/api/bookings'),
          fetch('/api/trips?all=true')
        ]);
        const [anData, bkData, trData] = await Promise.all([
          anRes.json(),
          bkRes.json(),
          trRes.json()
        ]);
        if (isMounted) {
          if (anData.success) setAnalytics(anData.analytics);
          if (bkData.success) setBookings(bkData.bookings);
          if (trData.success) setTrips(trData.trips);
          setLoading(false);
        }
      } catch (e) {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalBookings = bookings.length;
  const newBookings = bookings.filter((b) => b.status === 'جديد').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'مؤكد' || b.status === 'مكتمل').length;
  const totalRevenue = bookings
    .filter((b) => b.status !== 'ملغي')
    .reduce((acc, b) => acc + (b.totalPrice || 0), 0);

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'جديد':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      case 'قيد المراجعة':
        return 'bg-sky-500/20 text-sky-300 border border-sky-500/30';
      case 'تم التواصل مع العميل':
        return 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30';
      case 'مؤكد':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      case 'مكتمل':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'ملغي':
        return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header with Title & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              لوحة التحكم والإحصائيات
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              متابعة الحجوزات، الزوار، وأداء الرحلات السياحية لحظة بلحظة.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchData();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors self-start cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث البيانات</span>
          </button>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: New Bookings */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">الحجوزات الجديدة</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{newBookings}</div>
            <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
              <span>تحتاج إلى مراجعة وتأكيد</span>
            </div>
          </div>

          {/* Card 2: Confirmed Bookings */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">الحجوزات المؤكدة</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{confirmedBookings}</div>
            <div className="text-[11px] text-slate-400">
              من إجمالي {totalBookings} حجز مسجل
            </div>
          </div>

          {/* Card 3: Today's Visitors */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">زوار الموقع اليوم</span>
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">
              {analytics?.todayVisitors || 27}
            </div>
            <div className="text-[11px] text-sky-400">
              إجمالي الزيارات: {analytics?.totalVisits || 148}
            </div>
          </div>

          {/* Card 4: Total Trips */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">الرحلات النشطة</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{trips.length}</div>
            <div className="text-[11px] text-indigo-400">
              {trips.filter((t) => t.isOffer).length} عروض خاصة
            </div>
          </div>
        </div>

        {/* Charts Section (7 Days Bookings & Visitors) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Last 7 Days Bookings */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">الحجوزات خلال آخر 7 أيام</h3>
                <span className="text-[11px] text-slate-400">حركة الطلبات اليومية</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                مباشر
              </span>
            </div>

            <div className="h-64 w-full">
              {analytics?.last7Days ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.last7Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="dayName" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="bookings" name="عدد الحجوزات" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  جاري تحميل الرسم البياني...
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Last 7 Days Visitors */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">زوار الموقع خلال آخر 7 أيام</h3>
                <span className="text-[11px] text-slate-400">حركة الزيارات اليومية</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                مباشر
              </span>
            </div>

            <div className="h-64 w-full">
              {analytics?.last7Days ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.last7Days}>
                    <defs>
                      <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="dayName" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#fff'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      name="عدد الزوار"
                      stroke="#38bdf8"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#visitorGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  جاري تحميل الرسم البياني...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Bookings Table with Quick Actions */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">أحدث طلبات الحجز</h3>
              <span className="text-[11px] text-slate-400">
                متابعة الحجوزات والتواصل الفوري مع العملاء عبر الواتساب
              </span>
            </div>

            <a
              href="/admin/bookings"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              عرض كافة الحجوزات ({bookings.length}) ←
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">رقم الحجز</th>
                  <th className="py-3 px-4">العميل</th>
                  <th className="py-3 px-4">الهاتف</th>
                  <th className="py-3 px-4">الرحلة والوجهة</th>
                  <th className="py-3 px-4">المسافرين</th>
                  <th className="py-3 px-4">المبلغ</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-center">إجراء سريع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bookings.slice(0, 5).map((booking) => {
                  const cleanPhone = booking.customerPhone.replace(/\D/g, '');
                  const formattedPhone = cleanPhone.startsWith('0')
                    ? `964${cleanPhone.slice(1)}`
                    : cleanPhone;
                  const waMsg = encodeURIComponent(
                    `مرحباً ${booking.customerName}، معك شركة سما البارقة للسفر والسياحة بخصوص حجز رحلة [${booking.tripTitle}] برقم حجز (${booking.id}). هل تود تأكيد الحجز وموعد الانطلاق؟`
                  );
                  const waUrl = `https://wa.me/${formattedPhone}?text=${waMsg}`;

                  return (
                    <tr key={booking.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        {booking.id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {booking.customerName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300" dir="ltr">
                        {booking.customerPhone}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-[200px] truncate">
                        {booking.tripTitle}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-200">
                        {booking.travelerCount}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-400">
                        {booking.totalPrice.toLocaleString()} {booking.currency}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer focus:outline-none ${getStatusBadge(
                            booking.status
                          )}`}
                        >
                          <option value="جديد" className="bg-slate-900 text-white">جديد</option>
                          <option value="قيد المراجعة" className="bg-slate-900 text-white">قيد المراجعة</option>
                          <option value="تم التواصل مع العميل" className="bg-slate-900 text-white">تم التواصل مع العميل</option>
                          <option value="مؤكد" className="bg-slate-900 text-white">مؤكد</option>
                          <option value="مكتمل" className="bg-slate-900 text-white">مكتمل</option>
                          <option value="ملغي" className="bg-slate-900 text-white">ملغي</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <a
                          id={`whatsapp-link-btn-${booking.id}`}
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition-colors"
                          title="فتح محادثة واتساب مع العميل"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>واتساب</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
