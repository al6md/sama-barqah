'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trip } from '@/lib/db';
import { X, CheckCircle, AlertCircle, Loader2, Calendar, Users, MapPin, Phone, User, Mail, MessageSquare, ShieldCheck, ArrowLeft } from 'lucide-react';

interface BookingModalProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ trip, isOpen, onClose }: BookingModalProps) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [travelerCount, setTravelerCount] = useState<number>(1);
  const [preferredContactMethod, setPreferredContactMethod] = useState<'whatsapp' | 'phone' | 'email'>('whatsapp');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !trip) return null;

  const remainingSeats = Math.max(0, trip.maxSeats - trip.bookedSeats);
  const pricePerPerson = trip.price;
  const totalPrice = pricePerPerson * travelerCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!customerName.trim() || customerName.trim().length < 3) {
      setErrorMsg('يرجى إدخال الاسم الكامل الثلاثي.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 9) {
      setErrorMsg('يرجى إدخال رقم هاتف صحيح للتواصل (مثل 07701234567).');
      return;
    }

    if (travelerCount > remainingSeats) {
      setErrorMsg(`عذراً، المقاعد المتبقية في هذه الرحلة (${remainingSeats}) فقط.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: trip.id,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim() || undefined,
          travelerCount,
          preferredContactMethod,
          notes: notes.trim() || undefined
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'حدث خطأ أثناء إرسال طلب الحجز، يرجى المحاولة مرة أخرى.');
        setIsSubmitting(false);
        return;
      }

      // Redirect to success page with booking details in query params
      const booking = data.booking;
      const successUrl = `/booking/success?id=${encodeURIComponent(booking.id)}&tripTitle=${encodeURIComponent(booking.tripTitle)}&name=${encodeURIComponent(booking.customerName)}&phone=${encodeURIComponent(booking.customerPhone)}&count=${booking.travelerCount}&total=${booking.totalPrice}&date=${encodeURIComponent(booking.tripDate)}&waUrl=${encodeURIComponent(data.whatsappRedirectUrl || '')}`;

      onClose();
      router.push(successUrl);
    } catch (err: any) {
      setErrorMsg('حدث خطأ في الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="booking-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D2D2E]/70 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="booking-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-[28px] shadow-[8px_8px_0px_#1D2D2E] border-3 border-[#1D2D2E] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with trip preview banner */}
        <div className="relative bg-[#FFD95A] text-[#1D2D2E] border-b-3 border-[#1D2D2E] p-6 sm:p-7">
          <button
            id="btn-close-booking-modal"
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl bg-white border-2 border-[#1D2D2E] text-[#1D2D2E] hover:bg-[#FF7E47] hover:text-white shadow-[2px_2px_0px_#1D2D2E] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-2">
            <span className="bg-white px-2.5 py-0.5 rounded-full border border-[#1D2D2E] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF7E47]" />
              <span>حجز رحلة مؤكد ومباشر</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#1D2D2E] leading-snug">
            {trip.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-bold text-[#1D2D2E]">
            <span className="flex items-center gap-1 bg-white/70 px-2 py-0.5 rounded-lg border border-[#1D2D2E]">
              <MapPin className="w-3.5 h-3.5 text-[#FF7E47]" />
              <span>الوجهة: {trip.destination}</span>
            </span>
            <span className="flex items-center gap-1 bg-white/70 px-2 py-0.5 rounded-lg border border-[#1D2D2E]">
              <Calendar className="w-3.5 h-3.5 text-[#4CC9FE]" />
              <span>تاريخ الانطلاق: {trip.startDate}</span>
            </span>
            <span className="flex items-center gap-1 bg-[#A5F3CF] px-2 py-0.5 rounded-lg border border-[#1D2D2E]">
              <Users className="w-3.5 h-3.5 text-[#1D2D2E]" />
              <span>المتبقي: {remainingSeats} مقاعد</span>
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 bg-[#FDFFF5]">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-100 border-2 border-rose-600 text-rose-900 text-xs font-bold flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-black block">تنبيه</span>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div>
              <label htmlFor="customer-name-input" className="block text-xs font-black text-[#1D2D2E] mb-1.5">
                الاسم الكامل الثلاثي <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="customer-name-input"
                  type="text"
                  required
                  placeholder="مثال: علي كمال عبد الله"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white border-2 border-[#1D2D2E] text-[#1D2D2E] font-bold text-xs sm:text-sm focus:outline-none shadow-[2px_2px_0px_#1D2D2E]"
                />
                <User className="w-4 h-4 text-[#1D2D2E] absolute right-3.5 top-3.5" />
              </div>
            </div>

            {/* Customer Phone */}
            <div>
              <label htmlFor="customer-phone-input" className="block text-xs font-black text-[#1D2D2E] mb-1.5">
                رقم الهاتف (واتساب) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="customer-phone-input"
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="0770 123 4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white border-2 border-[#1D2D2E] text-[#1D2D2E] font-bold text-xs sm:text-sm focus:outline-none shadow-[2px_2px_0px_#1D2D2E] text-right"
                />
                <Phone className="w-4 h-4 text-[#1D2D2E] absolute right-3.5 top-3.5" />
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label htmlFor="customer-email-input" className="block text-xs font-black text-[#1D2D2E] mb-1.5">
                البريد الإلكتروني <span className="text-slate-500 text-[10px] font-normal">(اختياري)</span>
              </label>
              <div className="relative">
                <input
                  id="customer-email-input"
                  type="email"
                  placeholder="your.email@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white border-2 border-[#1D2D2E] text-[#1D2D2E] font-bold text-xs sm:text-sm focus:outline-none shadow-[2px_2px_0px_#1D2D2E]"
                />
                <Mail className="w-4 h-4 text-[#1D2D2E] absolute right-3.5 top-3.5" />
              </div>
            </div>

            {/* Traveler Count */}
            <div>
              <label htmlFor="traveler-count-input" className="block text-xs font-black text-[#1D2D2E] mb-1.5">
                عدد المسافرين <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <select
                  id="traveler-count-input"
                  value={travelerCount}
                  onChange={(e) => setTravelerCount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white border-2 border-[#1D2D2E] text-[#1D2D2E] font-bold text-xs sm:text-sm focus:outline-none shadow-[2px_2px_0px_#1D2D2E] appearance-none cursor-pointer"
                >
                  {Array.from({ length: Math.min(10, remainingSeats || 1) }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'مسافر (شخص واحد)' : n === 2 ? 'مسافران (شخصين)' : `${n} مسافرين`}
                    </option>
                  ))}
                </select>
                <Users className="w-4 h-4 text-[#1D2D2E] absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Preferred Contact Method */}
          <div>
            <label className="block text-xs font-black text-[#1D2D2E] mb-2">
              وسيلة التواصل المفضلة لتأكيد الحجز
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                id="contact-method-whatsapp"
                onClick={() => setPreferredContactMethod('whatsapp')}
                className={`py-2 px-3 rounded-xl border-2 border-[#1D2D2E] text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  preferredContactMethod === 'whatsapp'
                    ? 'bg-[#A5F3CF] text-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E]'
                    : 'bg-white text-[#1D2D2E] hover:bg-[#FFD95A]'
                }`}
              >
                <span>واتساب 💬</span>
              </button>

              <button
                type="button"
                id="contact-method-phone"
                onClick={() => setPreferredContactMethod('phone')}
                className={`py-2 px-3 rounded-xl border-2 border-[#1D2D2E] text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  preferredContactMethod === 'phone'
                    ? 'bg-[#FFD95A] text-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E]'
                    : 'bg-white text-[#1D2D2E] hover:bg-[#FFD95A]'
                }`}
              >
                <span>مكالمة هاتفية 📞</span>
              </button>

              <button
                type="button"
                id="contact-method-email"
                onClick={() => setPreferredContactMethod('email')}
                className={`py-2 px-3 rounded-xl border-2 border-[#1D2D2E] text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  preferredContactMethod === 'email'
                    ? 'bg-[#4CC9FE] text-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E]'
                    : 'bg-white text-[#1D2D2E] hover:bg-[#4CC9FE]/30'
                }`}
              >
                <span>البريد الإلكتروني ✉️</span>
              </button>
            </div>
          </div>

          {/* Special Requests / Notes */}
          <div>
            <label htmlFor="booking-notes-input" className="block text-xs font-black text-[#1D2D2E] mb-1.5">
              ملاحظات أو طلبات خاصة <span className="text-slate-500 text-[10px] font-normal">(اختياري)</span>
            </label>
            <textarea
              id="booking-notes-input"
              rows={2}
              placeholder="مثال: نفضل مقاعد في الأمام، عائلة مع أطفال..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-[#1D2D2E] text-[#1D2D2E] font-bold text-xs sm:text-sm focus:outline-none shadow-[2px_2px_0px_#1D2D2E] resize-none"
            ></textarea>
          </div>

          {/* Live Booking Summary Card */}
          <div className="p-4 rounded-[20px] bg-white border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] space-y-2">
            <h4 className="text-xs font-black text-[#1D2D2E] mb-2">ملخص الحجز المالي:</h4>
            <div className="flex items-center justify-between text-xs font-bold text-[#1D2D2E]">
              <span>سعر التذكرة للشخص:</span>
              <span>{pricePerPerson.toLocaleString()} {trip.currency}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-[#1D2D2E]">
              <span>عدد الأشخاص:</span>
              <span>{travelerCount} مسافر</span>
            </div>
            <div className="pt-2 border-t-2 border-dashed border-[#1D2D2E]/20 flex items-center justify-between">
              <span className="text-sm font-black text-[#1D2D2E]">المبلغ الإجمالي المستحق:</span>
              <span className="text-lg font-black text-[#FF7E47]">
                {totalPrice.toLocaleString()} {trip.currency || 'د.ع'}
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              id="btn-submit-booking-confirm"
              type="submit"
              disabled={isSubmitting || remainingSeats <= 0}
              className="w-full py-3.5 px-6 rounded-2xl text-sm font-black text-white bg-[#FF7E47] hover:bg-[#e66a35] border-2 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري إرسال طلب الحجز وتأكيد المقاعد...</span>
                </>
              ) : (
                <>
                  <span>تأكيد وإرسال طلب الحجز 🚀</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] font-bold text-[#1D2D2E]/60 text-center mt-2.5">
              لن يتم خصم أي مبالغ الآن، سنتواصل معكم لتأكيد تفاصيل الدفع ونقاط الانطلاق.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
