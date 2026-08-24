'use client';

import Link from 'next/link';
import { Compass, Phone, Mail, MapPin, MessageCircle, Shield, Award, Clock, Heart, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer id="main-footer" className="bg-white text-[#1D2D2E] border-t-3 border-[#1D2D2E] pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b-2 border-dashed border-[#1D2D2E]/20">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✈️</span>
              <div>
                <span className="text-2xl font-black text-[#FF7E47] block leading-none">شركة سما البارقة</span>
                <span className="text-xs text-[#1D2D2E] font-extrabold tracking-wide">للسفر والسياحة</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#1D2D2E]/80 leading-relaxed font-bold">
              اكتشف جمال كردستان معنا، واستمتع برحلة مليئة بالطبيعة الخلابة، الأجواء الساحرة، والمعالم التي تستحق أن تُرى! 🌄✨
            </p>
            <div className="text-xs font-black text-[#FF7E47]">
              سافر معنا… نحو تجربة لا تُنسى ✨
            </div>
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://wa.me/9647782528287"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#A5F3CF] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-[#1D2D2E] hover:bg-[#85eec0] flex items-center justify-center transition-transform hover:scale-105"
                title="واتساب"
              >
                <MessageCircle className="w-5 h-5 text-[#1D2D2E]" />
              </a>
              <a
                href="tel:07782528287"
                className="w-10 h-10 rounded-xl bg-[#FFD95A] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-[#1D2D2E] hover:bg-[#f6cd44] flex items-center justify-center transition-transform hover:scale-105"
                title="اتصال مباشر"
              >
                <Phone className="w-5 h-5 text-[#1D2D2E]" />
              </a>
              <a
                href="mailto:info@samabarqah.iq"
                className="w-10 h-10 rounded-xl bg-[#4CC9FE] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-white hover:bg-[#34bef9] flex items-center justify-center transition-transform hover:scale-105"
                title="البريد الإلكتروني"
              >
                <Mail className="w-5 h-5 text-[#1D2D2E]" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-base font-black text-[#1D2D2E] mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF7E47] border border-[#1D2D2E]"></span>
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-sm font-bold">
              <li>
                <Link href="/" className="text-[#1D2D2E]/80 hover:text-[#FF7E47] transition-colors">الصفحة الرئيسية</Link>
              </li>
              <li>
                <Link href="/trips" className="text-[#1D2D2E]/80 hover:text-[#FF7E47] transition-colors">جميع الرحلات السياحية</Link>
              </li>
              <li>
                <Link href="/offers" className="text-[#1D2D2E]/80 hover:text-[#FF7E47] transition-colors">عروض التوفير والخصومات 🔥</Link>
              </li>
              <li>
                <Link href="/about" className="text-[#1D2D2E]/80 hover:text-[#FF7E47] transition-colors">من نحن وسياستنا</Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#1D2D2E]/80 hover:text-[#FF7E47] transition-colors">تواصل مع خدمة العملاء</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Destinations */}
          <div>
            <h4 className="text-base font-black text-[#1D2D2E] mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4CC9FE] border border-[#1D2D2E]"></span>
              وجهاتنا السياحية بأسعار مميزة
            </h4>
            <ul className="space-y-2.5 text-sm font-bold">
              <li>
                <Link href="/trips/sulaymaniyah" className="hover:text-[#FF7E47] transition-colors flex items-center justify-between text-[#1D2D2E]/90 bg-[#FDFFF5] p-2 rounded-xl border border-[#1D2D2E]/20">
                  <span>📍 سليمانية</span>
                  <span className="text-xs bg-[#FFD95A] text-[#1D2D2E] border border-[#1D2D2E] px-2 py-0.5 rounded-md font-black">100 ألف</span>
                </Link>
              </li>
              <li>
                <Link href="/trips/duhok" className="hover:text-[#FF7E47] transition-colors flex items-center justify-between text-[#1D2D2E]/90 bg-[#FDFFF5] p-2 rounded-xl border border-[#1D2D2E]/20">
                  <span>📍 دهوك</span>
                  <span className="text-xs bg-[#A5F3CF] text-[#1D2D2E] border border-[#1D2D2E] px-2 py-0.5 rounded-md font-black">70 ألف</span>
                </Link>
              </li>
              <li>
                <Link href="/trips/erbil" className="hover:text-[#FF7E47] transition-colors flex items-center justify-between text-[#1D2D2E]/90 bg-[#FDFFF5] p-2 rounded-xl border border-[#1D2D2E]/20">
                  <span>📍 أربيل</span>
                  <span className="text-xs bg-[#4CC9FE] text-[#1D2D2E] border border-[#1D2D2E] px-2 py-0.5 rounded-md font-black">75 ألف</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office Info */}
          <div>
            <h4 className="text-base font-black text-[#1D2D2E] mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A5F3CF] border border-[#1D2D2E]"></span>
              معلومات التواصل والمكتب
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#1D2D2E]/90 font-bold">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF7E47] shrink-0 mt-0.5" />
                <span>كربلاء — نهاية شارع الإسكان — محلات الملعب القديم</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#4CC9FE] shrink-0" />
                <a href="tel:07782528287" className="hover:text-[#FF7E47]" dir="ltr">0778 252 8287</a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <a href="https://wa.me/9647782528287" target="_blank" rel="noreferrer" className="hover:text-[#FF7E47]">
                  واتساب: 07782528287
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FF7E47] shrink-0" />
                <span>info@samabarqah.iq</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#1D2D2E]/60 shrink-0" />
                <span>يومياً: 9:00 ص - 10:00 م</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-[#1D2D2E]/70">
          <div>
            <span>© {new Date().getFullYear()} شركة سما البارقة للسفر والسياحة — كربلاء</span>
          </div>

          <div className="text-[#FF7E47] font-black tracking-wider">
            سافر معنا… نحو تجربة لا تُنسى ✨
          </div>
        </div>
      </div>
    </footer>
  );
}
