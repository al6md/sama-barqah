import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFFF5] text-[#1D2D2E]">
      <Navbar />
      <main className="py-32 max-w-4xl mx-auto px-4 sm:px-6 flex-1 w-full">
        <div className="bg-white p-8 sm:p-12 rounded-[28px] border-3 border-[#1D2D2E] shadow-[8px_8px_0px_#1D2D2E] space-y-6">
          <div className="border-b-2 border-dashed border-[#1D2D2E]/20 pb-4">
            <span className="text-xs font-black bg-[#FFD95A] border-2 border-[#1D2D2E] px-3 py-1 rounded-full inline-block mb-3">
              وثيقة الخصوصية 🔒
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1D2D2E]">
              سياسة الخصوصية وحماية البيانات
            </h1>
            <p className="text-xs font-bold text-[#1D2D2E]/60 mt-1">آخر تحديث: آب / أغسطس 2026</p>
          </div>

          <section className="space-y-3 text-xs leading-relaxed font-bold text-[#1D2D2E]/80">
            <h2 className="text-sm font-black text-[#1D2D2E]">1. جمع المعلومات</h2>
            <p>
              نحن في شركة سما البارقة للسفر والسياحة نلتزم بحماية خصوصية عملائنا. نقوم بجمع المعلومات الأساسية فقط اللازمة لإتمام وتأكيد حجوزاتكم السياحية (كالاسم، ورقم الهاتف، والبريد الإلكتروني إن وجد).
            </p>
          </section>

          <section className="space-y-3 text-xs leading-relaxed font-bold text-[#1D2D2E]/80">
            <h2 className="text-sm font-black text-[#1D2D2E]">2. استخدام البيانات</h2>
            <p>
              تُستخدم بياناتكم حصراً للتواصل معكم بخصوص تفاصيل الرحلة، وتأكيد المقاعد، وتزويدكم بالتعليمات الميدانية ومواعيد الانطلاق. لا نقوم ببيع أو مشاركة بياناتكم مع أي طرف ثالث تجاري.
            </p>
          </section>

          <section className="space-y-3 text-xs leading-relaxed font-bold text-[#1D2D2E]/80">
            <h2 className="text-sm font-black text-[#1D2D2E]">3. أمان وحماية البيانات</h2>
            <p>
              نطبق إجراءات أمنية تقنية وإدارية متقدمة لحماية قواعد بياناتنا من أي وصول غير مصرح به.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

