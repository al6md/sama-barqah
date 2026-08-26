'use client';

import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface CompanyMapProps {
  className?: string;
  showDetails?: boolean;
}

export function CompanyMap({ className = '', showDetails = true }: CompanyMapProps) {
  const mapsUrl = 'https://maps.app.goo.gl/gphLRsyL9b4od3PW7';
  // Precise coordinates for "شركة سما البارقة للسفر والسياحة" in Karbala
  // 32.5876005, 44.0192314
  const embedUrl = 'https://maps.google.com/maps?q=32.5876005,44.0192314&hl=ar&z=17&output=embed';

  return (
    <div className={`rounded-[28px] bg-white border-3 border-[#1D2D2E] shadow-[6px_6px_0px_#1D2D2E] overflow-hidden ${className}`}>
      {showDetails && (
        <div className="p-4 sm:p-6 bg-[#FFD95A] border-b-3 border-[#1D2D2E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF7E47] border-2 border-[#1D2D2E] flex items-center justify-center text-white shrink-0 shadow-[2px_2px_0px_#1D2D2E]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#1D2D2E]">موقع شركة سما البارقة على الخريطة 📍</h3>
              <p className="text-xs font-bold text-[#1D2D2E]/80">كربلاء - نهاية شارع الاسكان - محلات ملعب القديم</p>
            </div>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#1D2D2E] font-black text-xs border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] hover:translate-x-0.5 hover:translate-y-0.5 transition-all shrink-0 cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-[#FF7E47]" />
            <span>فتح في خرائط Google 🗺️</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </a>
        </div>
      )}

      {/* Interactive Map Embed */}
      <div className="relative w-full h-[320px] sm:h-[400px] bg-slate-100">
        <iframe
          title="موقع شركة سما البارقة للسفر والسياحة"
          src={embedUrl}
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

        {/* Floating Quick Action Overlay */}
        <div className="absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-xl border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] flex items-center gap-2 text-xs font-black text-[#1D2D2E]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>مقر الشركة مفتوح يومياً من 9:00 ص - 10:00 م</span>
        </div>
      </div>
    </div>
  );
}
