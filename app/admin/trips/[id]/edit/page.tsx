'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { TripImageManager } from '@/components/admin/TripImageManager';
import { Trip } from '@/lib/db';
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

      const res = await fetch(`/api/trips/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          destination: destination.trim(),
          description: description.trim(),
          overview: overview.trim() || description.trim(),
          price: Number(price) || 0,
          currency,
          duration: duration.trim(),
          startDate,
          endDate: endDate || startDate,
          maxSeats: Number(maxSeats) || 40,
          bookedSeats: Number(bookedSeats) || 0,
          mainImage: effectiveMainImage,
          images: allImages,
          departureInfo: departureInfo.trim(),
          includedServices,
          excludedServices,
          dailyProgram,
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
        setErrorMsg(data?.error || 'فشل في تحديث بيانات الرحلة. يرجى التأكد من البيانات والمحاولة مجدداً.');
      }
    } catch {
      setErrorMsg('حدث خطأ أثناء الاتصال بالخادم.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-16 text-center text-xs font-black text-[#1D2D2E] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-[#1D2D2E] border-t-[#FF7E47] rounded-full animate-spin"></div>
          <span>جاري تحميل بيانات الرحلة...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
        {/* Header */}
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
                <span>تعديل الرحلة: {title}</span>
              </h1>
              <p className="text-xs font-bold text-[#1D2D2E]/70 mt-0.5">
                تحديث الأسعار، المقاعد، الصور، وجدول الرحلة اليومي.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/admin/trips"
              className="px-4 py-2.5 rounded-xl bg-white border-2 border-[#1D2D2E] hover:bg-gray-100 text-[#1D2D2E] font-black text-xs shadow-[2px_2px_0px_#1D2D2E] transition-all"
            >
              إلغاء
            </a>
            <button
              id="btn-save-edit-trip"
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
                  <span>حفظ التعديلات</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-100 border-2 border-rose-600 text-rose-800 text-xs font-black flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Basic Info */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-[3px] border-[#1D2D2E] space-y-6 shadow-[5px_5px_0px_#1D2D2E]">
          <h3 className="text-base font-black text-[#1D2D2E] flex items-center gap-2 border-b-2 border-[#1D2D2E]/15 pb-4">
            <Compass className="w-5 h-5 text-[#FF7E47]" />
            <span>البيانات الأساسية للرحلة</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">عنوان الرحلة</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#FF7E47]" />
                <span>الوجهة السياحية</span>
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-[#FF7E47]" />
                <span>سعر التذكرة للفرد (د.ع)</span>
              </label>
              <input
                type="number"
                required
                min={0}
                step={5000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-black text-[#FF7E47] focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5 flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#FF7E47]" />
                <span>المدة</span>
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-[#FF7E47]" />
                <span>تاريخ الانطلاق</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-[#FF7E47]" />
                <span>تاريخ العودة</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] focus:outline-none focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">المقاعد الكلية</label>
                <input
                  type="number"
                  min={1}
                  value={maxSeats}
                  onChange={(e) => setMaxSeats(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs text-[#1D2D2E] font-black"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">المحجوزة حالياً</label>
                <input
                  type="number"
                  min={0}
                  max={maxSeats}
                  value={bookedSeats}
                  onChange={(e) => setBookedSeats(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs text-[#FF7E47] font-black"
                />
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">الوصف المختصر</label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] focus:outline-none focus:bg-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Media & Images Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-[3px] border-[#1D2D2E] shadow-[5px_5px_0px_#1D2D2E]">
          <TripImageManager
            mainImage={mainImage}
            galleryImages={galleryImages}
            onMainImageChange={setMainImage}
            onGalleryImagesChange={setGalleryImages}
          />
        </div>

        {/* Departure & Logistics */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-[3px] border-[#1D2D2E] space-y-6 shadow-[5px_5px_0px_#1D2D2E]">
          <h3 className="text-base font-black text-[#1D2D2E] flex items-center gap-2 border-b-2 border-[#1D2D2E]/15 pb-4">
            <Info className="w-5 h-5 text-[#FF7E47]" />
            <span>نقطة التجمع والخدمات</span>
          </h3>

          <div>
            <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">
              نقطة وموعد التجمع
            </label>
            <input
              type="text"
              value={departureInfo}
              onChange={(e) => setDepartureInfo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] focus:outline-none focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Included */}
            <div className="space-y-3 bg-[#FDFFF5] p-4 rounded-2xl border-2 border-[#1D2D2E]">
              <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
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
                  className="flex-1 px-3 py-2 rounded-xl bg-white border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E]"
                />
                <button
                  type="button"
                  onClick={handleAddIncludedService}
                  className="px-3.5 py-2 rounded-xl bg-[#A5F3CF] hover:bg-[#86efac] text-[#1D2D2E] border-2 border-[#1D2D2E] font-black text-xs shadow-[2px_2px_0px_#1D2D2E] cursor-pointer"
                >
                  إضافة
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {includedServices.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-white text-xs font-bold text-[#1D2D2E] border-2 border-[#1D2D2E]"
                  >
                    <span>✓ {item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIncludedService(idx)}
                      className="text-rose-600 hover:text-rose-800 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
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
                  placeholder="أضف استثناء..."
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
                  className="px-3.5 py-2 rounded-xl bg-rose-200 hover:bg-rose-300 text-rose-900 border-2 border-[#1D2D2E] font-black text-xs shadow-[2px_2px_0px_#1D2D2E] cursor-pointer"
                >
                  إضافة
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {excludedServices.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-white text-xs font-bold text-[#1D2D2E] border-2 border-[#1D2D2E]"
                  >
                    <span>✗ {item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExcludedService(idx)}
                      className="text-rose-600 hover:text-rose-800 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Daily Program */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-[3px] border-[#1D2D2E] space-y-6 shadow-[5px_5px_0px_#1D2D2E]">
          <div className="flex items-center justify-between border-b-2 border-[#1D2D2E]/15 pb-4">
            <h3 className="text-base font-black text-[#1D2D2E]">
              البرنامج السياحي اليومي ({dailyProgram.length} أيام)
            </h3>
            <button
              type="button"
              onClick={handleAddDay}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFD95A] hover:bg-[#fcd34d] text-xs font-black text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة يوم</span>
            </button>
          </div>

          <div className="space-y-4">
            {dailyProgram.map((prog, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-[#FF7E47]">اليوم {prog.day}</span>
                  {dailyProgram.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDay(index)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-black cursor-pointer"
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
                  className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E]"
                />
                <textarea
                  rows={2}
                  value={prog.description}
                  onChange={(e) => {
                    const up = [...dailyProgram];
                    up[index].description = e.target.value;
                    setDailyProgram(up);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Status toggles */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-[3px] border-[#1D2D2E] grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-[5px_5px_0px_#1D2D2E]">
          <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 rounded text-[#FF7E47] accent-[#FF7E47]"
            />
            <span className="text-xs font-black text-[#1D2D2E]">رحلة نشطة ومتاحة</span>
          </label>

          <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 rounded text-[#FF7E47] accent-[#FF7E47]"
            />
            <span className="text-xs font-black text-[#1D2D2E]">رحلة مميزة في الرئيسية</span>
          </label>

          <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] cursor-pointer">
            <input
              type="checkbox"
              checked={isOffer}
              onChange={(e) => setIsOffer(e.target.checked)}
              className="w-5 h-5 rounded text-[#FF7E47] accent-[#FF7E47]"
            />
            <span className="text-xs font-black text-[#1D2D2E]">عرض خاص مع خصم</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <a
            href="/admin/trips"
            className="px-6 py-3 rounded-2xl bg-white border-2 border-[#1D2D2E] hover:bg-gray-100 text-[#1D2D2E] text-xs font-black shadow-[2px_2px_0px_#1D2D2E] transition-all"
          >
            إلغاء
          </a>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-2xl bg-[#FF7E47] hover:bg-[#ff6c2f] text-white border-2 border-[#1D2D2E] font-black text-xs shadow-[4px_4px_0px_#1D2D2E] active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
