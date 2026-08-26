'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Trip } from '@/lib/db';
import {
  Compass,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  ExternalLink,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Layers,
  Image as ImageIcon,
  Tag
} from 'lucide-react';

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDestination, setFilterDestination] = useState('ALL');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadTrips() {
      try {
        const res = await fetch('/api/trips?all=true').catch(() => null);
        if (!res || !res.ok) {
          if (!ignore) setLoading(false);
          return;
        }
        const data = await res.json().catch(() => null);
        if (!ignore && data?.success) {
          setTrips(data.trips || []);
        }
      } catch {
        // Safe fallback
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadTrips();
    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/trips/${id}`, { method: 'DELETE' }).catch(() => null);
      if (!res || !res.ok) return;
      const data = await res.json().catch(() => null);
      if (data?.success) {
        setTrips((prev) => prev.filter((t) => t.id !== id));
        setDeleteConfirmId(null);
      }
    } catch {
      // Safe fallback
    }
  };

  const toggleStatus = async (trip: Trip) => {
    const updatedStatus = !trip.isActive;
    try {
      const res = await fetch(`/api/trips/${trip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: updatedStatus })
      }).catch(() => null);
      if (!res || !res.ok) return;
      const data = await res.json().catch(() => null);
      if (data?.success) {
        setTrips((prev) =>
          prev.map((t) => (t.id === trip.id ? { ...t, isActive: updatedStatus } : t))
        );
      }
    } catch {
      // Safe fallback
    }
  };

  const uniqueDestinations = Array.from(new Set(trips.map((t) => t.destination))).filter(Boolean);

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDest = filterDestination === 'ALL' || trip.destination === filterDestination;
    return matchesSearch && matchesDest;
  });

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFD95A] p-6 rounded-3xl border-[3px] border-[#1D2D2E] shadow-[5px_5px_0px_#1D2D2E]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-white border-2 border-[#1D2D2E] text-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                إدارة المحتوى السياحي
              </span>
              <span className="text-xs font-black text-[#1D2D2E]">إجمالي {trips.length} برنامج سياحي</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1D2D2E] mt-2">
              البرامج والرحلات السياحية
            </h1>
            <p className="text-xs font-bold text-[#1D2D2E]/80 mt-0.5">
              إنشاء البرامج السياحية، إضافة الصور وتعديل الأسعار والمقاعد المتاحة.
            </p>
          </div>

          <Link
            id="btn-add-trip-page"
            href="/admin/trips/new"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FF7E47] hover:bg-[#ff6c2f] text-white border-2 border-[#1D2D2E] font-black text-xs shadow-[3px_3px_0px_#1D2D2E] active:translate-y-0.5 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة رحلة جديدة</span>
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <input
              type="text"
              placeholder="ابحث عن رحلة بالاسم، المدينة، أو الكلمات المفتاحية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pr-11 rounded-2xl bg-white border-[3px] border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] focus:outline-none focus:ring-2 focus:ring-[#FF7E47] placeholder:text-[#1D2D2E]/50"
            />
            <Search className="w-4 h-4 text-[#1D2D2E]/60 absolute right-4 top-3.5" />
          </div>

          <select
            value={filterDestination}
            onChange={(e) => setFilterDestination(e.target.value)}
            className="px-4 py-3 rounded-2xl bg-white border-[3px] border-[#1D2D2E] text-xs font-black text-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] focus:outline-none focus:ring-2 focus:ring-[#FF7E47] cursor-pointer"
          >
            <option value="ALL">جميع الوجهات ({trips.length})</option>
            {uniqueDestinations.map((dest) => (
              <option key={dest} value={dest}>
                {dest}
              </option>
            ))}
          </select>
        </div>

        {/* Trips Grid */}
        {loading ? (
          <div className="p-16 text-center text-xs font-bold text-[#1D2D2E] flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-[#FF7E47] border-t-transparent rounded-full animate-spin"></div>
            <span>جاري تحميل قائمة الرحلات...</span>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border-[3px] border-[#1D2D2E] space-y-3 shadow-[5px_5px_0px_#1D2D2E]">
            <Compass className="w-10 h-10 text-[#FF7E47] mx-auto" />
            <p className="text-sm font-black text-[#1D2D2E]">لا توجد رحلات مطابقة لبحثك</p>
            <Link
              href="/admin/trips/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD95A] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-[#1D2D2E] font-black text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة رحلة جديدة الآن</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => {
              const imageCount = (trip.images?.length || 0) + (trip.mainImage ? 1 : 0);
              const occupancy = trip.maxSeats > 0 ? Math.round(((trip.bookedSeats || 0) / trip.maxSeats) * 100) : 0;

              return (
                <div
                  key={trip.id}
                  className="bg-white border-[3px] border-[#1D2D2E] rounded-3xl overflow-hidden flex flex-col justify-between shadow-[5px_5px_0px_#1D2D2E] hover:translate-x-0.5 hover:translate-y-0.5 transition-all group"
                >
                  <div>
                    {/* Thumbnail Cover */}
                    <div className="relative aspect-video w-full bg-[#FDFFF5] overflow-hidden border-b-[3px] border-[#1D2D2E]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={trip.mainImage || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600'}
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>

                      {/* Top Badges */}
                      <div className="absolute top-3 right-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 rounded-xl bg-white text-[11px] font-black text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#FF7E47]" />
                          <span>{trip.destination}</span>
                        </span>
                        {trip.isOffer && (
                          <span className="px-2.5 py-1 rounded-xl bg-[#FF7E47] text-white text-[11px] font-black border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                            {trip.offerBadge || 'عرض خاص'}
                          </span>
                        )}
                      </div>

                      {/* Gallery count & Status */}
                      <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-[11px]">
                        <span className="px-2 py-0.5 rounded-lg bg-white/90 text-[#1D2D2E] border border-[#1D2D2E] flex items-center gap-1 font-black">
                          <ImageIcon className="w-3 h-3 text-[#FF7E47]" />
                          <span>{imageCount} صور</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleStatus(trip)}
                          className={`px-2.5 py-0.5 rounded-lg font-black transition-colors cursor-pointer text-[10px] border border-[#1D2D2E] ${
                            trip.isActive
                              ? 'bg-[#A5F3CF] text-[#1D2D2E]'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {trip.isActive ? '✓ نشطة بالموقع' : 'مخفية'}
                        </button>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 space-y-3">
                      <h3 className="text-base font-black text-[#1D2D2E] line-clamp-1 group-hover:text-[#FF7E47] transition-colors">
                        {trip.title}
                      </h3>
                      <p className="text-xs font-bold text-[#1D2D2E]/70 line-clamp-2 leading-relaxed">
                        {trip.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-3 border-t-2 border-[#1D2D2E]/10 text-xs">
                        <div>
                          <span className="text-[10px] text-gray-500 font-bold block">السعر للفرد:</span>
                          <span className="font-black text-[#FF7E47] font-mono text-sm">
                            {trip.price.toLocaleString()} {trip.currency}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 font-bold block">المدة:</span>
                          <span className="font-black text-[#1D2D2E]">{trip.duration}</span>
                        </div>
                      </div>

                      {/* Seat Occupancy Progress Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[11px] font-black text-[#1D2D2E]/80">
                          <span>المقاعد المحجوزة</span>
                          <span className="font-mono text-[#1D2D2E]">
                            {trip.bookedSeats || 0} / {trip.maxSeats} ({occupancy}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 border border-[#1D2D2E] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              occupancy >= 90
                                ? 'bg-rose-500'
                                : occupancy >= 60
                                ? 'bg-[#FFD95A]'
                                : 'bg-[#A5F3CF]'
                            }`}
                            style={{ width: `${Math.min(occupancy, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 bg-[#FDFFF5] border-t-2 border-[#1D2D2E] flex items-center justify-between gap-2">
                    <Link
                      href={`/trips/${trip.slug || trip.id}`}
                      target="_blank"
                      className="p-2 rounded-xl bg-white hover:bg-[#FFD95A] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-xs font-bold flex items-center gap-1 transition-all"
                      title="معاينة في الموقع"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/trips/${trip.id}/edit`}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FFD95A] hover:bg-[#fcd34d] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] font-black text-xs flex items-center gap-1.5 transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل والصور</span>
                      </Link>

                      {deleteConfirmId === trip.id ? (
                        <div className="flex items-center gap-1 bg-rose-100 p-1 rounded-xl border-2 border-rose-600 animate-in fade-in">
                          <button
                            type="button"
                            onClick={() => handleDelete(trip.id)}
                            className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-lg cursor-pointer"
                          >
                            تأكيد الحذف
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 text-gray-700 text-[10px] font-bold hover:text-black cursor-pointer"
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(trip.id)}
                          className="p-2 rounded-xl bg-rose-50 text-rose-700 border-2 border-rose-300 hover:bg-rose-100 text-xs transition-colors cursor-pointer"
                          title="حذف الرحلة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
