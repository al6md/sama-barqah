'use client';

import React, { useRef } from 'react';
import { Booking } from '@/lib/db';
import { SamaLogo } from '@/components/SamaLogo';
import { Printer, X, User, MapPin, ShieldCheck, CheckCircle, FileText, Phone, Mail, Calendar, Sparkles } from 'lucide-react';

interface BookingVoucherModalProps {
  booking: Booking;
  onClose: () => void;
}

export function BookingVoucherModal({ booking, onClose }: BookingVoucherModalProps) {
  const voucherRef = useRef<HTMLDivElement>(null);

  const formattedDate = new Date(booking.createdAt).toLocaleDateString('ar-IQ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedDateOnly = new Date(booking.createdAt).toLocaleDateString('ar-IQ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // Dedicated fail-safe print mechanism via an isolated print iframe
  const handlePrint = () => {
    try {
      const existingFrame = document.getElementById('sama-print-frame');
      if (existingFrame) {
        existingFrame.remove();
      }

      const iframe = document.createElement('iframe');
      iframe.id = 'sama-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);

      const frameDoc = iframe.contentWindow?.document || iframe.contentDocument;
      if (!frameDoc) {
        window.print();
        return;
      }

      const voucherHTML = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>سند تأكيد حجز رسمي - ${booking.id}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 12mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: 'IBM Plex Sans Arabic', 'Cairo', Tahoma, sans-serif;
              color: #1D2D2E;
              background: #ffffff;
              font-size: 13px;
              line-height: 1.5;
              padding: 0;
            }
            .voucher-container {
              width: 100%;
              max-width: 780px;
              margin: 0 auto;
              border: 2px solid #1D2D2E;
              border-radius: 16px;
              padding: 24px 28px;
              background: #ffffff;
              position: relative;
            }
            /* Watermark */
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-25deg);
              font-size: 80px;
              font-weight: 900;
              color: rgba(29, 45, 46, 0.03);
              pointer-events: none;
              white-space: nowrap;
              z-index: 0;
              text-transform: uppercase;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px solid #1D2D2E;
              padding-bottom: 16px;
              margin-bottom: 18px;
              position: relative;
              z-index: 1;
            }
            .header-right h1 {
              font-size: 20px;
              font-weight: 900;
              color: #1D2D2E;
              margin-bottom: 2px;
            }
            .header-right .sub {
              font-size: 11px;
              font-weight: 700;
              color: #FF7E47;
              letter-spacing: 1px;
              font-family: monospace;
            }
            .header-right .meta-info {
              font-size: 11px;
              color: #555;
              margin-top: 4px;
              font-weight: 600;
            }
            .header-left {
              text-align: left;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .logo-circle {
              width: 60px;
              height: 60px;
              background: #FFD95A;
              border: 2px solid #1D2D2E;
              border-radius: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 900;
              font-size: 22px;
              color: #1D2D2E;
            }
            .doc-type-badge {
              font-size: 9px;
              font-weight: 800;
              color: #1D2D2E;
              margin-top: 4px;
              background: #A5F3CF;
              border: 1px solid #1D2D2E;
              padding: 2px 8px;
              border-radius: 10px;
            }
            /* Serial & Status Bar */
            .meta-bar {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: #FDFFF5;
              border: 2px solid #1D2D2E;
              border-radius: 12px;
              padding: 10px 16px;
              margin-bottom: 16px;
              position: relative;
              z-index: 1;
            }
            .meta-item {
              display: flex;
              flex-direction: column;
            }
            .meta-item .label {
              font-size: 10px;
              color: #666;
              font-weight: 600;
            }
            .meta-item .value {
              font-size: 14px;
              font-weight: 800;
              color: #1D2D2E;
            }
            .meta-item .value.code {
              font-family: monospace;
              font-size: 16px;
              color: #1D2D2E;
            }
            .status-tag {
              display: inline-block;
              font-size: 11px;
              font-weight: 800;
              padding: 3px 10px;
              border-radius: 20px;
              border: 1px solid #059669;
              background: #ECFDF5;
              color: #065F46;
            }
            /* Content Grid */
            .grid-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 14px;
              margin-bottom: 16px;
              position: relative;
              z-index: 1;
            }
            .card {
              border: 1.5px solid #1D2D2E;
              border-radius: 12px;
              padding: 12px 14px;
              background: #ffffff;
            }
            .card-title {
              font-size: 12px;
              font-weight: 800;
              color: #FF7E47;
              border-bottom: 1px solid #E5E7EB;
              padding-bottom: 6px;
              margin-bottom: 8px;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              margin-bottom: 5px;
            }
            .info-row:last-child {
              margin-bottom: 0;
            }
            .info-row .field {
              color: #666;
              font-weight: 600;
            }
            .info-row .data {
              color: #1D2D2E;
              font-weight: 700;
            }
            /* Financial Table */
            .finance-box {
              border: 2px solid #1D2D2E;
              border-radius: 12px;
              overflow: hidden;
              margin-bottom: 16px;
              position: relative;
              z-index: 1;
            }
            .finance-header {
              background: #1D2D2E;
              color: #ffffff;
              padding: 8px 16px;
              font-size: 12px;
              font-weight: 800;
              display: flex;
              justify-content: space-between;
            }
            .finance-body {
              background: #FDFFF5;
              padding: 12px 16px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .finance-body .desc {
              font-size: 12px;
              color: #444;
              font-weight: 600;
            }
            .finance-body .total {
              font-size: 20px;
              font-weight: 900;
              color: #FF7E47;
              font-family: 'Cairo', sans-serif;
            }
            /* Notes */
            .notes-box {
              background: #FFFBEB;
              border: 1.5px solid #F59E0B;
              border-radius: 10px;
              padding: 10px 14px;
              font-size: 11px;
              margin-bottom: 14px;
              position: relative;
              z-index: 1;
            }
            .notes-box strong {
              color: #92400E;
              font-weight: 800;
              display: block;
              margin-bottom: 2px;
            }
            /* Terms */
            .terms-box {
              background: #F9FAFB;
              border: 1px solid #E5E7EB;
              border-radius: 10px;
              padding: 10px 14px;
              font-size: 10px;
              color: #555;
              margin-bottom: 16px;
              position: relative;
              z-index: 1;
            }
            .terms-box strong {
              color: #1D2D2E;
              font-weight: 800;
              font-size: 11px;
              display: block;
              margin-bottom: 4px;
            }
            .terms-box ul {
              padding-right: 16px;
            }
            .terms-box li {
              margin-bottom: 2px;
            }
            /* Signatures & Seal */
            .footer-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              border-top: 2px solid #1D2D2E;
              padding-top: 14px;
              align-items: center;
              position: relative;
              z-index: 1;
            }
            .stamp-box {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .seal-circle {
              width: 72px;
              height: 72px;
              border: 2px dashed #FF7E47;
              background: #FDFFF5;
              border-radius: 50%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
              padding: 4px;
            }
            .seal-circle .seal-text {
              font-size: 7.5px;
              font-weight: 900;
              color: #1D2D2E;
              line-height: 1.1;
            }
            .seal-circle .seal-sub {
              font-size: 6.5px;
              font-weight: 800;
              color: #FF7E47;
            }
            .sig-box {
              text-align: left;
              border-bottom: 1.5px solid #9CA3AF;
              padding-bottom: 4px;
            }
            .sig-label {
              font-size: 10px;
              color: #666;
              font-weight: 700;
              margin-bottom: 18px;
            }
            .sig-name {
              font-size: 12px;
              font-weight: 800;
              color: #1D2D2E;
            }
            .footer-note {
              text-align: center;
              font-size: 9px;
              color: #888;
              margin-top: 14px;
              border-top: 1px solid #EEE;
              padding-top: 6px;
            }
          </style>
        </head>
        <body>
          <div class="voucher-container">
            <div class="watermark">SAMA AL-BARQA</div>

            <!-- Header -->
            <div class="header">
              <div class="header-right">
                <h1>شركة سما البارقة للسياحة والسفر</h1>
                <div class="sub">SAMA AL-BARQA FOR TRAVEL & TOURISM SERVICES</div>
                <div class="meta-info">
                  ترخيص سياحي معتمد • بغداد - أربيل - دهوك • هاتف: 07782528287
                </div>
              </div>
              <div class="header-left">
                <div class="logo-circle">سما</div>
                <div class="doc-type-badge">وثيقة رسمية معتمدة</div>
              </div>
            </div>

            <!-- Serial Bar -->
            <div class="meta-bar">
              <div class="meta-item">
                <span class="label">الرقم المرجعي للسند</span>
                <span class="value code">#${booking.id}</span>
              </div>
              <div class="meta-item">
                <span class="label">تاريخ وساعة الإصدار</span>
                <span class="value">${formattedDate}</span>
              </div>
              <div class="meta-item">
                <span class="label">حالة الحجز</span>
                <span class="status-tag">✓ حجز مؤكد ومعتمد</span>
              </div>
            </div>

            <!-- Details 2-Column Grid -->
            <div class="grid-2">
              <!-- Customer Info -->
              <div class="card">
                <div class="card-title">👤 بيانات المسافر الرئيسي</div>
                <div class="info-row">
                  <span class="field">اسم العميل:</span>
                  <span class="data">${booking.customerName}</span>
                </div>
                <div class="info-row">
                  <span class="field">رقم الهاتف:</span>
                  <span class="data" dir="ltr">${booking.customerPhone}</span>
                </div>
                ${
                  booking.customerEmail
                    ? `
                  <div class="info-row">
                    <span class="field">البريد الإلكتروني:</span>
                    <span class="data">${booking.customerEmail}</span>
                  </div>
                `
                    : ''
                }
                <div class="info-row">
                  <span class="field">عدد المسافرين:</span>
                  <span class="data">${booking.travelerCount} مسافرين</span>
                </div>
              </div>

              <!-- Trip Info -->
              <div class="card">
                <div class="card-title">📍 تفاصيل الرحلة السياحية</div>
                <div class="info-row">
                  <span class="field">اسم البرنامج:</span>
                  <span class="data">${booking.tripTitle}</span>
                </div>
                <div class="info-row">
                  <span class="field">نوع النقل:</span>
                  <span class="data">باصات سياحية VIP حديثة ومكيفة</span>
                </div>
                <div class="info-row">
                  <span class="field">الإقامة والخدمات:</span>
                  <span class="data">شامل الفنادق والجولات السياحية</span>
                </div>
              </div>
            </div>

            <!-- Financial Table -->
            <div class="finance-box">
              <div class="finance-header">
                <span>البيان المالي والمحاسبي</span>
                <span>الحساب الرسمي المعتمد</span>
              </div>
              <div class="finance-body">
                <div class="desc">
                  إجمالي المبلغ المستحق عن الحجز بالدينار العراقي (${booking.travelerCount} مقاعد سياحية)
                </div>
                <div class="total">
                  ${booking.totalPrice.toLocaleString()} ${booking.currency}
                </div>
              </div>
            </div>

            ${
              booking.notes
                ? `
              <div class="notes-box">
                <strong>ملاحظات وطلبات خاصة:</strong>
                <div>${booking.notes}</div>
              </div>
            `
                : ''
            }

            <!-- Terms -->
            <div class="terms-box">
              <strong>تعليمات وشروط السفر المهمة:</strong>
              <ul>
                <li>يرجى التواجد في نقطة التجمع والانطلاق قبل موعد الرحلة بنصف ساعة على الأقل.</li>
                <li>يجب إبراز هذا السند مع المستمسكات الثبوتية الأصلية (البطاقة الموحدة أو الجواز) عند الصعود.</li>
                <li>تطبق شروط وضوابط شركة سما البارقة بخصوص تعديل أو إلغاء الحجوزات وفق المواعيد المحددة.</li>
              </ul>
            </div>

            <!-- Signatures and Stamp -->
            <div class="footer-grid">
              <div class="stamp-box">
                <div class="seal-circle">
                  <div class="seal-text">شركة سما البارقة</div>
                  <div class="seal-sub">قسم الحجوزات</div>
                  <div class="seal-text">معتمد رسمياً ✓</div>
                </div>
                <div>
                  <strong style="display:block; font-size:12px; color:#1D2D2E;">إدارة العمليات والحجوزات</strong>
                  <span style="font-size:10px; color:#666;">شركة سما البارقة للسياحة والسفر</span>
                </div>
              </div>

              <div class="sig-box">
                <div class="sig-label">توقيع العميل / المستلم:</div>
                <div class="sig-name">${booking.customerName}</div>
              </div>
            </div>

            <div class="footer-note">
              تم إصدار هذا السند إلكترونياً من خلال منظومة شركة سما البارقة للسياحة والسفر • بغداد - أربيل • هاتف: 07782528287
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.focus();
                window.print();
              }, 250);
            };
          </script>
        </body>
        </html>
      `;

      frameDoc.open();
      frameDoc.write(voucherHTML);
      frameDoc.close();
    } catch (e) {
      console.error('Iframe print error, falling back to window.print', e);
      window.print();
    }
  };

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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto modal-backdrop"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full my-auto bg-white rounded-3xl border-3 border-[#1D2D2E] shadow-[8px_8px_0px_#1D2D2E] overflow-hidden flex flex-col max-h-[96vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Screen Controls Header (Hidden on Print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-[#FFD95A] border-b-3 border-[#1D2D2E] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black bg-white text-[#1D2D2E] px-3 py-1 rounded-full border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#FF7E47]" />
              سند تأكيد حجز رسمي 📄
            </span>
            <span className="text-sm font-black text-[#1D2D2E] font-mono">
              #{booking.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="px-4 py-2 rounded-xl bg-[#FF7E47] hover:bg-[#ff6c2f] text-white border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-xs font-black flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة السند الرسمي (A4) 🖨️</span>
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
        <div className="overflow-y-auto p-4 sm:p-6 bg-gray-50 flex justify-center">
          {/* THE OFFICIAL VOUCHER ON-SCREEN PREVIEW */}
          <div
            ref={voucherRef}
            id="printable-voucher"
            className="w-full max-w-[720px] bg-white border-2 border-[#1D2D2E] p-6 sm:p-8 rounded-2xl space-y-4 text-[#1D2D2E] shadow-sm relative"
            style={{ fontFamily: "'IBM Plex Sans Arabic', 'Cairo', sans-serif" }}
          >
            {/* 1. Official Header */}
            <div className="flex items-center justify-between border-b-2 border-[#1D2D2E] pb-4">
              <div className="text-right space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-[#1D2D2E] tracking-tight">
                  شركة سما البارقة للسياحة والسفر
                </h1>
                <p className="text-xs font-bold text-[#FF7E47] tracking-wider uppercase font-mono">
                  SAMA AL-BARQA FOR TRAVEL & TOURISM SERVICES
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-gray-600">
                  <span>ترخيص سياحي معتمد</span>
                  <span>•</span>
                  <span>بغداد - أربيل - دهوك</span>
                  <span>•</span>
                  <span dir="ltr" className="font-mono text-[#1D2D2E] font-black">07782528287</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center shrink-0">
                <SamaLogo size="sm" variant="emblem" />
                <span className="text-[9px] font-black text-[#1D2D2E] bg-[#A5F3CF] px-2 py-0.5 rounded-full border border-[#1D2D2E] mt-1">
                  وثيقة رسمية معتمدة
                </span>
              </div>
            </div>

            {/* 2. Voucher Metadata Bar */}
            <div className="bg-[#FDFFF5] border-2 border-[#1D2D2E] rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-[2px_2px_0px_#1D2D2E]">
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
              <div className="border-2 border-[#1D2D2E] rounded-xl p-4 bg-white space-y-2.5 shadow-[2px_2px_0px_#1D2D2E]">
                <h3 className="text-xs font-black text-[#FF7E47] flex items-center gap-1.5 border-b border-[#1D2D2E]/15 pb-2">
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
              <div className="border-2 border-[#1D2D2E] rounded-xl p-4 bg-white space-y-2.5 shadow-[2px_2px_0px_#1D2D2E]">
                <h3 className="text-xs font-black text-[#FF7E47] flex items-center gap-1.5 border-b border-[#1D2D2E]/15 pb-2">
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
            <div className="border-2 border-[#1D2D2E] rounded-xl overflow-hidden shadow-[2px_2px_0px_#1D2D2E]">
              <div className="bg-[#1D2D2E] text-white px-4 py-2 flex items-center justify-between text-xs font-black">
                <span>البيان المالي والمحاسبي</span>
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
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs space-y-1">
                <span className="font-black text-amber-900 block">ملاحظات وطلبات العميل الخاصة:</span>
                <p className="text-amber-950 font-medium leading-relaxed">{booking.notes}</p>
              </div>
            )}

            {/* 5. Terms & Instructions */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[10px] space-y-1 text-gray-600">
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
            <div className="pt-2 border-t-2 border-[#1D2D2E] grid grid-cols-2 gap-6 items-end">
              {/* Company Stamp Box */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#FF7E47] flex flex-col items-center justify-center p-1 text-center bg-[#FFD95A]/15 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#FF7E47]" />
                  <span className="text-[7.5px] font-black text-[#1D2D2E] leading-tight">
                    شركة سما البارقة
                  </span>
                  <span className="text-[6.5px] text-[#FF7E47] font-black">
                    معتمد ورسمي ✓
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#1D2D2E] block">
                    قسم الحجوزات وإدارة العمليات
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium block">
                    شركة سما البارقة للسياحة والسفر
                  </span>
                </div>
              </div>

              {/* Customer / Receiver Signature */}
              <div className="text-left border-b border-gray-400 pb-1">
                <span className="text-[10px] text-gray-500 font-bold block mb-3">
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
        <div className="no-print flex items-center justify-end gap-3 px-6 py-3 bg-white border-t-2 border-[#1D2D2E]/15 shrink-0">
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
