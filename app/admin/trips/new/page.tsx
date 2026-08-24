'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Compass, Plus, Trash2, ArrowRight, Save, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function AdminNewTripPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [destination, setDestination] = useState('أربيل');
  const [description, setDescription] = useState('');
  const [overview, setOverview] = useState('');
  const [price, setPrice] = useState<number>(150000);
  const [currency, setCurrency] = useState('د.ع');
  const [duration, setDuration] = useState('4 أيام / 3 ليالي');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-04');
  const [maxSeats, setMaxSeats] = useState<number>(45);
  const [mainImage, setMainImage] = useState('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200');
  const [galleryImages, setGalleryImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000'
  ]);
  const [departureInfo, setDepartureInfo] = useState('التجمع في ساحة الفردوس - بغداد الساعة 6:00 صباحاً.');
  const [includedServices, setIncludedServices] = useState<string[]>([
    'النقل بباصات سياحية VIP حديثة ومكيفة',
    'الإقامة في فنادق 4 و 5 نجوم مع وجبة الإفطار',
    'مرشد سياحي مرافق طيلة فترة الرحلة',
    'رسوم دخول الأماكن السياحية المذكورة بالبرنامج'
  ]);
  const [excludedServices, setExcludedServices] = useState<string[]>([
    'الوجبات الإضافية والمصاريف الشخصية',
    'الأنشطة الترفيهية الاختيارية'
  ]);
  const [dailyProgram, setDailyProgram] = useState([
    {
      day: 1,
      title: 'الانطلاق والوصول وتسجيل الدخول',
      description: 'الانطلاق صباحاً من بغداد إلى الوجهة، التوقف للاستراحة، والوصول إلى الفندق واستلام الغرف.',
      activities: ['الانطلاق من نقطة التجمع', 'استراحة الغداء', 'استلام الغرف وجولة حرة']
    }
  ]);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isOffer, setIsOffer] = useState(false);
  const [offerBadge, setOfferBadge] = useState('خصم 15%');

  // Auto generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === title.toLowerCase().replace(/\s+/g, '-')) {
      const generated = val
        .trim()
        .toLowerCase()
        .replace(/[^\w\u0621-\u064A0-9]+/g, '-');
      setSlug(generated);
    }
  };

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
      const res = await fetch('/api/trips', {
        method: 'POST',
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
        setErrorMsg(data.error || 'فشل في حفظ الرحلة الجديدة.');
      }
    } catch (e) {
      setErrorMsg('حدث خطأ أثناء الاتصال بالخادم.');
    } finally {
      setSubmitting(false);
    }
  };

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
              <h1 className="text-2xl font-black text-white">إضافة رحلة سياحية جديدة</h1>
              <p className="text-xs text-slate-400">
                أدخل تفاصيل البرنامج السياحي، الأسعار، والمقاعد المتاحة.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>حفظ ونشر الرحلة</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: Basic Info */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>المعلومات الأساسية للرحلة</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                عنوان الرحلة <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: رحلة شلالات السليمانية ودوكان VIP"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                الوجهة السياحية (المدينة / الإقليم) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: أربيل، السليمانية، دهوك، البصرة..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                الرابط المختصر (Slug)
              </label>
              <input
                type="text"
                required
                placeholder="sulaymaniyah-trip"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 focus:ring-2 focus:ring-amber-400"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                سعر التذكرة للفرد الواحد (د.ع) <span className="text-rose-400">*</span>
              </label>
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
              <label className="block text-xs font-bold text-slate-300 mb-1">
                مدة الرحلة (أيام / ليالي)
              </label>
              <input
                type="text"
                placeholder="4 أيام / 3 ليالي"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                تاريخ الانطلاق
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                تاريخ العودة
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                إجمالي سعة المقاعد للباص <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={maxSeats}
                onChange={(e) => setMaxSeats(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                وصف موجز للرحلة
              </label>
              <textarea
                rows={2}
                required
                placeholder="نبذة سريعة تظهر في كروت العرض..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Media & Departure */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>الصور ونقاط الانطلاق</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                رابط الصورة الرئيسية (Main Image URL)
              </label>
              <input
                type="url"
                required
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:ring-2 focus:ring-amber-400"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                معلومات ونقطة الانطلاق
              </label>
              <input
                type="text"
                placeholder="التجمع في ساحة الفردوس - بغداد الساعة 6:00 صباحاً"
                value={departureInfo}
                onChange={(e) => setDepartureInfo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Daily Program */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-400">
              البرنامج السياحي اليومي ({dailyProgram.length} أيام)
            </h3>
            <button
              type="button"
              onClick={handleAddDay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة يوم</span>
            </button>
          </div>

          <div className="space-y-4">
            {dailyProgram.map((prog, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-400">اليوم {prog.day}</span>
                  {dailyProgram.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDay(index)}
                      className="text-rose-400 hover:text-rose-300 text-xs"
                    >
                      حذف اليوم
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="عنوان اليوم (مثال: جولة في جبل كورك)"
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
                  placeholder="تفاصيل اليوم..."
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

        {/* Section 4: Visibility & Badges */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-amber-400">خيارات العرض والتمييز</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              <div>
                <span className="text-xs font-bold text-white block">رحلة نشطة ومتاحة</span>
                <span className="text-[10px] text-slate-400">تظهر في الموقع العام للزوار</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              <div>
                <span className="text-xs font-bold text-white block">رحلة مميزة (Featured)</span>
                <span className="text-[10px] text-slate-400">تظهر في صدارة الصفحة الرئيسية</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isOffer}
                onChange={(e) => setIsOffer(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              <div>
                <span className="text-xs font-bold text-white block">عرض خاص / خصم</span>
                <span className="text-[10px] text-slate-400">تظهر في قسم العروض الخاصة</span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-3 pt-4">
          <a
            href="/admin/trips"
            className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
          >
            إلغاء
          </a>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'جاري الحفظ...' : 'حفظ ونشر الرحلة الآن'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
