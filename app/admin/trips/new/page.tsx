'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { TripImageManager } from '@/components/admin/TripImageManager';
import { getClientAdminHeaders } from '@/lib/clientAuth';
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
    'كربلاء - نهاية شارع الاسكان - محلات ملعب القديم'
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
      description: 'الانطلاق صباحاً من كربلاء إلى الوجهة، التوقف للاستراحة، والوصول إلى الفندق واستلام الغرف وجولة مسائية حرة.',
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

    if (!title.trim()) {
      setErrorMsg('يرجى إدخال عنوان الرحلة السياحية.');
      setSubmitting(false);
      return;
    }

    try {
      const effectiveMainImage =
        mainImage.trim() ||
        galleryImages[0]?.trim() ||
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80';

      const allImages = [
        effectiveMainImage,
        ...galleryImages
          .map((img) => img.trim())
          .filter((img) => img.length > 0 && img !== effectiveMainImage)
      ];

      const headers = getClientAdminHeaders();

      const res = await fetch('/api/trips', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || `trip-${Date.now()}`,
          destination: destination.trim(),
          description: description.trim() || title.trim(),
          overview: overview.trim() || description.trim() || title.trim(),
          price: Number(price) || 0,
          currency,
          duration: duration.trim() || '4 أيام / 3 ليالي',
          startDate: startDate || '2026-09-01',
          endDate: endDate || startDate || '2026-09-04',
          maxSeats: Number(maxSeats) || 40,
          mainImage: effectiveMainImage,
          images: allImages,
          departureInfo: departureInfo.trim(),
          includedServices,
          excludedServices,
          dailyProgram,
          status: isActive ? 'active' : 'draft',
          isActive,
          isFeatured,
          isOffer,
          offerBadge: isOffer ? offerBadge : undefined
        })
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        router.push('/admin/trips');
      } else {
        setErrorMsg(data?.error || 'فشل في حفظ الرحلة الجديدة. يرجى التأكد من البيانات والمحاولة مجدداً.');
      }
    } catch {
      setErrorMsg('حدث خطأ أثناء الاتصال بالخادم.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
        {/* Top Sticky Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[3px] border-[#1D2D2E] pb-6 sticky top-0 bg-[#FDFFF5]/95 backdrop-blur-md z-10 pt-2">
          <div className="flex items-center gap-3">
            <a
              href="/admin/trips"
              className="p-2.5 rounded-2xl bg-white border-2 border-[#1D2D2E] text-[#1D2D2E] hover:bg-[#FFD95A] shadow-[2px_2px_0px_#1D2D2E] transition-all"
              title="رجوع للرحلات"
            >
              <ArrowRight className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1D2D2E] flex items-center gap-2">
                <span>إضافة رحلة سياحية جديدة</span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FFD95A] border-2 border-[#1D2D2E] text-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                  مسودة جديدة
                </span>
              </h1>
              <p className="text-xs font-bold text-[#1D2D2E]/80 mt-0.5">
                أدخل تفاصيل البرنامج، الصور، الأسعار، والمقاعد المتاحة للجمهور.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/admin/trips"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FDFFF5] border-2 border-[#1D2D2E] text-[#1D2D2E] font-black text-xs shadow-[2px_2px_0px_#1D2D2E] transition-all"
            >
              إلغاء
            </a>
            <button
              id="btn-save-new-trip"
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF7E47] hover:bg-[#ff6c2f] text-white border-2 border-[#1D2D2E] font-black text-xs shadow-[3px_3px_0px_#1D2D2E] active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
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
          <div className="p-4 rounded-2xl bg-rose-100 border-2 border-rose-600 text-rose-800 text-xs font-black flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: Basic Trip Details */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-[3px] border-[#1D2D2E] space-y-6 shadow-[5px_5px_0px_#1D2D2E]">
          <div className="flex items-center justify-between border-b-2 border-[#1D2D2E]/15 pb-4">
            <h3 className="text-base font-black text-[#1D2D2E] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#FF7E47]" />
              <span>المعلومات الأساسية للرحلة</span>
            </h3>
            <span className="text-xs font-bold text-gray-500">* الحقول المطلوبة</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">
                عنوان الرحلة التجاري <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: رحلة شلالات السليمانية ودوكان VIP - فنادق 5 نجوم"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] focus:outline-none focus:ring-2 focus:ring-[#FF7E47] placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF7E47]" />
                <span>الوجهة السياحية (المدينة / الإقليم) *</span>
              </label>
              <input
                type="text"
                required
                placeholder="أربيل، السليمانية، دهوك، البصرة..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] focus:outline-none focus:ring-2 focus:ring-[#FF7E47]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#FF7E47]" />
                <span>سعر الفرد الواحد (د.ع) *</span>
              </label>
              <input
                type="number"
                required
                min={0}
                step={5000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-black text-[#FF7E47] font-mono focus:outline-none focus:ring-2 focus:ring-[#FF7E47]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#FF7E47]" />
                <span>مدة الرحلة</span>
              </label>
              <input
                type="text"
                placeholder="4 أيام / 3 ليالي"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs text-[#1D2D2E] font-bold focus:outline-none focus:ring-2 focus:ring-[#FF7E47]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#FF7E47]" />
                <span>تاريخ الانطلاق *</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs text-[#1D2D2E] font-bold focus:outline-none focus:ring-2 focus:ring-[#FF7E47]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#FF7E47]" />
                <span>تاريخ العودة *</span>
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs text-[#1D2D2E] font-bold focus:outline-none focus:ring-2 focus:ring-[#FF7E47]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#FF7E47]" />
                <span>إجمالي سعة مقاعد الباص *</span>
              </label>
              <input
                type="number"
                min={1}
                max={100}
                required
                value={maxSeats}
                onChange={(e) => setMaxSeats(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs text-[#1D2D2E] font-mono font-black focus:outline-none focus:ring-2 focus:ring-[#FF7E47]"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">
                نبذة تسويقية مختصرة (تظهر في كروت الواجهة الرئيسية) *
              </label>
              <textarea
                rows={2}
                required
                placeholder="استمتع بأجمل العطلات مع باقات سما البارقة السياحية..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs text-[#1D2D2E] font-bold focus:outline-none focus:ring-2 focus:ring-[#FF7E47] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Interactive Image Manager (File Upload / URL / Presets) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-[3px] border-[#1D2D2E] shadow-[5px_5px_0px_#1D2D2E]">
          <TripImageManager
            mainImage={mainImage}
            galleryImages={galleryImages}
            onMainImageChange={setMainImage}
            onGalleryImagesChange={setGalleryImages}
          />
        </div>

        {/* Section 3: Departure & Logistics */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-[3px] border-[#1D2D2E] space-y-6 shadow-[5px_5px_0px_#1D2D2E]">
          <h3 className="text-base font-black text-[#1D2D2E] flex items-center gap-2 border-b-2 border-[#1D2D2E]/15 pb-4">
            <Info className="w-5 h-5 text-[#FF7E47]" />
            <span>نقطة التجمع وتفاصيل الانطلاق</span>
          </h3>

          <div>
            <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">
              مكان وموعد التجمع والانطلاق
            </label>
            <input
              type="text"
              placeholder="مثال: التجمع في ساحة الفردوس - بغداد الساعة 6:00 صباحاً"
              value={departureInfo}
              onChange={(e) => setDepartureInfo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs text-[#1D2D2E] font-bold focus:outline-none focus:ring-2 focus:ring-[#FF7E47]"
            />
          </div>

          {/* Included / Excluded services */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Included */}
            <div className="space-y-3 bg-[#FDFFF5] p-4 rounded-2xl border-2 border-[#1D2D2E]">
              <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
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
                  className="flex-1 px-3 py-2 rounded-xl bg-white border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E]"
                />
                <button
                  type="button"
                  onClick={handleAddIncludedService}
                  className="px-4 py-2 rounded-xl bg-[#A5F3CF] hover:bg-[#86efac] border-2 border-[#1D2D2E] text-[#1D2D2E] font-black text-xs cursor-pointer shadow-[2px_2px_0px_#1D2D2E]"
                >
                  إضافة
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {includedServices.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-white text-xs font-bold text-[#1D2D2E] border border-[#1D2D2E]"
                  >
                    <span>✓ {item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIncludedService(idx)}
                      className="text-rose-600 hover:text-rose-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Excluded */}
            <div className="space-y-3 bg-[#FDFFF5] p-4 rounded-2xl border-2 border-[#1D2D2E]">
              <span className="text-xs font-black text-rose-800 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
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
                  className="flex-1 px-3 py-2 rounded-xl bg-white border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E]"
                />
                <button
                  type="button"
                  onClick={handleAddExcludedService}
                  className="px-4 py-2 rounded-xl bg-rose-200 hover:bg-rose-300 border-2 border-[#1D2D2E] text-rose-900 font-black text-xs cursor-pointer shadow-[2px_2px_0px_#1D2D2E]"
                >
                  إضافة
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {excludedServices.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-white text-xs font-bold text-[#1D2D2E] border border-[#1D2D2E]"
                  >
                    <span>✗ {item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExcludedService(idx)}
                      className="text-rose-600 hover:text-rose-700 p-1 cursor-pointer"
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
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-[3px] border-[#1D2D2E] space-y-6 shadow-[5px_5px_0px_#1D2D2E]">
          <div className="flex items-center justify-between border-b-2 border-[#1D2D2E]/15 pb-4">
            <div>
              <h3 className="text-base font-black text-[#1D2D2E]">
                البرنامج السياحي اليومي للرحلة ({dailyProgram.length} أيام)
              </h3>
              <p className="text-xs font-bold text-[#1D2D2E]/70 mt-0.5">
                خط سير الرحلة وجدول الأنشطة اليومية بالتفصيل
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddDay}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFD95A] hover:bg-[#fcd34d] text-xs font-black text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة يوم جديد</span>
            </button>
          </div>

          <div className="space-y-4">
            {dailyProgram.map((prog, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#FF7E47] border border-[#1D2D2E] text-white flex items-center justify-center text-xs font-black">
                      {prog.day}
                    </span>
                    <span className="text-sm font-black text-[#1D2D2E]">اليوم {prog.day}</span>
                  </div>
                  {dailyProgram.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDay(index)}
                      className="text-rose-600 hover:text-rose-700 text-xs font-black flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف اليوم</span>
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1D2D2E] mb-1">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] focus:outline-none focus:border-[#FF7E47]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1D2D2E] mb-1">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] focus:outline-none focus:border-[#FF7E47] resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Badges & Display Options */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-[3px] border-[#1D2D2E] space-y-4 shadow-[5px_5px_0px_#1D2D2E]">
          <h3 className="text-base font-black text-[#1D2D2E] border-b-2 border-[#1D2D2E]/15 pb-4">
            خيارات العرض والترويج
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] cursor-pointer hover:bg-[#FFD95A]/20 transition-colors">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF7E47] focus:ring-[#FF7E47]"
              />
              <div>
                <span className="text-xs font-black text-[#1D2D2E] block">رحلة نشطة ومتاحة</span>
                <span className="text-[10px] font-bold text-[#1D2D2E]/70">تظهر في الموقع العام ويمكن الحجز فيها</span>
              </div>
            </label>

            <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] cursor-pointer hover:bg-[#FFD95A]/20 transition-colors">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF7E47] focus:ring-[#FF7E47]"
              />
              <div>
                <span className="text-xs font-black text-[#1D2D2E] block">رحلة مميزة (Featured)</span>
                <span className="text-[10px] font-bold text-[#1D2D2E]/70">تظهر في صدارة الصفحة الرئيسية</span>
              </div>
            </label>

            <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] cursor-pointer hover:bg-[#FFD95A]/20 transition-colors">
              <input
                type="checkbox"
                checked={isOffer}
                onChange={(e) => setIsOffer(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF7E47] focus:ring-[#FF7E47]"
              />
              <div>
                <span className="text-xs font-black text-[#1D2D2E] block">عرض خاص / خصم</span>
                <span className="text-[10px] font-bold text-[#1D2D2E]/70">تظهر في قسم العروض مع شارة الخصم</span>
              </div>
            </label>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <a
            href="/admin/trips"
            className="px-6 py-3 rounded-2xl bg-white border-2 border-[#1D2D2E] text-[#1D2D2E] text-xs font-black shadow-[2px_2px_0px_#1D2D2E] hover:bg-[#FDFFF5] transition-all"
          >
            إلغاء
          </a>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-2xl bg-[#FF7E47] hover:bg-[#ff6c2f] text-white border-2 border-[#1D2D2E] font-black text-xs shadow-[3px_3px_0px_#1D2D2E] active:scale-98 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
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
