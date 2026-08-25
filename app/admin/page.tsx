'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  RefreshCw,
  Plus,
  DollarSign,
  Briefcase,
  ChevronRight,
  Layers
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

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    async function loadAll() {
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

        if (!ignore) {
          if (anData.success) setAnalytics(anData.analytics);
          if (bkData.success) setBookings(bkData.bookings || []);
          if (trData.success) setTrips(trData.trips || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadAll();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const totalBookings = bookings.length;
  const newBookings = bookings.filter((b) => b.status === 'جديد').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'مؤكد' || b.status === 'مكتمل').length;
  const totalRevenue = bookings
    .filter((b) => b.status !== 'ملغي')
    .reduce((acc, b) => acc + (b.totalPrice || 0), 0);

  const totalCapacity = trips.reduce((acc, t) => acc + (t.maxSeats || 0), 0);
  const totalBookedSeats = trips.reduce((acc, t) => acc + (t.bookedSeats || 0), 0);
  const occupancyPercentage = totalCapacity > 0 ? Math.round((totalBookedSeats / totalCapacity) * 100) : 0;

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
        return 'bg-[#FF7E47] text-white border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]';
      case 'قيد المراجعة':
        return 'bg-[#4CC9FE] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]';
      case 'تم التواصل مع العميل':
        return 'bg-[#FFD95A] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]';
      case 'مؤكد':
        return 'bg-[#A5F3CF] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]';
      case 'مكتمل':
        return 'bg-emerald-500 text-white border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]';
      case 'ملغي':
        return 'bg-rose-500 text-white border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]';
      default:
        return 'bg-gray-100 text-[#1D2D2E] border-2 border-[#1D2D2E]';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12">
        {/* Top Executive Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFD95A] p-6 rounded-3xl border-[3px] border-[#1D2D2E] shadow-[5px_5px_0px_#1D2D2E]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-white border-2 border-[#1D2D2E] text-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                منصة الإدارة الذكية
              </span>
              <span className="text-xs font-black text-[#1D2D2E]">شركة سما البارقة للسياحة</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1D2D2E] mt-2">
              مرحباً بك في لوحة تحكم الإدارة
            </h1>
            <p className="text-xs font-bold text-[#1D2D2E]/80 mt-1">
              متابعة الحجوزات الواردة، حركة الزيارات، وإدارة الرحلات السياحية بصورة فورية.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => {
                setLoading(true);
                setRefreshKey((prev) => prev + 1);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-black text-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] active:translate-y-0.5 cursor-pointer transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>تحديث البيانات</span>
            </button>

            <Link
              href="/admin/trips/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF7E47] hover:bg-[#ff6c2f] text-white font-black text-xs border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] active:translate-y-0.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة رحلة جديدة</span>
            </Link>
          </div>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: New Bookings */}
          <div className="p-5 rounded-2xl bg-white border-[3px] border-[#1D2D2E] space-y-2 shadow-[4px_4px_0px_#1D2D2E] relative overflow-hidden group hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#1D2D2E]/70">الحجوزات الجديدة</span>
              <div className="w-10 h-10 rounded-xl bg-[#FFD95A] border-2 border-[#1D2D2E] text-[#1D2D2E] flex items-center justify-center shadow-[2px_2px_0px_#1D2D2E]">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#1D2D2E] font-mono">{newBookings}</div>
            <div className="text-[11px] text-[#FF7E47] font-black flex items-center gap-1">
              <span>تحتاج إلى مراجعة وتأكيد</span>
            </div>
          </div>

          {/* KPI 2: Total Revenue */}
          <div className="p-5 rounded-2xl bg-white border-[3px] border-[#1D2D2E] space-y-2 shadow-[4px_4px_0px_#1D2D2E] relative overflow-hidden group hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#1D2D2E]/70">إجمالي قيمة الحجوزات</span>
              <div className="w-10 h-10 rounded-xl bg-[#A5F3CF] border-2 border-[#1D2D2E] text-[#1D2D2E] flex items-center justify-center shadow-[2px_2px_0px_#1D2D2E]">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#1D2D2E] font-mono truncate">
              {totalRevenue.toLocaleString()} <span className="text-xs text-[#1D2D2E]/80 font-bold font-sans">د.ع</span>
            </div>
            <div className="text-[11px] text-[#1D2D2E]/70 font-bold">
              من إجمالي {totalBookings} حجز مسجل
            </div>
          </div>

          {/* KPI 3: Occupancy & Seats */}
          <div className="p-5 rounded-2xl bg-white border-[3px] border-[#1D2D2E] space-y-2 shadow-[4px_4px_0px_#1D2D2E] relative overflow-hidden group hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#1D2D2E]/70">نسبة إشغال المقاعد</span>
              <div className="w-10 h-10 rounded-xl bg-[#4CC9FE] border-2 border-[#1D2D2E] text-[#1D2D2E] flex items-center justify-center shadow-[2px_2px_0px_#1D2D2E]">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#1D2D2E] font-mono">{occupancyPercentage}%</div>
            <div className="text-[11px] text-[#1D2D2E]/70 font-bold">
              محجوز {totalBookedSeats} من أصل {totalCapacity} مقعد
            </div>
          </div>

          {/* KPI 4: Active Trips */}
          <div className="p-5 rounded-2xl bg-white border-[3px] border-[#1D2D2E] space-y-2 shadow-[4px_4px_0px_#1D2D2E] relative overflow-hidden group hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#1D2D2E]/70">البرامج السياحية النشطة</span>
              <div className="w-10 h-10 rounded-xl bg-[#C4B5FD] border-2 border-[#1D2D2E] text-[#1D2D2E] flex items-center justify-center shadow-[2px_2px_0px_#1D2D2E]">
                <Compass className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#1D2D2E] font-mono">{trips.length}</div>
            <div className="text-[11px] text-[#1D2D2E]/70 font-bold">
              {trips.filter((t) => t.isOffer).length} عروض خاصة ومخفضة
            </div>
          </div>
        </div>

        {/* Visual Charts (Bookings & Visitors analytics) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Bookings per day */}
          <div className="p-6 rounded-3xl bg-white border-[3px] border-[#1D2D2E] space-y-4 shadow-[4px_4px_0px_#1D2D2E]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#1D2D2E]">حركة الحجوزات اليومية</h3>
                <span className="text-xs font-bold text-[#1D2D2E]/70">آخر 7 أيام</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FFD95A] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                مباشر
              </span>
            </div>

            <div className="h-64 w-full pt-2">
              {analytics?.last7Days ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.last7Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="dayName" stroke="#1D2D2E" fontSize={11} fontWeight={600} />
                    <YAxis stroke="#1D2D2E" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#1D2D2E',
                        borderWidth: '2px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#1D2D2E',
                        boxShadow: '3px 3px 0px #1D2D2E'
                      }}
                    />
                    <Bar dataKey="bookings" name="عدد الحجوزات" fill="#FF7E47" stroke="#1D2D2E" strokeWidth={2} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs font-bold text-[#1D2D2E]/60">
                  جاري تحميل الرسم البياني...
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Visitors */}
          <div className="p-6 rounded-3xl bg-white border-[3px] border-[#1D2D2E] space-y-4 shadow-[4px_4px_0px_#1D2D2E]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#1D2D2E]">زوار الموقع العام</h3>
                <span className="text-xs font-bold text-[#1D2D2E]/70">آخر 7 أيام</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#4CC9FE] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                مباشر
              </span>
            </div>

            <div className="h-64 w-full pt-2">
              {analytics?.last7Days ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.last7Days}>
                    <defs>
                      <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CC9FE" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#4CC9FE" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="dayName" stroke="#1D2D2E" fontSize={11} fontWeight={600} />
                    <YAxis stroke="#1D2D2E" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#1D2D2E',
                        borderWidth: '2px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#1D2D2E',
                        boxShadow: '3px 3px 0px #1D2D2E'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      name="عدد الزوار"
                      stroke="#1D2D2E"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#visitorGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs font-bold text-[#1D2D2E]/60">
                  جاري تحميل الرسم البياني...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Bookings Quick Table */}
        <div className="p-6 rounded-3xl bg-white border-[3px] border-[#1D2D2E] space-y-4 shadow-[5px_5px_0px_#1D2D2E]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#1D2D2E]/15 pb-4">
            <div>
              <h3 className="text-lg font-black text-[#1D2D2E] flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#FF7E47]" />
                <span>أحدث طلبات الحجز السياحية</span>
              </h3>
              <span className="text-xs font-bold text-[#1D2D2E]/70">
                متابعة الحجوزات والتواصل الفوري مع العملاء عبر الواتساب
              </span>
            </div>

            <Link
              href="/admin/bookings"
              className="text-xs font-black text-[#1D2D2E] hover:text-[#FF7E47] bg-[#FDFFF5] px-3 py-1.5 rounded-xl border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] transition-all flex items-center gap-1 self-start sm:self-auto"
            >
              <span>عرض كافة الحجوزات ({bookings.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FDFFF5] text-[#1D2D2E] uppercase font-black tracking-wider text-[11px] border-b-2 border-[#1D2D2E]">
                <tr>
                  <th className="py-3.5 px-4">رقم الحجز</th>
                  <th className="py-3.5 px-4">العميل</th>
                  <th className="py-3.5 px-4">الهاتف</th>
                  <th className="py-3.5 px-4">الرحلة والوجهة</th>
                  <th className="py-3.5 px-4">المسافرين</th>
                  <th className="py-3.5 px-4">المبلغ</th>
                  <th className="py-3.5 px-4">الحالة</th>
                  <th className="py-3.5 px-4 text-center">إجراء سريع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D2D2E]/10 font-medium">
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
                    <tr key={booking.id} className="hover:bg-[#FDFFF5]/80 transition-colors">
                      <td className="py-4 px-4 font-mono font-black text-[#1D2D2E]">
                        #{booking.id}
                      </td>
                      <td className="py-4 px-4 font-black text-[#1D2D2E]">
                        {booking.customerName}
                      </td>
                      <td className="py-4 px-4 font-mono text-[#1D2D2E]" dir="ltr">
                        {booking.customerPhone}
                      </td>
                      <td className="py-4 px-4 text-[#1D2D2E] max-w-[200px] truncate font-bold">
                        {booking.tripTitle}
                      </td>
                      <td className="py-4 px-4 font-black text-[#1D2D2E] font-mono">
                        {booking.travelerCount}
                      </td>
                      <td className="py-4 px-4 font-black text-[#1D2D2E] font-mono whitespace-nowrap">
                        {booking.totalPrice.toLocaleString()} {booking.currency}
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                          className={`px-3 py-1 rounded-lg text-xs font-black cursor-pointer focus:outline-none ${getStatusBadge(
                            booking.status
                          )}`}
                        >
                          <option value="جديد" className="bg-white text-[#1D2D2E]">جديد</option>
                          <option value="قيد المراجعة" className="bg-white text-[#1D2D2E]">قيد المراجعة</option>
                          <option value="تم التواصل مع العميل" className="bg-white text-[#1D2D2E]">تم التواصل مع العميل</option>
                          <option value="مؤكد" className="bg-white text-[#1D2D2E]">مؤكد</option>
                          <option value="مكتمل" className="bg-white text-[#1D2D2E]">مكتمل</option>
                          <option value="ملغي" className="bg-white text-[#1D2D2E]">ملغي</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <a
                          id={`whatsapp-link-btn-${booking.id}`}
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20b858] text-white font-black text-xs border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] transition-all active:translate-y-0.5 cursor-pointer"
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
