'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { TripImageManager } from '@/components/admin/TripImageManager';
import { Trip } from '@/lib/db';
import {
  Compass,
  Plus,
  Trash2,
  ArrowRight,
  Save,
  Loader2,
  AlertCircle,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  Info
} from 'lucide-react';

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

  // Included & Excluded item additions
  const [newIncludedInput, setNewIncludedInput] = useState('');
  const [newExcludedInput, setNewExcludedInput] = useState('');

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
    const updated = dailyProgram
      .filter((_, i) => i !== index)
      .map((d, i) => ({ ...d, day: i + 1 }));
    setDailyProgram(updated);
  };

  const handleAddIncludedService = () => {
    if (newIncludedInput.trim()) {
      setIncludedServices([...includedServices, newIncludedInput.trim()]);
      setNewIncludedInput('');
    }
  };

  const handleRemoveIncludedService = (index: number) => {
    setIncludedServices(includedServices.filter((_, i) => i !== index));
  };

  const handleAddExcludedService = () => {
    if (newExcludedInput.trim()) {
      setExcludedServices([...excludedServices, newExcludedInput.trim()]);
      setNewExcludedInput('');
    }
  };

  const handleRemoveExcludedService = (index: number) => {
    setExcludedServices(excludedServices.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const allImages = [mainImage, ...galleryImages.filter((img) => img.trim().length > 0 && img !== mainImage)];

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
          images: allImages,
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
        <div className="p-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <span>جاري تحميل بيانات الرحلة...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 sticky top-0 bg-slate-900/90 backdrop-blur-md z-10 pt-2">
          <div className="flex items-center gap-3">
            <a
              href="/admin/trips"
              className="p-2.5 rounded-2xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="رجوع للرحلات"
            >
              <ArrowRight className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>تعديل الرحلة: {title}</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                تحديث الأسعار، المقاعد، الصور، وجدول الرحلة اليومي.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/admin/trips"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              إلغاء
            </a>
            <button
              id="btn-save-edit-trip"
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Basic Info */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800/80 pb-4">
            <Compass className="w-4 h-4" />
            <span>البيانات الأساسية للرحلة</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان الرحلة</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>الوجهة السياحية</span>
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>سعر التذكرة للفرد (د.ع)</span>
              </label>
              <input
                type="number"
                required
                min={0}
                step={5000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-black text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>المدة</span>
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>تاريخ الانطلاق</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>تاريخ العودة</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">المقاعد الكلية</label>
                <input
                  type="number"
                  min={1}
                  value={maxSeats}
                  onChange={(e) => setMaxSeats(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">المحجوزة حالياً</label>
                <input
                  type="number"
                  min={0}
                  max={maxSeats}
                  value={bookedSeats}
                  onChange={(e) => setBookedSeats(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-400 font-black"
                />
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">الوصف المختصر</label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Media & Images Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl">
          <TripImageManager
            mainImage={mainImage}
            galleryImages={galleryImages}
            onMainImageChange={setMainImage}
            onGalleryImagesChange={setGalleryImages}
          />
        </div>

        {/* Departure & Logistics */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800/80 pb-4">
            <Info className="w-4 h-4" />
            <span>نقطة التجمع والخدمات</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              نقطة وموعد التجمع
            </label>
            <input
              type="text"
              value={departureInfo}
              onChange={(e) => setDepartureInfo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Included */}
            <div className="space-y-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>الخدمات المشمولة:</span>
              </span>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="أضف ميزة مشمولة..."
                  value={newIncludedInput}
                  onChange={(e) => setNewIncludedInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddIncludedService();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddIncludedService}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                >
                  إضافة
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {includedServices.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800"
                  >
                    <span>✓ {item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIncludedService(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Excluded */}
            <div className="space-y-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>الخدمات غير المشمولة:</span>
              </span>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="أضف استثناء..."
                  value={newExcludedInput}
                  onChange={(e) => setNewExcludedInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddExcludedService();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddExcludedService}
                  className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
                >
                  إضافة
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {excludedServices.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800"
                  >
                    <span>✗ {item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExcludedService(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Daily Program */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h3 className="text-sm font-bold text-amber-400">
              البرنامج السياحي اليومي ({dailyProgram.length} أيام)
            </h3>
            <button
              type="button"
              onClick={handleAddDay}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة يوم</span>
            </button>
          </div>

          <div className="space-y-4">
            {dailyProgram.map((prog, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-amber-400">اليوم {prog.day}</span>
                  {dailyProgram.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDay(index)}
                      className="text-xs text-rose-400 hover:text-rose-300 font-bold"
                    >
                      حذف اليوم
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
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
                <textarea
                  rows={2}
                  value={prog.description}
                  onChange={(e) => {
                    const up = [...dailyProgram];
                    up[index].description = e.target.value;
                    setDailyProgram(up);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Status toggles */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xl">
          <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500"
            />
            <span className="text-xs font-bold text-white">رحلة نشطة ومتاحة</span>
          </label>

          <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500"
            />
            <span className="text-xs font-bold text-white">رحلة مميزة في الرئيسية</span>
          </label>

          <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={isOffer}
              onChange={(e) => setIsOffer(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500"
            />
            <span className="text-xs font-bold text-white">عرض خاص مع خصم</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <a
            href="/admin/trips"
            className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            إلغاء
          </a>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
