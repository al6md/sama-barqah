'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Trip } from '@/lib/db';
import {
  Compass,
  Plus,
  Edit,
  Trash2,
  Eye,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  RefreshCw,
  Copy,
  ExternalLink,
  Check
} from 'lucide-react';

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips?all=true');
      const data = await res.json();
      if (data.success) {
        setTrips(data.trips);
      }
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
        const res = await fetch('/api/trips?all=true');
        const data = await res.json();
        if (isMounted && data.success) {
          setTrips(data.trips);
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

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف رحلة (${title}) نهائياً؟`)) {
      return;
    }

    try {
      const res = await fetch(`/api/trips/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTrips((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetSeedData = async () => {
    if (!window.confirm('هل تريد استعادة الرحلات والبيانات الافتراضية للشركة؟')) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/admin/reset-data', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchTrips();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (slug: string, id: string) => {
    const url = `${window.location.origin}/trips/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">إدارة الرحلات السياحية</h1>
            <p className="text-xs text-slate-400 mt-1">
              إضافة وتعديل وحذف البرامج السياحية والتحكم بالمقاعد المتاحة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleResetSeedData}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
              title="استعادة الرحلات الافتراضية"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>استعادة البيانات الافتراضية</span>
            </button>

            <a
              id="btn-admin-add-trip"
              href="/admin/trips/new"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة رحلة جديدة</span>
            </a>
          </div>
        </div>

        {/* Trips Table */}
        <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">جاري تحميل الرحلات...</div>
          ) : trips.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">صورة</th>
                    <th className="py-3.5 px-4">اسم الرحلة والوجهة</th>
                    <th className="py-3.5 px-4">السعر</th>
                    <th className="py-3.5 px-4">المقاعد والحجز</th>
                    <th className="py-3.5 px-4">التاريخ والمدة</th>
                    <th className="py-3.5 px-4">العلامات</th>
                    <th className="py-3.5 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {trips.map((trip) => {
                    const remaining = Math.max(0, trip.maxSeats - trip.bookedSeats);
                    const isFull = remaining <= 0;

                    return (
                      <tr key={trip.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="w-14 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={trip.mainImage}
                              alt={trip.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white max-w-[220px] truncate">
                            {trip.title}
                          </div>
                          <div className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span>{trip.destination}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-black text-amber-400 whitespace-nowrap">
                          {trip.price.toLocaleString()} {trip.currency}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-slate-200">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-bold">{trip.bookedSeats}</span>
                            <span className="text-slate-500">/ {trip.maxSeats}</span>
                          </div>
                          <span
                            className={`text-[10px] font-bold ${
                              isFull ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {isFull ? 'المقاعد مكتملة' : `${remaining} متبقي`}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="text-slate-300">{trip.startDate}</div>
                          <div className="text-[10px] text-slate-500">{trip.duration}</div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {trip.isFeatured && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                مميزة
                              </span>
                            )}
                            {trip.isOffer && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                {trip.offerBadge || 'عرض'}
                              </span>
                            )}
                            {trip.isActive ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                نشط
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                                مخفي
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <a
                              href={`/trips/${trip.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                              title="معاينة في الموقع"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            <button
                              onClick={() => handleCopyLink(trip.slug, trip.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                              title="نسخ رابط الرحلة"
                            >
                              {copiedId === trip.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <a
                              href={`/admin/trips/${trip.id}/edit`}
                              className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors"
                              title="تعديل الرحلة"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </a>

                            <button
                              onClick={() => handleDelete(trip.id, trip.title)}
                              className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition-colors cursor-pointer"
                              title="حذف الرحلة"
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
            <div className="p-16 text-center space-y-3">
              <Compass className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">لا توجد رحلات مسجلة حالياً.</p>
              <a
                href="/admin/trips/new"
                className="inline-block px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold"
              >
                إضافة أول رحلة
              </a>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
