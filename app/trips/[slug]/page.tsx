'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { BookingModal } from '@/components/BookingModal';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Trip } from '@/lib/db';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Bus,
  ShieldCheck,
  Share2,
  PhoneCall,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Lock
} from 'lucide-react';

export default function TripDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { isGuest, isLoggedIn } = useUserAuth();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeDayAccordion, setActiveDayAccordion] = useState<number | null>(1);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/trips/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.trip) {
          setTrip(data.trip);
          // Log trip view in analytics
          fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: `/trips/${slug}`, tripSlug: slug })
          }).catch(() => {});
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFFF5] text-[#1D2D2E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 border-4 border-[#1D2D2E] border-t-[#FF7E47] rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-black text-[#1D2D2E]">جاري تحميل تفاصيل الرحلة السياحية...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFFF5] text-[#1D2D2E]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 mt-20">
          <div className="text-center bg-white p-10 rounded-[28px] border-3 border-[#1D2D2E] shadow-[6px_6px_0px_#1D2D2E] max-w-md">
            <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-[#1D2D2E] mb-2">الرحلة غير موجودة</h2>
            <p className="text-xs font-bold text-[#1D2D2E]/70 mb-6">
              قد تكون هذه الرحلة قد انتهت أو تم تعديل الرابط الخاص بها.
            </p>
            <Link
              href="/trips"
              className="inline-block px-6 py-3 rounded-xl bg-[#FF7E47] text-white text-xs font-black border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] hover:bg-[#e66a35]"
            >
              العودة إلى دليل الرحلات
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const remainingSeats = Math.max(0, trip.maxSeats - trip.bookedSeats);
  const isFull = remainingSeats <= 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFFF5] text-[#1D2D2E]">
      <Navbar />

      {/* Hero Banner Header */}
      <section className="bg-[#4CC9FE] text-[#1D2D2E] pt-28 pb-8 px-4 border-b-3 border-[#1D2D2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1D2D2E]">
            <Link href="/" className="hover:underline">الرئيسية</Link>
            <span>/</span>
            <Link href="/trips" className="hover:underline">الرحلات</Link>
            <span>/</span>
            <span className="font-black bg-[#FFD95A] px-2 py-0.5 rounded-md border border-[#1D2D2E]">{trip.destination}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-white text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF7E47]" />
                  <span>{trip.destination}</span>
                </span>
                {trip.isOffer && (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FF7E47] text-white border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                    {trip.offerBadge || 'عرض خاص 🔥'}
                  </span>
                )}
                {isFull ? (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500 text-white border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                    اكتملت المقاعد
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-[#A5F3CF] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                    متاح للحجز ({remainingSeats} مقعد متبقي)
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-[#1D2D2E] leading-tight">
                {trip.title}
              </h1>
            </div>

            <div className="bg-white p-4 rounded-[20px] border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] flex items-center gap-4 shrink-0">
              <div>
                <span className="text-[10px] text-[#1D2D2E]/70 block font-bold">سعر الشخص الواحد</span>
                <span className="text-2xl sm:text-3xl font-black text-[#FF7E47]">
                  {trip.price.toLocaleString()} {trip.currency}
                </span>
              </div>
              <button
                id="trip-header-book-btn"
                disabled={isFull}
                onClick={() => setIsBookingModalOpen(true)}
                className="px-6 py-3 rounded-xl text-xs font-black text-white bg-[#FF7E47] hover:bg-[#e66a35] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isFull ? 'المقاعد مكتملة' : 'احجز هذه الرحلة 🎒'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Detail Content */}
      <main className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trip Main Image (Determined by Admin) */}
            <div className="bg-white p-4 rounded-[28px] border-3 border-[#1D2D2E] shadow-[6px_6px_0px_#1D2D2E]">
              <div className="relative aspect-[16/9] rounded-[20px] overflow-hidden bg-slate-100 border-2 border-[#1D2D2E]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={trip.mainImage || (trip.images && trip.images[0]) || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'}
                  alt={trip.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Overview & Quick Info */}
            <div className="bg-white p-6 sm:p-8 rounded-[28px] border-3 border-[#1D2D2E] shadow-[6px_6px_0px_#1D2D2E] space-y-6">
              <div>
                <h3 className="text-xl font-black text-[#1D2D2E] mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF7E47] border border-[#1D2D2E]"></span>
                  نظرة عامة على الرحلة
                </h3>
                <p className="text-xs sm:text-sm font-bold text-[#1D2D2E]/80 leading-relaxed">
                  {trip.overview || trip.description}
                </p>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t-2 border-dashed border-[#1D2D2E]/20">
                <div className="p-3.5 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                  <Clock className="w-4 h-4 text-[#FF7E47] mb-1" />
                  <span className="text-[10px] text-[#1D2D2E]/70 block font-bold">المدة</span>
                  <span className="text-xs font-black text-[#1D2D2E]">{trip.duration}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                  <Calendar className="w-4 h-4 text-[#4CC9FE] mb-1" />
                  <span className="text-[10px] text-[#1D2D2E]/70 block font-bold">تاريخ الانطلاق</span>
                  <span className="text-xs font-black text-[#1D2D2E]">{trip.startDate}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                  <Calendar className="w-4 h-4 text-indigo-500 mb-1" />
                  <span className="text-[10px] text-[#1D2D2E]/70 block font-bold">تاريخ العودة</span>
                  <span className="text-xs font-black text-[#1D2D2E]">{trip.endDate}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                  <Users className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="text-[10px] text-[#1D2D2E]/70 block font-bold">المقاعد المتاحة</span>
                  <span className="text-xs font-black text-[#1D2D2E]">{remainingSeats} من أصل {trip.maxSeats}</span>
                </div>
              </div>
            </div>

            {/* Daily Program / Itinerary (البرنامج اليومي) */}
            {trip.dailyProgram && trip.dailyProgram.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-[28px] border-3 border-[#1D2D2E] shadow-[6px_6px_0px_#1D2D2E] space-y-6">
                <div>
                  <span className="text-xs font-black text-[#1D2D2E] bg-[#FFD95A] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] px-3 py-1 rounded-full uppercase">
                    جدول الأنشطة والجولات 🗓️
                  </span>
                  <h3 className="text-xl font-black text-[#1D2D2E] mt-3">
                    البرنامج السياحي اليومي المفصل
                  </h3>
                </div>

                <div className="space-y-4">
                  {trip.dailyProgram.map((item) => {
                    const isOpen = activeDayAccordion === item.day;
                    return (
                      <div
                        key={item.day}
                        className="rounded-2xl border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] overflow-hidden transition-all bg-[#FDFFF5]"
                      >
                        <button
                          onClick={() => setActiveDayAccordion(isOpen ? null : item.day)}
                          className="w-full p-4 sm:p-5 flex items-center justify-between text-right bg-[#FDFFF5] hover:bg-[#FFD95A]/30 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-[#FFD95A] border-2 border-[#1D2D2E] text-[#1D2D2E] font-black text-xs flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#1D2D2E]">
                              {item.day}
                            </span>
                            <h4 className="text-sm font-black text-[#1D2D2E]">{item.title}</h4>
                          </div>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-[#1D2D2E]" /> : <ChevronDown className="w-4 h-4 text-[#1D2D2E]" />}
                        </button>

                        {isOpen && (
                          <div className="p-5 bg-white border-t-2 border-[#1D2D2E] space-y-4">
                            <p className="text-xs font-bold text-[#1D2D2E]/80 leading-relaxed">{item.description}</p>
                            {item.activities && item.activities.length > 0 && (
                              <div className="space-y-1.5 pt-2 border-t border-dashed border-[#1D2D2E]/20">
                                <span className="text-[11px] font-black text-[#1D2D2E] block">أبرز الأنشطة:</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {item.activities.map((act, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-[#1D2D2E]">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                      <span>{act}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Included & Excluded Services */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Included */}
              <div className="bg-[#A5F3CF] p-6 rounded-[24px] border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-4">
                <h4 className="text-sm font-black text-[#1D2D2E] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1D2D2E]" />
                  <span>الخدمات المشمولة في الباقة</span>
                </h4>
                <ul className="space-y-2.5 text-xs font-bold text-[#1D2D2E]">
                  {trip.includedServices && trip.includedServices.length > 0 ? (
                    trip.includedServices.map((srv, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#1D2D2E] shrink-0 mt-1.5"></span>
                        <span>{srv}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-[#1D2D2E]/70">الإقامة والنقل والمرشد السياحي مشمولين.</li>
                  )}
                </ul>
              </div>

              {/* Excluded */}
              <div className="bg-rose-50 p-6 rounded-[24px] border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-4">
                <h4 className="text-sm font-black text-rose-900 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>الخدمات غير المشمولة</span>
                </h4>
                <ul className="space-y-2.5 text-xs font-bold text-rose-950">
                  {trip.excludedServices && trip.excludedServices.length > 0 ? (
                    trip.excludedServices.map((srv, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0 mt-1.5"></span>
                        <span>{srv}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-rose-800">المصاريف الشخصية والطلبات الفردية.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Departure Info & Important Notes */}
            {trip.departureInfo && (
              <div className="p-6 rounded-[24px] bg-[#FFD95A] border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-2">
                <h4 className="text-xs font-black text-[#1D2D2E] flex items-center gap-2">
                  <Bus className="w-4 h-4 text-[#1D2D2E]" />
                  <span>معلومات ومواعيد الانطلاق 🚌</span>
                </h4>
                <p className="text-xs font-bold text-[#1D2D2E] leading-relaxed">
                  {trip.departureInfo}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Booking Card (1 Col Sticky) */}
          <div className="space-y-6">
            <div className="sticky top-28 bg-white p-6 sm:p-8 rounded-[28px] border-3 border-[#1D2D2E] shadow-[6px_6px_0px_#1D2D2E] space-y-6">
              <div className="space-y-1">
                <span className="text-xs text-[#1D2D2E]/70 font-black block">سعر التذكرة للفرد الواحد</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#1D2D2E]">
                    {trip.price.toLocaleString()}
                  </span>
                  <span className="text-sm font-black text-[#FF7E47]">{trip.currency || 'د.ع'}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] space-y-2 text-xs font-bold text-[#1D2D2E]">
                <div className="flex items-center justify-between">
                  <span>الوجهة:</span>
                  <span className="font-black text-[#1D2D2E]">{trip.destination}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>تاريخ الانطلاق:</span>
                  <span className="font-black text-[#1D2D2E]">{trip.startDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>المقاعد الشاغرة:</span>
                  <span className={`font-black ${isFull ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {isFull ? 'اكتملت' : `${remainingSeats} مقعد`}
                  </span>
                </div>
              </div>

              <button
                id="sidebar-book-now-btn"
                disabled={isFull}
                onClick={() => setIsBookingModalOpen(true)}
                className={`w-full py-4 px-6 rounded-2xl text-xs sm:text-sm font-black border-2 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 ${
                  isGuest || !isLoggedIn
                    ? 'bg-[#FFD95A] text-[#1D2D2E] hover:bg-[#fbd34c]'
                    : 'bg-[#FF7E47] text-white hover:bg-[#e66a35]'
                }`}
              >
                {isFull ? (
                  'عذراً، المقاعد مكتملة'
                ) : isGuest || !isLoggedIn ? (
                  <>
                    <Lock className="w-4 h-4 text-[#FF7E47]" />
                    <span>طلب حجز المقعد (يتطلب حساب) 🔒</span>
                  </>
                ) : (
                  <span>احجز مقعدك الآن مباشرة 🎟️</span>
                )}
              </button>

              {isGuest && (
                <div className="p-3 rounded-xl bg-[#FDFFF5] border border-[#1D2D2E]/30 text-[11px] font-bold text-gray-700 text-center">
                  👁️ أنت في وضع تصفح الرحلات كزائر. لإتمام الحجز وتثبيت التذاكر اضغط على الزر لإنشاء حسابك.
                </div>
              )}

              <div className="pt-4 border-t-2 border-dashed border-[#1D2D2E]/20 space-y-3">
                <a
                  href={`https://wa.me/9647701234567?text=${encodeURIComponent(`مرحباً سما البارقة، أستفسر عن رحلة (${trip.title})`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl border-2 border-[#1D2D2E] text-[#1D2D2E] bg-[#A5F3CF] hover:bg-[#92efc1] text-xs font-black shadow-[2px_2px_0px_#1D2D2E] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#1D2D2E]" />
                  <span>استفسار سريع عبر واتساب</span>
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-[#1D2D2E]/70">
                <ShieldCheck className="w-4 h-4 text-[#FF7E47]" />
                <span>حجز مضمون وتأكيد فوري من الشركة</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />

      <BookingModal
        trip={trip}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}
