'use client';

import { useState, useEffect, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Booking, BookingStatus, Trip } from '@/lib/db';
import {
  CalendarCheck,
  Search,
  Filter,
  MessageSquare,
  Eye,
  Trash2,
  Printer,
  Edit,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Calendar,
  Users,
  Download,
  Plus,
  Clock,
  History,
  Send,
  X
} from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<Booking | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Manual booking modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBookingData, setNewBookingData] = useState({
    tripId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    travelerCount: 1,
    preferredContactMethod: 'phone' as 'phone' | 'whatsapp' | 'email',
    notes: ''
  });
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);
  const [newBookingError, setNewBookingError] = useState('');

  const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sama_admin_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}`, 'x-admin-token': token } : {})
    };
  };

  const fetchBookingsAndTrips = async () => {
    try {
      const [bRes, tRes] = await Promise.all([
        fetch('/api/admin/bookings', { headers: getHeaders() }),
        fetch('/api/admin/trips', { headers: getHeaders() })
      ]);
      const bData = await bRes.json();
      const tData = await tRes.json();
      if (bData.success) {
        setBookings(bData.bookings || []);
      }
      if (tData.success) {
        setTrips(tData.trips || []);
        if (tData.trips?.length > 0 && !newBookingData.tripId) {
          setNewBookingData((prev) => ({ ...prev, tripId: tData.trips[0].id }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingsAndTrips();
  }, []);

  const handleStatusUpdate = async (id: string, status: BookingStatus, noteText?: string) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          status,
          note: noteText || statusNote || undefined,
          changedBy: 'مدير النظام'
        })
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? data.booking : b))
        );
        if (selectedBookingForModal && selectedBookingForModal.id === id) {
          setSelectedBookingForModal(data.booking);
        }
        setStatusNote('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف الحجز (${id})؟ سيتم إعادة المقاعد إلى الرحلة.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        setSelectedBookingForModal(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewBookingError('');
    setIsSubmittingNew(true);

    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newBookingData)
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setBookings((prev) => [data.booking, ...prev]);
        setIsAddModalOpen(false);
        setNewBookingData({
          tripId: trips[0]?.id || '',
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          travelerCount: 1,
          preferredContactMethod: 'phone',
          notes: ''
        });
      } else {
        setNewBookingError(data.error || 'تعذر إنشاء الحجز.');
      }
    } catch (err: any) {
      setNewBookingError(err.message || 'حدث خطأ في الاتصال بالسيرفر.');
    } finally {
      setIsSubmittingNew(false);
    }
  };

  const statusFilters = ['الكل', 'جديد', 'قيد المراجعة', 'تم التواصل مع العميل', 'مؤكد', 'مكتمل', 'ملغي'];

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (selectedStatusFilter !== 'الكل' && b.status !== selectedStatusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = b.id.toLowerCase().includes(q);
        const matchName = b.customerName.toLowerCase().includes(q);
        const matchPhone = b.customerPhone.includes(q);
        const matchTrip = b.tripTitle.toLowerCase().includes(q);
        const matchDest = b.destination.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchPhone && !matchTrip && !matchDest) return false;
      }
      return true;
    });
  }, [bookings, selectedStatusFilter, searchQuery]);

  const getStatusStyle = (status: BookingStatus) => {
    switch (status) {
      case 'جديد':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'قيد المراجعة':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'تم التواصل مع العميل':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'مؤكد':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'مكتمل':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'ملغي':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">إدارة الحجوزات</h1>
            <p className="text-xs text-slate-400 mt-1">
              متابعة جميع طلبات حجز الرحلات، سجل التغييرات الكامل، والتواصل الفوري مع المسافرين.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-add-manual-booking"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حجز يدوي (مكتبي / هاتف)</span>
            </button>
            <span className="text-xs text-slate-400 font-bold bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800">
              إجمالي: <strong className="text-amber-400">{bookings.length}</strong>
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="admin-bookings-search"
              type="text"
              placeholder="البحث برقم الحجز، اسم المسافر، رقم الهاتف، أو الوجهة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {statusFilters.map((st) => (
              <button
                key={st}
                id={`filter-status-${st}`}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedStatusFilter === st
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                {st}
                {st !== 'الكل' && (
                  <span className="mr-1.5 opacity-70">
                    ({bookings.filter((b) => b.status === st).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-slate-500 text-xs">جاري تحميل بيانات الحجوزات...</div>
          ) : filteredBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-bold">
                  <tr>
                    <th className="py-3.5 px-4">رقم الحجز</th>
                    <th className="py-3.5 px-4">العميل</th>
                    <th className="py-3.5 px-4">الرحلة والوجهة</th>
                    <th className="py-3.5 px-4">المسافرين</th>
                    <th className="py-3.5 px-4">المبلغ</th>
                    <th className="py-3.5 px-4">تاريخ الطلب</th>
                    <th className="py-3.5 px-4">الحالة</th>
                    <th className="py-3.5 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {filteredBookings.map((booking) => {
                    const cleanPhone = booking.customerPhone.replace(/\D/g, '');
                    const waText = encodeURIComponent(
                      `مرحباً ${booking.customerName}، بخصوص حجزكم برقم [${booking.id}] لرحلة (${booking.tripTitle}) عبر شركة سما البارقة للسياحة...`
                    );
                    const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`;

                    return (
                      <tr key={booking.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-amber-400">
                          {booking.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{booking.customerName}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5" dir="ltr">
                            <span>{booking.customerPhone}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-medium text-slate-100 truncate">{booking.tripTitle}</div>
                          <div className="text-[11px] text-amber-400/80 mt-0.5">
                            📍 {booking.destination} {booking.tripDate ? `• 📅 ${booking.tripDate}` : ''}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold">
                          {booking.travelerCount} مسافر
                        </td>
                        <td className="py-3 px-4 font-black text-amber-300">
                          {(booking.totalPrice || 0).toLocaleString()} {booking.currency || 'د.ع'}
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-400">
                          {new Date(booking.createdAt).toLocaleDateString('ar-IQ')}
                          <span className="block text-[10px] text-slate-500">
                            {new Date(booking.createdAt).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusStyle(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* WhatsApp Button */}
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 transition-colors"
                              title="مراسلة العميل واتساب"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>

                            {/* View & Audit Modal */}
                            <button
                              onClick={() => {
                                setSelectedBookingForModal(booking);
                                setStatusNote('');
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                              title="عرض التفاصيل وسجل الحجز"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(booking.id)}
                              className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition-colors cursor-pointer"
                              title="حذف الحجز"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center space-y-2">
              <CalendarCheck className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">لا توجد حجوزات مطابقة للفلاتر المحددة.</p>
            </div>
          )}
        </div>

        {/* Detailed Modal & Status History Audit View */}
        {selectedBookingForModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedBookingForModal(null)}
          >
            <div
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-white space-y-6 animate-in zoom-in-95 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                    سند حجز رحلة سياحية معتمد
                  </span>
                  <h3 className="text-lg font-black">{selectedBookingForModal.id}</h3>
                </div>
                <button
                  onClick={() => setSelectedBookingForModal(null)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Booking Info Grid */}
              <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400">اسم العميل:</span>
                    <span className="font-bold">{selectedBookingForModal.customerName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400">رقم الهاتف:</span>
                    <span className="font-mono font-bold" dir="ltr">{selectedBookingForModal.customerPhone}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400">الرحلة:</span>
                    <span className="font-bold text-amber-400">{selectedBookingForModal.tripTitle}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400">الوجهة:</span>
                    <span>{selectedBookingForModal.destination}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400">تاريخ الانطلاق:</span>
                    <span>{selectedBookingForModal.tripDate}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-2">
                    <span className="text-slate-400">عدد المسافرين:</span>
                    <span className="font-bold">{selectedBookingForModal.travelerCount} مسافر</span>
                  </div>
                </div>

                {selectedBookingForModal.notes && (
                  <div className="pt-2 border-t border-slate-850">
                    <span className="text-slate-400 block mb-1 font-bold">ملاحظات الحجز:</span>
                    <p className="bg-slate-900 p-2.5 rounded-xl text-slate-300 leading-relaxed">
                      {selectedBookingForModal.notes}
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
                  <span>المبلغ الإجمالي المستحق:</span>
                  <span className="text-amber-400 font-black text-base">
                    {(selectedBookingForModal.totalPrice || 0).toLocaleString()} {selectedBookingForModal.currency || 'د.ع'}
                  </span>
                </div>
              </div>

              {/* Status History Trail */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <History className="w-4 h-4 text-amber-400" />
                  <span>سجل تغييرات وتتبع الحالة (Audit Log):</span>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  {selectedBookingForModal.statusHistory && selectedBookingForModal.statusHistory.length > 0 ? (
                    selectedBookingForModal.statusHistory.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-[11px] pb-2 border-b border-slate-900 last:border-none last:pb-0">
                        <div className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-200">الحالة: {item.status}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(item.changedAt).toLocaleString('ar-IQ')}
                            </span>
                          </div>
                          {item.note && <p className="text-slate-400 text-[10px] mt-0.5">{item.note}</p>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-slate-500 text-center py-2">لا يوجد سجل سابق</p>
                  )}
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">تحديث حالة الحجز:</label>
                  <span className="text-[10px] text-slate-400">الحالة الحالية: <strong className="text-amber-400">{selectedBookingForModal.status}</strong></span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {statusFilters.filter(s => s !== 'الكل').map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusUpdate(selectedBookingForModal.id, st as BookingStatus)}
                      className={`p-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                        selectedBookingForModal.status === st
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-md'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="ملاحظة مخصصة مع التغيير (مثلاً: تم استلام الدفعة الأولى نقدياً)"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>طباعة سند الحجز والمعلومات</span>
                </button>
                <button
                  onClick={() => setSelectedBookingForModal(null)}
                  className="py-3 px-6 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer border border-slate-800"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add Manual Walk-in Booking */}
        {isAddModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto"
            onClick={() => setIsAddModalOpen(false)}
          >
            <div
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-white space-y-5 animate-in zoom-in-95 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black">إضافة حجز يدوي مباشر</h3>
                    <p className="text-[11px] text-slate-400">تسجيل حجز لعميل حضر للفرع أو تواصل هاتفياً</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {newBookingError && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{newBookingError}</span>
                </div>
              )}

              <form onSubmit={handleCreateManualBooking} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">اختر الرحلة السياحية *</label>
                  <select
                    value={newBookingData.tripId}
                    onChange={(e) => setNewBookingData({ ...newBookingData, tripId: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    {trips.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} — ({t.price.toLocaleString()} {t.currency || 'د.ع'}) [{t.maxSeats - t.bookedSeats} مقعد متاح]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">اسم العميل الثلاثي *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: حيدر كريم جاسم"
                      value={newBookingData.customerName}
                      onChange={(e) => setNewBookingData({ ...newBookingData, customerName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">رقم الهاتف *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0770xxxxxxx"
                      value={newBookingData.customerPhone}
                      onChange={(e) => setNewBookingData({ ...newBookingData, customerPhone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-400"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">عدد المسافرين *</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      required
                      value={newBookingData.travelerCount}
                      onChange={(e) => setNewBookingData({ ...newBookingData, travelerCount: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">طريقة التواصل</label>
                    <select
                      value={newBookingData.preferredContactMethod}
                      onChange={(e) => setNewBookingData({ ...newBookingData, preferredContactMethod: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-400"
                    >
                      <option value="phone">اتصال هاتفي</option>
                      <option value="whatsapp">واتساب</option>
                      <option value="email">بريد إلكتروني</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">ملاحظات إضافية (الدفع، متطلبات المقاعد، إلخ)</label>
                  <textarea
                    rows={2}
                    placeholder="تم استلام المبلغ نقداً في مقر الفرع بكربلاء..."
                    value={newBookingData.notes}
                    onChange={(e) => setNewBookingData({ ...newBookingData, notes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-amber-400 resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={isSubmittingNew}
                    className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    {isSubmittingNew ? 'جاري حفظ الحجز...' : 'تأكيد وإدخال الحجز'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="py-3 px-5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
