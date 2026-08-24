'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { TripImageManager } from '@/components/admin/TripImageManager';
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
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';

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
  const [mainImage, setMainImage] = useState(
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200'
  );
  const [galleryImages, setGalleryImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000'
  ]);
  const [departureInfo, setDepartureInfo] = useState(
    'التجمع في ساحة الفردوس - بغداد الساعة 6:00 صباحاً.'
  );
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
      title: 'الانطلاق والوصول وتسجيل الدخول بالفندق',
      description: 'الانطلاق صباحاً من بغداد إلى الوجهة، التوقف للاستراحة، والوصول إلى الفندق واستلام الغرف وجولة مسائية حرة.',
      activities: ['الانطلاق من نقطة التجمع', 'استراحة الغداء', 'استلام الغرف وجولة مسائية']
    },
    {
      day: 2,
      title: 'جولة المعالم السياحية والطبيعة الخلابة',
      description: 'زيارة أبرز المعالم الطبيعية، الشلالات، والتقاط الصور التذكارية مع تناول وجبة الغداء.',
      activities: ['زيارة الشلالات والحدائق', 'جلسات تصوير ومناظر طبيعية']
    }
  ]);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isOffer, setIsOffer] = useState(false);
  const [offerBadge, setOfferBadge] = useState('خصم 15%');

  // Included & Excluded item additions
  const [newIncludedInput, setNewIncludedInput] = useState('');
  const [newExcludedInput, setNewExcludedInput] = useState('');

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
        description: 'جولة سياحية وزيارة أبرز المعالم والمواقع الطبيعية والتسوق.',
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

      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: slug.trim() || `trip-${Date.now()}`,
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
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
        {/* Top Sticky Header */}
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
                <span>إضافة رحلة سياحية جديدة</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  مسودة جديدة
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                أدخل تفاصيل البرنامج، الصور، الأسعار، والمقاعد المتاحة للجمهور.
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
              id="btn-save-new-trip"
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
                  <span>حفظ ونشر الرحلة</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: Basic Trip Details */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>المعلومات الأساسية للرحلة</span>
            </h3>
            <span className="text-[11px] text-slate-500">* الحقول المطلوبة</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                عنوان الرحلة التجاري <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: رحلة شلالات السليمانية ودوكان VIP - فنادق 5 نجوم"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>الوجهة السياحية (المدينة / الإقليم) *</span>
              </label>
              <input
                type="text"
                required
                placeholder="أربيل، السليمانية، دهوك، البصرة..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>سعر الفرد الواحد (د.ع) *</span>
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
                <span>مدة الرحلة</span>
              </label>
              <input
                type="text"
                placeholder="4 أيام / 3 ليالي"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>تاريخ الانطلاق *</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>تاريخ العودة *</span>
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>إجمالي سعة مقاعد الباص *</span>
              </label>
              <input
                type="number"
                min={1}
                max={100}
                required
                value={maxSeats}
                onChange={(e) => setMaxSeats(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                نبذة تسويقية مختصرة (تظهر في كروت الواجهة الرئيسية) *
              </label>
              <textarea
                rows={2}
                required
                placeholder="استمتع بأجمل العطلات مع باقات سما البارقة السياحية..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Interactive Image Manager (File Upload / URL / Presets) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl">
          <TripImageManager
            mainImage={mainImage}
            galleryImages={galleryImages}
            onMainImageChange={setMainImage}
            onGalleryImagesChange={setGalleryImages}
          />
        </div>

        {/* Section 3: Departure & Logistics */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800/80 pb-4">
            <Info className="w-4 h-4" />
            <span>نقطة التجمع وتفاصيل الانطلاق</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              مكان وموعد التجمع والانطلاق
            </label>
            <input
              type="text"
              placeholder="مثال: التجمع في ساحة الفردوس - بغداد الساعة 6:00 صباحاً"
              value={departureInfo}
              onChange={(e) => setDepartureInfo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Included / Excluded services */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Included */}
            <div className="space-y-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>الخدمات المشمولة في البرنامج:</span>
              </span>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="أضف ميزة مشمولة (مثل: وجبة إفطار يومياً)..."
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
                  placeholder="أضف استثناء (مثل: المصاريف الشخصية)..."
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

        {/* Section 4: Daily Itinerary */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-sm font-bold text-amber-400">
                البرنامج السياحي اليومي للرحلة ({dailyProgram.length} أيام)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                خط سير الرحلة وجدول الأنشطة اليومية بالتفصيل
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddDay}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة يوم جديد</span>
            </button>
          </div>

          <div className="space-y-4">
            {dailyProgram.map((prog, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black">
                      {prog.day}
                    </span>
                    <span className="text-xs font-bold text-white">اليوم {prog.day}</span>
                  </div>
                  {dailyProgram.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDay(index)}
                      className="text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف اليوم</span>
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    عنوان نشاط اليوم
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: زيارة شلالات بيخال وجبل كورك"
                    value={prog.title}
                    onChange={(e) => {
                      const up = [...dailyProgram];
                      up[index].title = e.target.value;
                      setDailyProgram(up);
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    تفاصيل ومحطات اليوم
                  </label>
                  <textarea
                    rows={2}
                    placeholder="تفاصيل الجولة..."
                    value={prog.description}
                    onChange={(e) => {
                      const up = [...dailyProgram];
                      up[index].description = e.target.value;
                      setDailyProgram(up);
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Badges & Display Options */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-amber-400 border-b border-slate-800/80 pb-4">
            خيارات العرض والترويج
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              <div>
                <span className="text-xs font-bold text-white block">رحلة نشطة ومتاحة</span>
                <span className="text-[10px] text-slate-400">تظهر في الموقع العام ويمكن الحجز فيها</span>
              </div>
            </label>

            <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
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

            <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={isOffer}
                onChange={(e) => setIsOffer(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              <div>
                <span className="text-xs font-bold text-white block">عرض خاص / خصم</span>
                <span className="text-[10px] text-slate-400">تظهر في قسم العروض مع شارة الخصم</span>
              </div>
            </label>
          </div>
        </div>

        {/* Bottom Actions Bar */}
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
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>حفظ ونشر الرحلة الآن</span>
              </>
            )}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
