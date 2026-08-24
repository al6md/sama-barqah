'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Booking, BookingStatus } from '@/lib/db';
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
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (!ignore && data.success) {
          setBookings(data.bookings || []);
        }
      } catch (e) {
        console.error(e);
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
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
      }
    } catch (e) {
      console.error(e);
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
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800/80 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                سجل الحجوزات والزبائن
              </span>
              <span className="text-xs text-slate-500">إجمالي {bookings.length} حجز سياحي</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5">
              إدارة الحجوزات والطلبات
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              متابعة طلبات المسافرين، تغيير حالات الدفع والتأكيد، والتواصل الفوري عبر الواتساب.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
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
              className="w-full px-4 py-3 pr-11 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-600"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            {['ALL', 'جديد', 'قيد المراجعة', 'مؤكد', 'مكتمل', 'ملغي'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'ALL' ? 'الكل' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Counter Bar */}
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              النتائج المعروضة: <strong className="text-white">{filteredBookings.length}</strong> حجز
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">إجمالي المبالغ المستحقة:</span>
            <span className="text-sm font-black text-amber-400">
              {totalFilteredSum.toLocaleString()} د.ع
            </span>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-slate-950 rounded-3xl border border-slate-800/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
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
              <tbody className="divide-y divide-slate-800/60">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
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
                      <tr key={b.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                          {b.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">{b.customerName}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(b.createdAt).toLocaleDateString('ar-IQ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300" dir="ltr">
                          {b.customerPhone}
                        </td>
                        <td className="py-3.5 px-4 text-slate-200 max-w-[200px] truncate">
                          {b.tripTitle}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-100">
                          {b.travelerCount}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-amber-400 whitespace-nowrap">
                          {b.totalPrice.toLocaleString()} {b.currency}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer focus:outline-none ${getStatusBadge(
                              b.status
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
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                              title="محادثة واتساب"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => setSelectedBooking(b)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] cursor-pointer"
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

        {/* Booking Details / Voucher Print Modal */}
        {selectedBooking && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedBooking(null)}
          >
            <div
              className="relative max-w-lg w-full rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-amber-400">سند تأكيد الحجز</span>
                  <h3 className="text-lg font-black text-white">
                    حجز رقم #{selectedBooking.id}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-3 rounded-xl bg-slate-900">
                  <span className="text-slate-400">اسم العميل:</span>
                  <strong className="text-white">{selectedBooking.customerName}</strong>
                </div>

                <div className="flex justify-between p-3 rounded-xl bg-slate-900">
                  <span className="text-slate-400">رقم الهاتف:</span>
                  <strong className="text-amber-300 font-mono" dir="ltr">
                    {selectedBooking.customerPhone}
                  </strong>
                </div>

                <div className="flex justify-between p-3 rounded-xl bg-slate-900">
                  <span className="text-slate-400">الرحلة السياحية:</span>
                  <strong className="text-white text-left max-w-[250px] truncate">
                    {selectedBooking.tripTitle}
                  </strong>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-900">
                    <span className="text-slate-400 block text-[10px]">عدد المسافرين:</span>
                    <strong className="text-white text-base">{selectedBooking.travelerCount} أشخاص</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900">
                    <span className="text-slate-400 block text-[10px]">المبلغ الإجمالي:</span>
                    <strong className="text-amber-400 text-base">
                      {selectedBooking.totalPrice.toLocaleString()} {selectedBooking.currency}
                    </strong>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="p-3 rounded-xl bg-slate-900 space-y-1">
                    <span className="text-slate-400 block text-[10px]">ملاحظات العميل:</span>
                    <p className="text-slate-200">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة السند</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
