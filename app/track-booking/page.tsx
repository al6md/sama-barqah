'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Booking, BookingStatus } from '@/lib/db';
import { BookingVoucherModal } from '@/components/BookingVoucherModal';
import {
  Search,
  CheckCircle2,
  Clock,
  PhoneCall,
  ShieldCheck,
  FileText,
  Printer,
  Compass,
  AlertCircle,
  ArrowRight,
  MessageSquare,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  LogIn,
  UserCheck
} from 'lucide-react';

function BookingStatusSteps({ status }: { status: BookingStatus }) {
  const steps = [
    { title: 'استلام الطلب', desc: 'تم استلام طلبكم في النظام', key: '1' },
    { title: 'التدقيق والمراجعة', desc: 'مراجعة بيانات المقاعد', key: '2' },
    { title: 'التواصل والتنسيق', desc: 'تم التواصل لتأكيد التفاصيل', key: '3' },
    { title: 'حجز مؤكد ومعتمد', desc: 'تم تثبيت المقاعد رسمياً', key: '4' },
    { title: 'اكتمال الرحلة', desc: 'تم إتمام البرنامج السياحي', key: '5' }
  ];

  let currentStepIdx = 0;
  let isCanceled = status === 'ملغي';

  switch (status) {
    case 'جديد':
      currentStepIdx = 1;
      break;
    case 'قيد المراجعة':
      currentStepIdx = 2;
      break;
    case 'تم التواصل مع العميل':
      currentStepIdx = 3;
      break;
    case 'مؤكد':
      currentStepIdx = 4;
      break;
    case 'مكتمل':
      currentStepIdx = 5;
      break;
    case 'ملغي':
      currentStepIdx = 0;
      break;
    default:
      currentStepIdx = 1;
  }

  if (isCanceled) {
    return (
      <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 text-rose-800 text-xs font-bold flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <div className="font-black text-sm text-rose-900">حالة الحجز: تم إلغاء هذا الحجز</div>
            <div className="text-[11px] text-rose-700">إذا كان لديك استفسار، يرجى التواصل مع إدارة الشركة.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="relative flex items-center justify-between max-w-2xl mx-auto">
        {/* Background track line */}
        <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-gray-200 -translate-y-1/2 -z-0 rounded-full"></div>
        {/* Active track line */}
        <div
          className="absolute top-1/2 right-4 h-1.5 bg-[#10B981] -translate-y-1/2 -z-0 rounded-full transition-all duration-500"
          style={{
            width: `${Math.max(0, Math.min(100, ((currentStepIdx - 1) / (steps.length - 1)) * 100))}%`
          }}
        ></div>

        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum <= currentStepIdx;
          const isCurrent = stepNum === currentStepIdx;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-black text-xs sm:text-sm border-2 transition-all shadow-sm ${
                  isDone
                    ? 'bg-[#10B981] text-white border-[#1D2D2E]'
                    : 'bg-white text-gray-400 border-gray-300'
                } ${isCurrent ? 'ring-4 ring-[#A5F3CF] scale-110' : ''}`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-black mt-2 text-center max-w-[80px] leading-tight ${
                  isCurrent
                    ? 'text-[#1D2D2E]'
                    : isDone
                    ? 'text-emerald-800'
                    : 'text-gray-400'
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrackBookingContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || searchParams.get('code') || searchParams.get('phone') || '';
  const { user, isLoggedIn, isGuest, userBookings, openAuthModal } = useUserAuth();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Voucher preview modal state
  const [voucherBooking, setVoucherBooking] = useState<Booking | null>(null);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setErrorMsg('يرجى كتابة رقم الحجز (مثال: SB-2026-0001) أو رقم هاتفك للبحث.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/bookings/track?query=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (data.success && data.bookings) {
        setResults(data.bookings);
      } else {
        setResults([]);
        setErrorMsg(data.error || 'لم نتمكن من العثور على أي حجز مطابق. تأكد من الرقم وحاول مجدداً.');
      }
    } catch (err) {
      setResults([]);
      setErrorMsg('حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (!initialQuery) return;

    async function executeInitialSearch() {
      setLoading(true);
      setErrorMsg(null);
      setSearched(true);
      try {
        const res = await fetch(`/api/bookings/track?query=${encodeURIComponent(initialQuery.trim())}`);
        const data = await res.json();
        if (!isMounted) return;
        if (data.success && data.bookings) {
          setResults(data.bookings);
        } else {
          setResults([]);
          setErrorMsg(data.error || 'لم نتمكن من العثور على أي حجز مطابق. تأكد من الرقم وحاول مجدداً.');
        }
      } catch (err) {
        if (!isMounted) return;
        setResults([]);
        setErrorMsg('حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة مرة أخرى.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    executeInitialSearch();

    return () => {
      isMounted = false;
    };
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'مؤكد':
      case 'مكتمل':
        return { text: 'حجز مؤكد ومعتمد ✅', bg: 'bg-emerald-50 text-emerald-800 border-emerald-500' };
      case 'قيد المراجعة':
        return { text: 'قيد التدقيق والمراجعة 📋', bg: 'bg-amber-50 text-amber-800 border-amber-500' };
      case 'تم التواصل مع العميل':
        return { text: 'تم التواصل والتنسيق 📞', bg: 'bg-blue-50 text-blue-800 border-blue-500' };
      case 'ملغي':
        return { text: 'حجز ملغي ❌', bg: 'bg-rose-50 text-rose-800 border-rose-500' };
      case 'جديد':
      default:
        return { text: 'طلب جديد مسجل 📥', bg: 'bg-amber-50 text-amber-800 border-amber-500' };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFFF5] text-[#1D2D2E]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* Page Banner Header */}
        <div className="text-center space-y-3 bg-white border-3 border-[#1D2D2E] rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#1D2D2E]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFD95A] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-xs font-black">
            <Search className="w-3.5 h-3.5 text-[#1D2D2E]" />
            <span>خدمة الاستعلام والمتابعة الذكية</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#1D2D2E] tracking-tight">
            متابعة وتدقيق حالة الحجز 🧳
          </h1>

          <p className="text-xs sm:text-sm font-bold text-gray-600 max-w-xl mx-auto leading-relaxed">
            أدخل رقم الحجز المرجعي (مثل <span className="font-mono text-[#1D2D2E] bg-gray-100 px-1.5 py-0.5 rounded border">SB-2026-0001</span>) أو رقم الهاتف المسجل بالحجز للاطلاع على حالة الحجز اللحظية وطباعة سند الحجز الرسمي.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-4 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="أدخل رقم الحجز (SB-2026-XXXX) أو رقم هاتفك..."
                className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-white border-2 border-[#1D2D2E] text-sm font-bold shadow-[3px_3px_0px_#1D2D2E] focus:outline-none focus:ring-2 focus:ring-[#FF7E47] focus:bg-[#FDFFF5]"
              />
              <Search className="w-5 h-5 text-gray-400 absolute right-3.5 top-4" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-2xl bg-[#FF7E47] hover:bg-[#ff6c2f] text-white border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all hover:translate-x-0.5 hover:translate-y-0.5 shrink-0"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>استعلام ومتابعة 🔍</span>
            </button>
          </form>

          {/* Quick Examples */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-bold text-gray-500">
            <span>نماذج بحث سريعة للتجربة:</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('SB-2026-0001');
                performSearch('SB-2026-0001');
              }}
              className="px-2 py-0.5 rounded-lg bg-gray-100 border border-gray-300 hover:bg-[#A5F3CF] hover:border-[#1D2D2E] text-[#1D2D2E] font-mono font-black transition-colors"
            >
              SB-2026-0001
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('SB-2026-0002');
                performSearch('SB-2026-0002');
              }}
              className="px-2 py-0.5 rounded-lg bg-gray-100 border border-gray-300 hover:bg-[#FFD95A] hover:border-[#1D2D2E] text-[#1D2D2E] font-mono font-black transition-colors"
            >
              SB-2026-0002
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('07782528287');
                performSearch('07782528287');
              }}
              className="px-2 py-0.5 rounded-lg bg-gray-100 border border-gray-300 hover:bg-orange-100 hover:border-[#1D2D2E] text-[#1D2D2E] font-mono font-black transition-colors"
            >
              0778 252 8287
            </button>
          </div>
        </div>

        {/* User Quick Switcher Banner */}
        {!isLoggedIn && (
          <div className="p-4 rounded-2xl bg-white border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-right">
              <div className="w-10 h-10 rounded-xl bg-[#FFD95A] border-2 border-[#1D2D2E] flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5 text-[#1D2D2E]" />
              </div>
              <div>
                <strong className="text-xs font-black text-[#1D2D2E] block">
                  هل لديك حساب أو ترغب في الدخول كزائر؟
                </strong>
                <span className="text-[11px] font-bold text-gray-500">
                  سجل دخولك أو ادخل كزائر للاطلاع على جميع حجوزاتك المسجلة تلقائياً في مكان واحد.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openAuthModal('guest')}
                className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1D2D2E] border-2 border-[#1D2D2E] text-xs font-black cursor-pointer"
              >
                الدخول كزائر 👤
              </button>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-4 py-1.5 rounded-xl bg-[#A5F3CF] hover:bg-[#8defbf] text-[#1D2D2E] border-2 border-[#1D2D2E] text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>تسجيل الدخول</span>
              </button>
            </div>
          </div>
        )}

        {/* Logged in User's Quick Bookings */}
        {isLoggedIn && userBookings.length > 0 && !searched && (
          <div className="space-y-3">
            <h2 className="text-sm font-black text-[#1D2D2E] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#FF7E47]" />
              حجوزاتك المسجلة ({userBookings.length}):
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userBookings.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    setSearchQuery(b.id);
                    performSearch(b.id);
                  }}
                  className="p-4 bg-white rounded-2xl border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-[#FF7E47]">#{b.id}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${getStatusBadge(b.status).bg}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#1D2D2E] line-clamp-1">{b.tripTitle}</div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-bold border-t border-gray-100 pt-2">
                    <span>{b.travelerCount} مسافرين</span>
                    <span className="text-[#1D2D2E] font-black">{b.totalPrice.toLocaleString()} {b.currency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searched && (
          <div className="space-y-6">
            {errorMsg && (
              <div className="p-6 rounded-3xl bg-white border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] text-center space-y-3 animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-400 text-amber-700 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[#1D2D2E]">لم يتم العثور على حجز</h3>
                <p className="text-xs font-bold text-gray-600 max-w-md mx-auto">{errorMsg}</p>
                <div className="pt-2">
                  <a
                    href="https://wa.me/9647782528287"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A5F3CF] text-[#1D2D2E] border-2 border-[#1D2D2E] font-black text-xs shadow-[2px_2px_0px_#1D2D2E]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>تواصل معنا عبر واتساب للمساعدة 07782528287</span>
                  </a>
                </div>
              </div>
            )}

            {results.map((booking) => {
              const badge = getStatusBadge(booking.status);
              const formattedDate = new Date(booking.createdAt).toLocaleDateString('ar-IQ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl border-3 border-[#1D2D2E] shadow-[8px_8px_0px_#1D2D2E] overflow-hidden space-y-6 p-6 sm:p-8 animate-in zoom-in-95 duration-300"
                >
                  {/* Top Bar: Booking ID & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#1D2D2E] pb-4">
                    <div>
                      <span className="text-[11px] font-bold text-gray-500 block">الرقم المرجعي للحجز</span>
                      <span className="text-xl sm:text-2xl font-black font-mono text-[#1D2D2E]">
                        #{booking.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-full border-2 ${badge.bg}`}>
                        {badge.text}
                      </span>

                      <button
                        type="button"
                        onClick={() => setVoucherBooking(booking)}
                        className="px-4 py-2 rounded-xl bg-[#FFD95A] hover:bg-[#fcd34d] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-xs font-black flex items-center gap-1.5 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                      >
                        <FileText className="w-4 h-4 text-[#FF7E47]" />
                        <span>سند الحجز الرسمي 📄</span>
                      </button>
                    </div>
                  </div>

                  {/* Visual Tracker Bar */}
                  <div className="p-4 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#1D2D2E] flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#FF7E47]" />
                        مسار تقدم وتحديثات الحجز
                      </span>
                      <span className="text-[11px] text-gray-500 font-bold">
                        تاريخ التسجيل: {formattedDate}
                      </span>
                    </div>

                    <BookingStatusSteps status={booking.status} />
                  </div>

                  {/* Trip and Customer Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Trip Info Card */}
                    <div className="p-4 rounded-2xl border-2 border-[#1D2D2E] bg-white space-y-2.5 shadow-[2px_2px_0px_#1D2D2E]">
                      <h3 className="text-xs font-black text-[#FF7E47] flex items-center gap-1.5 border-b border-gray-100 pb-2">
                        <MapPin className="w-4 h-4 text-[#FF7E47]" />
                        تفاصيل الرحلة والوجهة
                      </h3>
                      <div className="space-y-1.5 text-xs font-bold">
                        <div className="flex justify-between">
                          <span className="text-gray-500">اسم الرحلة:</span>
                          <strong className="text-[#1D2D2E] text-left pr-2">{booking.tripTitle}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">الوجهة:</span>
                          <span className="text-emerald-800">{booking.destination}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">تاريخ الرحلة:</span>
                          <span className="font-mono text-[#1D2D2E]">{booking.tripDate || 'حسب الموعد المحدد'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">نقطة الانطلاق:</span>
                          <span className="text-gray-700">كربلاء - نهاية شارع الاسكان - محلات ملعب القديم</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info Card */}
                    <div className="p-4 rounded-2xl border-2 border-[#1D2D2E] bg-white space-y-2.5 shadow-[2px_2px_0px_#1D2D2E]">
                      <h3 className="text-xs font-black text-[#FF7E47] flex items-center gap-1.5 border-b border-gray-100 pb-2">
                        <Users className="w-4 h-4 text-[#FF7E47]" />
                        بيانات المسافر الرئيسي والمالية
                      </h3>
                      <div className="space-y-1.5 text-xs font-bold">
                        <div className="flex justify-between">
                          <span className="text-gray-500">اسم العميل:</span>
                          <strong className="text-[#1D2D2E]">{booking.customerName}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">رقم الهاتف:</span>
                          <span dir="ltr" className="font-mono text-[#1D2D2E]">{booking.customerPhone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">عدد المسافرين:</span>
                          <span className="font-mono text-[#1D2D2E]">{booking.travelerCount} مسافرين</span>
                        </div>
                        <div className="flex justify-between border-t border-dashed border-gray-200 pt-1.5">
                          <span className="text-gray-500">إجمالي المبلغ:</span>
                          <strong className="font-mono text-[#FF7E47] text-sm">
                            {booking.totalPrice.toLocaleString()} {booking.currency}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status History Timeline */}
                  {booking.statusHistory && booking.statusHistory.length > 0 && (
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
                      <strong className="text-xs font-black text-[#1D2D2E] block">
                        سجل التحديثات والملاحظات من إدارة الشركة:
                      </strong>
                      <div className="space-y-2">
                        {booking.statusHistory.map((historyItem: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs bg-white p-2.5 rounded-xl border border-gray-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <strong className="font-black text-[#1D2D2E]">{historyItem.status}</strong>
                                <span className="text-[10px] text-gray-400 font-mono">
                                  {new Date(historyItem.changedAt).toLocaleDateString('ar-IQ', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              {historyItem.note && (
                                <p className="text-gray-600 mt-0.5">{historyItem.note}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions & WhatsApp Support */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-gray-200">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setVoucherBooking(booking)}
                        className="px-4 py-2.5 rounded-xl bg-[#FF7E47] hover:bg-[#ff6c2f] text-white border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-xs font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                        <span>معاينة وطباعة سند الحجز 🖨️</span>
                      </button>

                      <a
                        href={`https://wa.me/9647782528287?text=${encodeURIComponent(
                          `مرحباً شركة سما البارقة، أستفسر عن حالة حجزي رقم [${booking.id}] باسم [${booking.customerName}] لرحلة [${booking.tripTitle}].`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-[#A5F3CF] hover:bg-[#8feebf] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-xs font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>استفسار واتساب 💬</span>
                      </a>
                    </div>

                    <a
                      href="tel:07782528287"
                      className="text-xs font-bold text-gray-600 hover:text-[#1D2D2E] flex items-center gap-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#FF7E47]" />
                      <span>اتصال بالإدارة: 07782528287</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Travel Instructions FAQ */}
        <div className="p-6 bg-white border-2 border-[#1D2D2E] rounded-3xl shadow-[4px_4px_0px_#1D2D2E] space-y-3">
          <h3 className="text-sm font-black text-[#1D2D2E] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#FF7E47]" />
            تعليمات وإرشادات مهمة للمسافرين
          </h3>
          <ul className="text-xs font-bold text-gray-600 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>يتم تأكيد وتثبيت الحجز بعد تواصل فريق العمل معكم وتنسيق تسديد الدفعة أو تثبيت المقاعد.</li>
            <li>يجب إبراز سند الحجز الإلكتروني أو المطبوع عند الصعود للباص السياحي.</li>
            <li>لأي استفسار أو تعديل في بيانات الحجز، يمكنكم التواصل المباشر مع رقم الحجوزات 07782528287.</li>
          </ul>
        </div>
      </main>

      {/* Official Voucher Preview Modal */}
      {voucherBooking && (
        <BookingVoucherModal
          booking={voucherBooking}
          onClose={() => setVoucherBooking(null)}
        />
      )}

      <Footer />
    </div>
  );
}

export default function TrackBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFFF5] flex items-center justify-center">جاري التحميل...</div>}>
      <TrackBookingContent />
    </Suspense>
  );
}
