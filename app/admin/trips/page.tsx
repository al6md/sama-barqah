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
        const res = await fetch('/api/trips?all=true');
        const data = await res.json();
        if (!ignore && data.success) {
          setTrips(data.trips || []);
        }
      } catch (e) {
        console.error(e);
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
      const res = await fetch(`/api/trips/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTrips((prev) => prev.filter((t) => t.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleStatus = async (trip: Trip) => {
    const updatedStatus = !trip.isActive;
    try {
      const res = await fetch(`/api/trips/${trip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: updatedStatus })
      });
      const data = await res.json();
      if (data.success) {
        setTrips((prev) =>
          prev.map((t) => (t.id === trip.id ? { ...t, isActive: updatedStatus } : t))
        );
      }
    } catch (e) {
      console.error(e);
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800/80 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                إدارة المحتوى السياحي
              </span>
              <span className="text-xs text-slate-500">إجمالي {trips.length} برنامج سياحي</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5">
              البرامج والرحلات السياحية
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              إنشاء البرامج السياحية، إضافة الصور وتعديل الأسعار والمقاعد المتاحة.
            </p>
          </div>

          <Link
            id="btn-add-trip-page"
            href="/admin/trips/new"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
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
              className="w-full px-4 py-3 pr-11 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-600"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
          </div>

          <select
            value={filterDestination}
            onChange={(e) => setFilterDestination(e.target.value)}
            className="px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
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
          <div className="p-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            <span>جاري تحميل قائمة الرحلات...</span>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="p-12 text-center bg-slate-950 rounded-3xl border border-slate-800 space-y-3">
            <Compass className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">لا توجد رحلات مطابقة لبحثك</p>
            <Link
              href="/admin/trips/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة رحلة جديدة الآن</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTrips.map((trip) => {
              const imageCount = (trip.images?.length || 0) + (trip.mainImage ? 1 : 0);
              const occupancy = trip.maxSeats > 0 ? Math.round(((trip.bookedSeats || 0) / trip.maxSeats) * 100) : 0;

              return (
                <div
                  key={trip.id}
                  className="bg-slate-950 border border-slate-800/80 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl hover:border-amber-400/50 transition-all group"
                >
                  <div>
                    {/* Thumbnail Cover */}
                    <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={trip.mainImage || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600'}
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40"></div>

                      {/* Top Badges */}
                      <div className="absolute top-3 right-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-400/30 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{trip.destination}</span>
                        </span>
                        {trip.isOffer && (
                          <span className="px-2.5 py-1 rounded-xl bg-rose-600/90 text-white text-[10px] font-black shadow-md">
                            {trip.offerBadge || 'عرض خاص'}
                          </span>
                        )}
                      </div>

                      {/* Gallery count & Status */}
                      <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-[11px]">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-950/80 text-slate-300 flex items-center gap-1 font-bold">
                          <ImageIcon className="w-3 h-3 text-amber-400" />
                          <span>{imageCount} صور</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleStatus(trip)}
                          className={`px-2.5 py-0.5 rounded-lg font-bold transition-colors cursor-pointer text-[10px] ${
                            trip.isActive
                              ? 'bg-emerald-500/90 text-slate-950'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {trip.isActive ? '✓ نشطة بالموقع' : 'مخفية'}
                        </button>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 space-y-3">
                      <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
                        {trip.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {trip.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">السعر للفرد:</span>
                          <span className="font-black text-amber-400">
                            {trip.price.toLocaleString()} {trip.currency}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">المدة:</span>
                          <span className="font-bold text-slate-200">{trip.duration}</span>
                        </div>
                      </div>

                      {/* Seat Occupancy Progress Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                          <span>المقاعد المحجوزة</span>
                          <span className="text-white">
                            {trip.bookedSeats || 0} / {trip.maxSeats} ({occupancy}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              occupancy >= 90
                                ? 'bg-rose-500'
                                : occupancy >= 60
                                ? 'bg-amber-400'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(occupancy, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <Link
                      href={`/trips/${trip.slug || trip.id}`}
                      target="_blank"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 transition-colors"
                      title="معاينة في الموقع"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/trips/${trip.id}/edit`}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل والصور</span>
                      </Link>

                      {deleteConfirmId === trip.id ? (
                        <div className="flex items-center gap-1 bg-rose-950 p-1 rounded-xl border border-rose-800 animate-in fade-in">
                          <button
                            type="button"
                            onClick={() => handleDelete(trip.id)}
                            className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black rounded-lg cursor-pointer"
                          >
                            تأكيد الحذف
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 text-slate-400 text-[10px] hover:text-white cursor-pointer"
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(trip.id)}
                          className="p-2 rounded-xl bg-rose-950/40 text-rose-400 hover:bg-rose-950 hover:text-rose-300 text-xs transition-colors cursor-pointer"
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
