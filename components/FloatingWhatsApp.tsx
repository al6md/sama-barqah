'use client';

export function FloatingWhatsApp() {
  return (
    <aside aria-label="محادثة واتساب المباشرة" className="fixed bottom-6 left-6 z-40">
      <a
        id="floating-whatsapp-btn"
        href="https://wa.me/9647782528287?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%B4%D8%B1%D9%83%D8%A9%20%D8%B3%D9%85%D8%A7%20%D8%A7%D9%84%D8%A8%D8%A7%D8%B1%D9%82%D8%A9%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%20%D9%83%D8%B1%D8%AF%D8%B3%D8%AA%D8%A7%D9%86%20%D9%88%D8%A7%D9%84%D8%AD%D8%AC%D8%B2"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 sm:py-3 rounded-full border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] hover:scale-105 active:scale-95 transition-all duration-200 group cursor-pointer"
      >
        {/* Official WhatsApp SVG Icon */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 fill-white drop-shadow-sm"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="أيقونة واتساب"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.414z" />
          </svg>
          {/* Active green pulse dot */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFD95A] border border-[#1D2D2E]"></span>
          </span>
        </div>

        {/* WhatsApp Name & Label always clearly visible */}
        <div className="flex flex-col text-right pr-0.5 select-none">
          <span className="text-xs sm:text-sm font-black tracking-tight leading-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">
            واتساب
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-white/95 leading-none mt-0.5">
            تواصل مباشر 💬
          </span>
        </div>
      </a>
    </aside>
  );
}


