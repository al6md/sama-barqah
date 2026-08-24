import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFFF5] text-[#1D2D2E]">
      <Navbar />
      <main className="py-32 max-w-4xl mx-auto px-4 sm:px-6 flex-1 w-full">
        <div className="bg-white p-8 sm:p-12 rounded-[28px] border-3 border-[#1D2D2E] shadow-[8px_8px_0px_#1D2D2E] space-y-6">
          <div className="border-b-2 border-dashed border-[#1D2D2E]/20 pb-4">
            <span className="text-xs font-black bg-[#FF7E47] text-white border-2 border-[#1D2D2E] px-3 py-1 rounded-full inline-block mb-3">
              اتفاقية المستخدم 📜
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1D2D2E]">
              الشروط والأحكام العامة للحجوزات
            </h1>
            <p className="text-xs font-bold text-[#1D2D2E]/60 mt-1">سما البارقة للسفر والسياحة</p>
          </div>

          <section className="space-y-3 text-xs leading-relaxed font-bold text-[#1D2D2E]/80">
            <h2 className="text-sm font-black text-[#1D2D2E]">1. شروط الحجز والتثبيت</h2>
            <p>
              يُعتبر طلب الحجز المُرسل عبر الموقع طلباً مبدئياً، ويتم تثبيته رسمياً بعد تواصل موظف الحجوزات مع العميل ودفع العربون أو قيمة التذكرة المتفق عليها.
            </p>
          </section>

          <section className="space-y-3 text-xs leading-relaxed font-bold text-[#1D2D2E]/80">
            <h2 className="text-sm font-black text-[#1D2D2E]">2. سياسة الإلغاء والاسترجاع</h2>
            <p>
              يحق للعميل إلغاء الحجز واسترداد كامل المبلغ قبل موعد الانطلاق بـ 72 ساعة على الأقل. في حال الإلغاء قبل 24 ساعة يتم خصم نسبة الإدارة الفندقية المترتبة.
            </p>
          </section>

          <section className="space-y-3 text-xs leading-relaxed font-bold text-[#1D2D2E]/80">
            <h2 className="text-sm font-black text-[#1D2D2E]">3. الالتزام بمواعيد التجمع</h2>
            <p>
              يُرجى من جميع المسافرين الكرام الحضور إلى نقطة الانطلاق المحددة قبل نصف ساعة على الأقل من موعد تحرك الباص لضمان سير البرنامج السياحي بدقة.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

