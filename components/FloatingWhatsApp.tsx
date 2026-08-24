'use client';

import { MessageCircle } from 'lucide-react';

export function FloatingWhatsApp() {
  return (
    <aside aria-label="محادثة واتساب المباشرة" className="fixed bottom-6 left-6 z-40">
      <a
        id="floating-whatsapp-btn"
        href="https://wa.me/9647782528287?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%B4%D8%B1%D9%83%D8%A9%20%D8%B3%D9%85%D8%A7%20%D8%A7%D9%84%D8%A8%D8%A7%D8%B1%D9%82%D8%A9%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%20%D9%83%D8%B1%D8%AF%D8%B3%D8%AA%D8%A7%D9%86%20%D9%88%D8%A7%D9%84%D8%AD%D8%AC%D8%B2"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2.5 bg-[#A5F3CF] hover:bg-[#92efc1] text-[#1D2D2E] px-4 py-3 rounded-full border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] hover:scale-105 active:scale-95 transition-all duration-200 group cursor-pointer"
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-black pl-1">
          تواصل معنا عبر واتساب 💬
        </span>
        <MessageCircle className="w-6 h-6 shrink-0 fill-current text-[#1D2D2E]" />
      </a>
    </aside>
  );
}

