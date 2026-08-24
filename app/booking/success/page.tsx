'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CheckCircle2, MessageSquare, Printer, ArrowRight, ShieldCheck, Calendar, Users, Phone, MapPin, Compass } from 'lucide-react';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || 'SB-2026-0001';
  const tripTitle = searchParams.get('tripTitle') || 'رحلة سياحية';
  const customerName = searchParams.get('name') || 'العميل الكريم';
  const customerPhone = searchParams.get('phone') || '';
  const travelerCount = searchParams.get('count') || '1';
  const totalPrice = searchParams.get('total') || '0';
  const tripDate = searchParams.get('date') || '';
  const waUrl = searchParams.get('waUrl') || '';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFFF5] text-[#1D2D2E]">
      <div className="no-print">
        <Navbar />
      </div>

      <main className="flex-1 py-32 max-w-3xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-white rounded-[28px] border-3 border-[#1D2D2E] shadow-[8px_8px_0px_#1D2D2E] p-6 sm:p-10 space-y-8 animate-in zoom-in-95 duration-300">
          {/* Header Success State */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-[#A5F3CF] text-[#1D2D2E] border-3 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-black text-[#1D2D2E] bg-[#FFD95A] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              تم استلام طلب الحجز بنجاح 🎉
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-[#1D2D2E]">
              سنتواصل معك قريباً لتأكيد الحجز ✅
            </h1>

            <p className="text-xs sm:text-sm font-bold text-[#1D2D2E]/80 max-w-md mx-auto">
              شكراً لاختياركم <strong className="text-[#1D2D2E]">سما البارقة للسفر والسياحة</strong>. تم تسجيل طلبكم وسيقوم فريق الحجوزات بالتواصل معكم لتثبيت المقاعد.
            </p>
          </div>

          {/* Reference ID Card */}
          <div className="p-6 rounded-[24px] bg-[#FF7E47] text-white border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] text-center space-y-1">
            <span className="text-xs text-white font-black uppercase tracking-widest block">
              رقم الحجز المرجعي (Booking Reference)
            </span>
            <div className="text-3xl sm:text-4xl font-mono font-black text-white tracking-wider py-1">
              {id}
            </div>
            <span className="text-[11px] text-white/90 font-bold">
              يرجى الاحتفاظ بهذا الرقم لمتابعة حالة الحجز مع الشركة
            </span>
          </div>

          {/* Printable Voucher Breakdown */}
          <div className="p-6 rounded-[24px] bg-[#FDFFF5] border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-dashed border-[#1D2D2E]/20 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#FF7E47]" />
                <span className="text-xs font-black text-[#1D2D2E]">تفاصيل وسند حجز الرحلة</span>
              </div>
              <span className="text-[11px] text-[#1D2D2E]/70 font-bold">سما البارقة للسفر والسياحة</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
              <div>
                <span className="text-[#1D2D2E]/60 block mb-0.5">اسم الرحلة:</span>
                <span className="font-black text-[#1D2D2E]">{tripTitle}</span>
              </div>

              <div>
                <span className="text-[#1D2D2E]/60 block mb-0.5">اسم العميل:</span>
                <span className="font-black text-[#1D2D2E]">{customerName}</span>
              </div>

              <div>
                <span className="text-[#1D2D2E]/60 block mb-0.5">رقم الهاتف:</span>
                <span className="font-black text-[#1D2D2E]" dir="ltr">{customerPhone}</span>
              </div>

              <div>
                <span className="text-[#1D2D2E]/60 block mb-0.5">تاريخ الرحلة:</span>
                <span className="font-black text-[#1D2D2E]">{tripDate || 'حسب الجدول المعلن'}</span>
              </div>

              <div>
                <span className="text-[#1D2D2E]/60 block mb-0.5">عدد المسافرين:</span>
                <span className="font-black text-[#1D2D2E]">{travelerCount} شخص</span>
              </div>

              <div>
                <span className="text-[#1D2D2E]/60 block mb-0.5">المبلغ الإجمالي المتوقع:</span>
                <span className="font-black text-[#FF7E47] text-sm">
                  {Number(totalPrice).toLocaleString()} د.ع
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 no-print">
            {waUrl && (
              <a
                id="btn-success-whatsapp"
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3.5 px-6 rounded-2xl bg-[#A5F3CF] hover:bg-[#92efc1] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#1D2D2E]" />
                <span>إرسال تأكيد الحجز فورا عبر واتساب 💬</span>
              </a>
            )}

            <button
              id="btn-print-voucher"
              onClick={handlePrint}
              className="py-3.5 px-6 rounded-2xl bg-[#FFD95A] hover:bg-[#ffe07b] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#1D2D2E]" />
              <span>طباعة سند الحجز 🖨️</span>
            </button>

            <Link
              id="btn-return-home"
              href="/"
              className="py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-100 text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>الرئيسية</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFFF5]"></div>}>
      <BookingSuccessContent />
    </Suspense>
  );
}
