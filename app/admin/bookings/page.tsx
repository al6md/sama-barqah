'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Booking, BookingStatus } from '@/lib/db';
import { SamaLogo } from '@/components/SamaLogo';
import { BookingVoucherModal } from '@/components/admin/BookingVoucherModal';
import {
  CalendarCheck,
  Search,
  Download,
  Filter,
  Phone,
  MessageSquare,
  Printer,
  CheckCircle,
  Clock,
  User,
  Users,
  DollarSign,
  AlertCircle,
  FileSpreadsheet,
  X
} from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const res = await fetch('/api/bookings').catch(() => null);
        if (!res || !res.ok) {
          if (!ignore) setLoading(false);
          return;
        }
        const data = await res.json().catch(() => null);
        if (!ignore && data?.success) {
          setBookings(data.bookings || []);
        }
      } catch {
        // Safe fallback
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      }).catch(() => null);
      if (!res || !res.ok) return;
      const data = await res.json().catch(() => null);
      if (data?.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
      }
    } catch {
      // Safe fallback
    }
  };

  // Export to CSV for Excel & accounting
  const exportToCSV = () => {
    if (bookings.length === 0) return;
    const headers = ['رقم الحجز', 'اسم العميل', 'رقم الهاتف', 'البريد', 'الرحلة', 'عدد المسافرين', 'المبلغ الإجمالي', 'الحالة', 'تاريخ الحجز'];
    const rows = filteredBookings.map((b) => [
      b.id,
      `"${b.customerName}"`,
      `"${b.customerPhone}"`,
      `"${b.customerEmail || ''}"`,
      `"${b.tripTitle}"`,
      b.travelerCount,
      b.totalPrice,
      b.status,
      new Date(b.createdAt).toLocaleDateString('ar-IQ')
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Sama_Barqah_Bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery) ||
      b.tripTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalFilteredSum = filteredBookings
    .filter((b) => b.status !== 'ملغي')
    .reduce((acc, b) => acc + (b.totalPrice || 0), 0);

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
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFD95A] p-6 rounded-3xl border-[3px] border-[#1D2D2E] shadow-[5px_5px_0px_#1D2D2E]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-white border-2 border-[#1D2D2E] text-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                سجل الحجوزات والزبائن
              </span>
              <span className="text-xs font-black text-[#1D2D2E]">إجمالي {bookings.length} حجز سياحي</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1D2D2E] mt-2">
              إدارة الحجوزات والطلبات
            </h1>
            <p className="text-xs font-bold text-[#1D2D2E]/80 mt-0.5">
              متابعة طلبات المسافرين، تغيير حالات الدفع والتأكيد، والتواصل الفوري عبر الواتساب.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-black text-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] active:translate-y-0.5 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>تصدير إكسل (CSV)</span>
            </button>
          </div>
        </div>

        {/* Filters & Status Bar */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ابحث برقم الحجز، اسم العميل، الهاتف، أو اسم الرحلة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pr-11 rounded-2xl bg-white border-[3px] border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] focus:outline-none focus:ring-2 focus:ring-[#FF7E47] placeholder:text-[#1D2D2E]/50"
            />
            <Search className="w-4 h-4 text-[#1D2D2E]/60 absolute right-4 top-3.5" />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-1.5 rounded-2xl border-[3px] border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E]">
            {['ALL', 'جديد', 'قيد المراجعة', 'مؤكد', 'مكتمل', 'ملغي'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border-2 ${
                  statusFilter === st
                    ? 'bg-[#FFD95A] text-[#1D2D2E] border-[#1D2D2E] font-black shadow-[2px_2px_0px_#1D2D2E]'
                    : 'border-transparent text-[#1D2D2E]/80 hover:text-[#1D2D2E]'
                }`}
              >
                {st === 'ALL' ? 'الكل' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Counter Bar */}
        <div className="bg-white p-4 rounded-2xl border-[3px] border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-[#1D2D2E]/80 font-bold">
              النتائج المعروضة: <strong className="text-[#1D2D2E] font-black font-mono">{filteredBookings.length}</strong> حجز
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#1D2D2E]/80 font-bold">إجمالي المبالغ المستحقة:</span>
            <span className="text-sm font-black text-[#FF7E47] font-mono">
              {totalFilteredSum.toLocaleString()} د.ع
            </span>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-3xl border-[3px] border-[#1D2D2E] overflow-hidden shadow-[5px_5px_0px_#1D2D2E]">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FDFFF5] text-[#1D2D2E] uppercase font-black tracking-wider text-[11px] border-b-2 border-[#1D2D2E]">
                <tr>
                  <th className="py-3.5 px-4">رقم الحجز</th>
                  <th className="py-3.5 px-4">العميل</th>
                  <th className="py-3.5 px-4">الهاتف</th>
                  <th className="py-3.5 px-4">البرنامج والوجهة</th>
                  <th className="py-3.5 px-4 text-center">المسافرين</th>
                  <th className="py-3.5 px-4">المبلغ</th>
                  <th className="py-3.5 px-4">حالة الحجز</th>
                  <th className="py-3.5 px-4 text-center">تواصل / تفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D2D2E]/10 font-medium">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#1D2D2E]/60 font-bold">
                      لا توجد حجوزات مطابقة
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => {
                    const cleanPhone = b.customerPhone.replace(/\D/g, '');
                    const formattedPhone = cleanPhone.startsWith('0')
                      ? `964${cleanPhone.slice(1)}`
                      : cleanPhone;
                    const waMsg = encodeURIComponent(
                      `مرحباً ${b.customerName}، شركة سما البارقة للسفر والسياحة ترحب بكم بخصوص حجز رحلة [${b.tripTitle}] برقم (${b.id}).`
                    );
                    const waUrl = `https://wa.me/${formattedPhone}?text=${waMsg}`;

                    return (
                      <tr key={b.id} className="hover:bg-[#FDFFF5]/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-black text-[#1D2D2E]">
                          #{b.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-black text-[#1D2D2E] block">{b.customerName}</span>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {new Date(b.createdAt).toLocaleDateString('ar-IQ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#1D2D2E]" dir="ltr">
                          {b.customerPhone}
                        </td>
                        <td className="py-3.5 px-4 text-[#1D2D2E] max-w-[200px] truncate font-bold">
                          {b.tripTitle}
                        </td>
                        <td className="py-3.5 px-4 text-center font-black text-[#1D2D2E] font-mono">
                          {b.travelerCount}
                        </td>
                        <td className="py-3.5 px-4 font-black text-[#1D2D2E] font-mono whitespace-nowrap">
                          {b.totalPrice.toLocaleString()} {b.currency}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                            className={`px-3 py-1 rounded-lg text-xs font-black cursor-pointer focus:outline-none ${getStatusBadge(
                              b.status
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
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-[#25D366] hover:bg-[#20b858] text-white border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] transition-all cursor-pointer"
                              title="محادثة واتساب"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => setSelectedBooking(b)}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#FDFFF5] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] font-black text-[11px] cursor-pointer"
                            >
                              التفاصيل
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Details / Official Voucher Print Modal */}
        {selectedBooking && (
          <BookingVoucherModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
}
