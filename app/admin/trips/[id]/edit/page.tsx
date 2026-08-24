'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Trip } from '@/lib/db';
import { Compass, Plus, Trash2, ArrowRight, Save, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function AdminEditTripPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [destination, setDestination] = useState('');
  const [description, setDescription] = useState('');
  const [overview, setOverview] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState('د.ع');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxSeats, setMaxSeats] = useState<number>(45);
  const [bookedSeats, setBookedSeats] = useState<number>(0);
  const [mainImage, setMainImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [departureInfo, setDepartureInfo] = useState('');
  const [includedServices, setIncludedServices] = useState<string[]>([]);
  const [excludedServices, setExcludedServices] = useState<string[]>([]);
  const [dailyProgram, setDailyProgram] = useState<any[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isOffer, setIsOffer] = useState(false);
  const [offerBadge, setOfferBadge] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/trips/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.trip) {
          const t: Trip = data.trip;
          setTitle(t.title);
          setSlug(t.slug);
          setDestination(t.destination);
          setDescription(t.description);
          setOverview(t.overview || t.description);
          setPrice(t.price);
          setCurrency(t.currency || 'د.ع');
          setDuration(t.duration);
          setStartDate(t.startDate);
          setEndDate(t.endDate);
          setMaxSeats(t.maxSeats);
          setBookedSeats(t.bookedSeats || 0);
          setMainImage(t.mainImage);
          setGalleryImages(t.images?.filter((img) => img !== t.mainImage) || []);
          setDepartureInfo(t.departureInfo || '');
          setIncludedServices(t.includedServices || []);
          setExcludedServices(t.excludedServices || []);
          setDailyProgram(t.dailyProgram || []);
          setIsActive(t.isActive !== false);
          setIsFeatured(Boolean(t.isFeatured));
          setIsOffer(Boolean(t.isOffer));
          setOfferBadge(t.offerBadge || 'عرض خاص');
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddDay = () => {
    const nextDay = dailyProgram.length + 1;
    setDailyProgram([
      ...dailyProgram,
      {
        day: nextDay,
        title: `برنامج اليوم ${nextDay}`,
        description: 'جولة سياحية وزيارة أبرز المعالم والمواقع الطبيعية.',
        activities: ['زيارة المعالم السياحية', 'وقت للتسوق والتصوير']
      }
    ]);
  };

  const handleRemoveDay = (index: number) => {
    const updated = dailyProgram.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }));
    setDailyProgram(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/trips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          destination,
          description,
          overview: overview || description,
          price: Number(price),
          currency,
          duration,
          startDate,
          endDate,
          maxSeats: Number(maxSeats),
          bookedSeats: Number(bookedSeats),
          mainImage,
          images: [mainImage, ...galleryImages.filter((img) => img.trim().length > 0)],
          departureInfo,
          includedServices,
          excludedServices,
          dailyProgram,
          isActive,
          isFeatured,
          isOffer,
          offerBadge: isOffer ? offerBadge : undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/trips');
      } else {
        setErrorMsg(data.error || 'فشل في تحديث بيانات الرحلة.');
      }
    } catch (e) {
      setErrorMsg('حدث خطأ أثناء الاتصال بالخادم.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-12 text-center text-xs text-slate-400">جاري تحميل بيانات الرحلة...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <a
              href="/admin/trips"
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-2xl font-black text-white">تعديل الرحلة: {title}</h1>
              <p className="text-xs text-slate-400">تحديث الأسعار والمواعيد والبرامج اليومية.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>حفظ التعديلات</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Basic Info */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>البيانات الأساسية</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">عنوان الرحلة</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">الوجهة السياحية</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">الرابط المختصر (Slug)</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 focus:ring-2 focus:ring-amber-400"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">سعر التذكرة للفرد (د.ع)</label>
              <input
                type="number"
                required
                min={0}
                step={5000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-amber-400 focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">المدة</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">تاريخ الانطلاق</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">تاريخ العودة</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">المقاعد الإجمالية</label>
              <input
                type="number"
                min={1}
                value={maxSeats}
                onChange={(e) => setMaxSeats(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">المقاعد المحجوزة حالياً</label>
              <input
                type="number"
                min={0}
                max={maxSeats}
                value={bookedSeats}
                onChange={(e) => setBookedSeats(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-400 font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">الوصف المختصر</label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-amber-400">الصورة ونقطة الانطلاق</h3>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">الصورة الرئيسية</label>
            <input
              type="url"
              required
              value={mainImage}
              onChange={(e) => setMainImage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">نقطة الانطلاق</label>
            <input
              type="text"
              value={departureInfo}
              onChange={(e) => setDepartureInfo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            />
          </div>
        </div>

        {/* Daily Program */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-400">البرنامج اليومي</h3>
            <button
              type="button"
              onClick={handleAddDay}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300"
            >
              + إضافة يوم
            </button>
          </div>

          <div className="space-y-4">
            {dailyProgram.map((prog, index) => (
              <div key={index} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-400">اليوم {prog.day}</span>
                  {dailyProgram.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDay(index)}
                      className="text-xs text-rose-400"
                    >
                      حذف
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={prog.title}
                  onChange={(e) => {
                    const up = [...dailyProgram];
                    up[index].title = e.target.value;
                    setDailyProgram(up);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
                <textarea
                  rows={2}
                  value={prog.description}
                  onChange={(e) => {
                    const up = [...dailyProgram];
                    up[index].description = e.target.value;
                    setDailyProgram(up);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Status toggles */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500"
            />
            <span className="text-xs font-bold text-white">رحلة نشطة</span>
          </label>

          <label className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500"
            />
            <span className="text-xs font-bold text-white">رحلة مميزة</span>
          </label>

          <label className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={isOffer}
              onChange={(e) => setIsOffer(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500"
            />
            <span className="text-xs font-bold text-white">عرض خاص</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <a
            href="/admin/trips"
            className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
          >
            إلغاء
          </a>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg"
          >
            {submitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
