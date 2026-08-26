import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { Compass, ShieldCheck, Award, HeartHandshake, Users, MapPin, Bus, CheckCircle2 } from 'lucide-react';
import { SamaLogo } from '@/components/SamaLogo';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFFF5] text-[#1D2D2E]">
      <Navbar />

      <section className="bg-[#FFD95A] text-[#1D2D2E] border-b-3 border-[#1D2D2E] pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 flex flex-col items-center">
          <div className="p-3 bg-white rounded-3xl border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E]">
            <SamaLogo size="md" variant="emblem" />
          </div>
          <span className="text-xs font-black bg-white text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] px-3.5 py-1 rounded-full uppercase inline-block">
            سما البارقة للسياحة والسفر 🌟
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1D2D2E]">
            من نحن وقصة التميز
          </h1>
          <p className="text-sm font-bold text-[#1D2D2E]/80 max-w-xl mx-auto">
            شركة سياحية عراقية رائدة متخصصة في تنظيم الرحلات والبرامج السياحية بأعلى معايير الجودة والأمان.
          </p>
        </div>
      </section>

      <main className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 space-y-12 w-full">
        {/* Story Section */}
        <div className="bg-white p-8 sm:p-12 rounded-[28px] border-3 border-[#1D2D2E] shadow-[6px_6px_0px_#1D2D2E] space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-black text-[#1D2D2E] bg-[#A5F3CF] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] px-3 py-1 rounded-full">
            <Compass className="w-4 h-4 text-[#1D2D2E]" />
            <span>رسالتنا ورؤيتنا 🚀</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#1D2D2E]">
            شغف بصناعة ذكريات سياحية لا تُنسى في أرجاء العراق
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-[#1D2D2E]/80 font-bold leading-relaxed">
            <p>
              تأسست <strong>شركة سما البارقة للسفر والسياحة</strong> لتكون الخيار الأول للعوائل والمسافرين الباحثين عن رحلات سياحية متكاملة، آمنة ومريحة داخل ربوع العراق وقمم كردستان الخلابة.
            </p>
            <p>
              نحن نؤمن بأن السفر ليس مجرد انتقال من مكان لآخر، بل تجربة ثقافية وترفيهية تصنع ذكريات دائمة. لذلك نحرص على اختيار أفضل الفنادق المصنفة، وتسيير أحدث باصات الـ VIP المجهزة، واختيار مرشدين سياحيين يتمتعون بكفاءة عالية وأخلاق رفيعة لتقديم أقصى درجات الراحة لضيوفنا الكرام.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t-2 border-dashed border-[#1D2D2E]/20">
            <div className="text-center p-4 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
              <span className="text-2xl font-black text-[#FF7E47] block">10,000+</span>
              <span className="text-xs font-black text-[#1D2D2E]">مسافر سعيد وراضٍ</span>
            </div>

            <div className="text-center p-4 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
              <span className="text-2xl font-black text-[#4CC9FE] block">150+</span>
              <span className="text-xs font-black text-[#1D2D2E]">رحلة سياحية سنوياً</span>
            </div>

            <div className="text-center p-4 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
              <span className="text-2xl font-black text-emerald-600 block">100%</span>
              <span className="text-xs font-black text-[#1D2D2E]">ضمان الأمان والالتزام</span>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[24px] border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD95A] border-2 border-[#1D2D2E] text-[#1D2D2E] flex items-center justify-center shadow-[2px_2px_0px_#1D2D2E]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#1D2D2E]">الأمان والموثوقية</h3>
            <p className="text-xs font-bold text-[#1D2D2E]/70 leading-relaxed">
              مرخصون رسمياً ومسجلون لدى هيئة السياحة، ونضمن التزاماً تاماً بمواعيد الانطلاق والبرامج المعتمدة.
            </p>
          </div>

          <div className="bg-white p-6 rounded-[24px] border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#4CC9FE] border-2 border-[#1D2D2E] text-[#1D2D2E] flex items-center justify-center shadow-[2px_2px_0px_#1D2D2E]">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#1D2D2E]">الضيافة العراقية الأصيلة</h3>
            <p className="text-xs font-bold text-[#1D2D2E]/70 leading-relaxed">
              نهتم بأدق التفاصيل والاحتياجات الخاصة بالعوائل والأطفال لتكون رحلتكم مفعمة بالبهجة والراحة.
            </p>
          </div>

          <div className="bg-white p-6 rounded-[24px] border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#A5F3CF] border-2 border-[#1D2D2E] text-[#1D2D2E] flex items-center justify-center shadow-[2px_2px_0px_#1D2D2E]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#1D2D2E]">أفضل الأسعار التنافسية</h3>
            <p className="text-xs font-bold text-[#1D2D2E]/70 leading-relaxed">
              باقات سياحية شاملة بأعلى جودة وأسعار شفافة ومباشرة بدون أي تكاليف أو رسوم خفية.
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
