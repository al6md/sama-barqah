'use client';

import React from 'react';
import { Booking } from '@/lib/db';
import { SamaLogo } from '@/components/SamaLogo';
import { Printer, X, CheckCircle2, Phone, Calendar, User, MapPin, ShieldCheck, QrCode } from 'lucide-react';

interface BookingVoucherModalProps {
  booking: Booking;
  onClose: () => void;
}

export function BookingVoucherModal({ booking, onClose }: BookingVoucherModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(booking.createdAt).toLocaleDateString('ar-IQ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getStatusBadge = () => {
    switch (booking.status) {
      case 'مؤكد':
      case 'مكتمل':
        return { text: 'حجز مؤكد ومعتمد', bg: 'bg-emerald-50 text-emerald-800 border-emerald-500', color: '#059669' };
      case 'قيد المراجعة':
      case 'تم التواصل مع العميل':
        return { text: 'قيد المراجعة والتدقيق', bg: 'bg-amber-50 text-amber-800 border-amber-500', color: '#D97706' };
      case 'ملغي':
        return { text: 'ملغى', bg: 'bg-rose-50 text-rose-800 border-rose-500', color: '#E11D48' };
      case 'جديد':
      default:
        return { text: 'حجز مسجل (جديد)', bg: 'bg-blue-50 text-blue-800 border-blue-500', color: '#0284C7' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto modal-backdrop"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full my-auto bg-white rounded-3xl border-3 border-[#1D2D2E] shadow-[8px_8px_0px_#1D2D2E] overflow-hidden flex flex-col max-h-[96vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Screen Controls Header (Hidden on Print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-[#FFD95A] border-b-3 border-[#1D2D2E]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black bg-white text-[#1D2D2E] px-3 py-1 rounded-full border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
              سند تأكيد حجز رسمي 📄
            </span>
            <span className="text-sm font-black text-[#1D2D2E]">
              رقم #{booking.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="px-4 py-2 rounded-xl bg-[#FF7E47] hover:bg-[#ff6c2f] text-white border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-xs font-black flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة السند الرسمي (A4)</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-xl bg-white hover:bg-[#FDFFF5] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] cursor-pointer"
              title="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container for Screen Preview */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-gray-50 flex justify-center">
          {/* THE PRINTABLE OFFICIAL VOUCHER (Clean A4 Corporate Layout) */}
          <div
            id="printable-voucher"
            className="w-full max-w-[760px] bg-white border-2 border-[#1D2D2E]/20 p-6 sm:p-8 rounded-2xl space-y-5 text-[#1D2D2E] shadow-sm"
            style={{ fontFamily: "'IBM Plex Sans Arabic', 'Cairo', sans-serif" }}
          >
            {/* 1. Official Header */}
            <div className="flex items-center justify-between border-b-2 border-[#1D2D2E]/20 pb-4">
              {/* Right: Company Branding & Details */}
              <div className="text-right space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#1D2D2E] tracking-tight">
                    شركة سما البارقة للسياحة والسفر
                  </h1>
                </div>
                <p className="text-xs font-bold text-[#FF7E47] tracking-wider uppercase font-mono">
                  SAMA AL-BARQA FOR TRAVEL & TOURISM
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-gray-600">
                  <span>ترخيص سياحي معتمد</span>
                  <span>•</span>
                  <span>بغداد - أربيل - دهوك</span>
                  <span>•</span>
                  <span dir="ltr" className="font-mono text-[#1D2D2E] font-black">07782528287</span>
                </div>
              </div>

              {/* Center / Left: Official 3D Emblem & Stamp */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <SamaLogo size="sm" variant="emblem" />
                <span className="text-[9px] font-black text-gray-500 mt-1 uppercase tracking-widest">
                  وثيقة رسمية معتمدة
                </span>
              </div>
            </div>

            {/* 2. Voucher Metadata Bar */}
            <div className="bg-[#FDFFF5] border-2 border-[#1D2D2E] rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-gray-500 font-bold block">الرقم المرجعي للسند</span>
                <span className="text-base sm:text-lg font-black font-mono text-[#1D2D2E] tracking-wider">
                  #{booking.id}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 font-bold block">تاريخ وساعة الإصدار</span>
                <span className="text-xs font-black text-[#1D2D2E]">
                  {formattedDate}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 font-bold block">حالة الحجز</span>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-full border ${statusBadge.bg}`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusBadge.color }}></span>
                  {statusBadge.text}
                </span>
              </div>
            </div>

            {/* 3. Customer & Trip Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Customer Info Card */}
              <div className="border border-[#1D2D2E]/20 rounded-xl p-4 bg-white space-y-2.5">
                <h3 className="text-xs font-black text-[#FF7E47] flex items-center gap-1.5 border-b border-[#1D2D2E]/10 pb-2">
                  <User className="w-4 h-4 text-[#FF7E47]" />
                  بيانات المسافر الرئيسي
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">اسم العميل:</span>
                    <strong className="font-black text-[#1D2D2E]">{booking.customerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">رقم الهاتف:</span>
                    <strong className="font-black font-mono text-[#1D2D2E]" dir="ltr">
                      {booking.customerPhone}
                    </strong>
                  </div>
                  {booking.customerEmail && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">البريد الإلكتروني:</span>
                      <strong className="font-mono text-gray-700">{booking.customerEmail}</strong>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">عدد المسافرين:</span>
                    <strong className="font-black text-[#1D2D2E] font-mono">
                      {booking.travelerCount} {booking.travelerCount === 1 ? 'مسافر' : 'مسافرين'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Trip Info Card */}
              <div className="border border-[#1D2D2E]/20 rounded-xl p-4 bg-white space-y-2.5">
                <h3 className="text-xs font-black text-[#FF7E47] flex items-center gap-1.5 border-b border-[#1D2D2E]/10 pb-2">
                  <MapPin className="w-4 h-4 text-[#FF7E47]" />
                  تفاصيل الرحلة والبرنامج السياحي
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-500 font-medium shrink-0">اسم الرحلة:</span>
                    <strong className="font-black text-[#1D2D2E] text-left pr-2">
                      {booking.tripTitle}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">نوع النقل:</span>
                    <span className="font-bold text-gray-800">باصات سياحية VIP حديثة ومكيفة</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">الإقامة والتنقل:</span>
                    <span className="font-bold text-emerald-700">شامل الفنادق والجولات السياحية</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Financial Summary Table */}
            <div className="border-2 border-[#1D2D2E]/20 rounded-xl overflow-hidden">
              <div className="bg-[#1D2D2E] text-white px-4 py-2 flex items-center justify-between text-xs font-black">
                <span>البيان المالي والتكلفة</span>
                <span>الحساب الرسمي</span>
              </div>
              <div className="p-4 bg-[#FDFFF5] flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-600 font-bold block">إجمالي المبلغ المستحق عن الحجز:</span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    (عن {booking.travelerCount} مسافرين شاملة كافة خدمات البرنامج السياحي)
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-xl sm:text-2xl font-black font-mono text-[#FF7E47]">
                    {booking.totalPrice.toLocaleString()} {booking.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Notes (If any) */}
            {booking.notes && (
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-300 text-xs space-y-1">
                <span className="font-black text-amber-900 block">ملاحظات وطلبات العميل الخاصة:</span>
                <p className="text-amber-950 font-medium leading-relaxed">{booking.notes}</p>
              </div>
            )}

            {/* 5. Terms & Instructions */}
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-[10px] space-y-1 text-gray-600">
              <strong className="text-gray-800 block font-black text-[11px]">
                تعليمات وشروط السفر المهمة:
              </strong>
              <ul className="list-disc list-inside space-y-0.5 leading-relaxed">
                <li>يرجى التواجد في نقطة التجمع والانطلاق المحددة قبل موعد الرحلة بنصف ساعة على الأقل.</li>
                <li>يجب إبراز هذا السند مع المستمسكات الثبوتية الأصلية (البطاقة الموحدة أو الجواز) عند الصعود.</li>
                <li>تطبق شروط وضوابط شركة سما البارقة بخصوص تعديل أو إلغاء الحجوزات وفق المواعيد المحددة.</li>
              </ul>
            </div>

            {/* 6. Signatures and Official Seals */}
            <div className="pt-3 border-t-2 border-[#1D2D2E]/20 grid grid-cols-2 gap-6 items-end">
              {/* Company Stamp Box */}
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#FF7E47] flex flex-col items-center justify-center p-1 text-center bg-[#FFD95A]/10 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#FF7E47]" />
                  <span className="text-[8px] font-black text-[#1D2D2E] leading-tight mt-0.5">
                    شركة سما البارقة
                  </span>
                  <span className="text-[7px] text-[#FF7E47] font-black">
                    معتمد ورسمي
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#1D2D2E] block">
                    قسم الحجوزات وإدارة العمليات
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium block mt-0.5">
                    شركة سما البارقة للسياحة والسفر
                  </span>
                </div>
              </div>

              {/* Customer / Receiver Signature */}
              <div className="text-left border-b border-gray-400 pb-1">
                <span className="text-[10px] text-gray-500 font-bold block mb-4">
                  توقيع العميل / المستلم:
                </span>
                <span className="text-xs font-black text-[#1D2D2E] font-mono">
                  {booking.customerName}
                </span>
              </div>
            </div>

            {/* 7. Bottom Verification Note */}
            <div className="pt-2 text-center text-[9px] text-gray-400 font-medium border-t border-gray-100">
              تم إصدار هذا السند إلكترونياً من خلال منظومة شركة سما البارقة للسياحة والسفر • بغداد - أربيل • هاتف: 07782528287
            </div>
          </div>
        </div>

        {/* Screen Bottom Actions (Hidden on Print) */}
        <div className="no-print flex items-center justify-end gap-3 px-6 py-3 bg-white border-t-2 border-[#1D2D2E]/15">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-xs font-black cursor-pointer"
          >
            إلغاء وإغلاق
          </button>
          <button
            onClick={handlePrint}
            type="button"
            className="px-6 py-2 rounded-xl bg-[#FFD95A] hover:bg-[#fcd34d] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] text-xs font-black flex items-center gap-2 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة السند الرسمي 🖨️</span>
          </button>
        </div>
      </div>
    </div>
  );
}
