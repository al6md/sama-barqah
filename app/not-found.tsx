import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Compass, ArrowRight, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFFF5] text-[#1D2D2E]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6 py-32">
        <div className="text-center bg-white p-10 sm:p-12 rounded-[28px] border-3 border-[#1D2D2E] shadow-[8px_8px_0px_#1D2D2E] max-w-md space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#FFD95A] border-3 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] text-[#1D2D2E] flex items-center justify-center mx-auto">
            <Compass className="w-10 h-10" />
          </div>
          <span className="text-5xl font-black text-[#1D2D2E] block">404</span>
          <h1 className="text-xl font-black text-[#1D2D2E]">الصفحة المطلوبة غير موجودة</h1>
          <p className="text-xs font-bold text-[#1D2D2E]/70">
            يبدو أنك سلكت مساراً غير صحيح أو أن الصفحة تم نقلها إلى موقع جديد.
          </p>
          <div className="pt-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF7E47] text-white font-black text-xs border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] hover:bg-[#e66a35] transition-all"
            >
              <Home className="w-4 h-4" />
              <span>العودة إلى الصفحة الرئيسية 🏠</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

