'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2, AlertCircle, Clock, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg('يرجى ملء الاسم ورقم الهاتف والرسالة.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          subject: subject.trim() || 'استفسار عام',
          message: message.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setName('');
        setPhone('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setErrorMsg(data.error || 'حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة لاحقاً.');
      }
    } catch (e: any) {
      setErrorMsg('تعذر الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFFF5] text-[#1D2D2E]">
      <Navbar />

      <section className="bg-[#4CC9FE] text-[#1D2D2E] border-b-3 border-[#1D2D2E] pt-28 pb-12 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-black bg-[#FFD95A] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] px-3.5 py-1 rounded-full uppercase inline-block">
            خدمة العملاء والحجوزات 24/7 📞
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1D2D2E]">
            تواصل مع سما البارقة
          </h1>
          <p className="text-sm font-bold text-[#1D2D2E]/80 max-w-xl mx-auto">
            نحن هنا للإجابة على جميع استفساراتكم وتأكيد حجوزاتكم وتنظيم رحلاتكم المخصصة.
          </p>
        </div>
      </section>

      <main className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Card */}
          <div className="bg-[#FFD95A] text-[#1D2D2E] p-8 rounded-[28px] space-y-6 shadow-[6px_6px_0px_#1D2D2E] border-3 border-[#1D2D2E]">
            <div>
              <span className="text-xs text-[#1D2D2E] font-black uppercase tracking-wider block mb-1">
                معلومات الاتصال المباشر 📍
              </span>
              <h3 className="text-xl font-black text-[#1D2D2E]">فروعنا ومكاتبنا في خدمتكم</h3>
            </div>

            <div className="space-y-4 text-xs font-bold text-[#1D2D2E]">
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                <div className="w-9 h-9 rounded-xl bg-[#A5F3CF] border-2 border-[#1D2D2E] text-[#1D2D2E] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-[#1D2D2E] block mb-0.5">موقع الشركة والمكتب:</span>
                  <span>كربلاء — نهاية شارع الإسكان — محلات الملعب القديم</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                <div className="w-9 h-9 rounded-xl bg-[#4CC9FE] border-2 border-[#1D2D2E] text-[#1D2D2E] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-[#1D2D2E] block mb-0.5">الهاتف المباشر:</span>
                  <a href="tel:07782528287" className="hover:text-[#FF7E47] font-black text-sm" dir="ltr">
                    0778 252 8287
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                <div className="w-9 h-9 rounded-xl bg-[#A5F3CF] border-2 border-[#1D2D2E] text-[#1D2D2E] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-[#1D2D2E] block mb-0.5">واتساب الحجوزات:</span>
                  <a
                    href="https://wa.me/9647782528287"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#FF7E47] font-black text-sm"
                    dir="ltr"
                  >
                    0778 252 8287 (محادثة فورية)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                <div className="w-9 h-9 rounded-xl bg-[#FF7E47] border-2 border-[#1D2D2E] text-white flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-[#1D2D2E] block mb-0.5">البريد الإلكتروني:</span>
                  <a href="mailto:info@samabarqah.iq" className="hover:text-[#FF7E47]">
                    info@samabarqah.iq
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                <div className="w-9 h-9 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-[#1D2D2E] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-[#1D2D2E] block mb-0.5">ساعات العمل:</span>
                  <span>يومياً: 9:00 صباحاً - 10:00 مساءً</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-[28px] border-3 border-[#1D2D2E] shadow-[6px_6px_0px_#1D2D2E] space-y-6">
            <div>
              <h3 className="text-2xl font-black text-[#1D2D2E]">أرسل لنا استفسارك أو طلبك</h3>
              <p className="text-xs font-bold text-[#1D2D2E]/70 mt-1">
                سيتواصل معكم أحد مسؤولي خدمة العملاء خلال أقل من ساعتين.
              </p>
            </div>

            {success ? (
              <div className="p-8 rounded-[24px] bg-[#A5F3CF] border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#1D2D2E] mx-auto" />
                <h4 className="text-lg font-black text-[#1D2D2E]">تم إرسال رسالتكم بنجاح! 🎉</h4>
                <p className="text-xs font-bold text-[#1D2D2E] max-w-md mx-auto">
                  شكراً لتواصلكم معنا. تم استلام الرسالة وسيقوم فريق سما البارقة بالرد عليكم فوراً.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#FF7E47] text-white text-xs font-black border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] hover:bg-[#e66a35] mt-2 cursor-pointer"
                >
                  إرسال استفسار آخر
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-4 rounded-xl bg-rose-100 border-2 border-rose-600 text-rose-900 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#1D2D2E] mb-1">
                      الاسم الكامل <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="اسمك الكريم"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold focus:outline-none shadow-[2px_2px_0px_#1D2D2E] text-[#1D2D2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#1D2D2E] mb-1">
                      رقم الهاتف (واتساب) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      placeholder="0770 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold focus:outline-none shadow-[2px_2px_0px_#1D2D2E] text-right text-[#1D2D2E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#1D2D2E] mb-1">
                      البريد الإلكتروني <span className="text-slate-400 font-normal">(اختياري)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold focus:outline-none shadow-[2px_2px_0px_#1D2D2E] text-[#1D2D2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#1D2D2E] mb-1">
                      موضوع الاستفسار
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: حجز كروب شركات، رحلة مخصصة..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold focus:outline-none shadow-[2px_2px_0px_#1D2D2E] text-[#1D2D2E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#1D2D2E] mb-1">
                    نص الرسالة أو الاستفسار <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="اكتب استفسارك بالتفصيل..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold focus:outline-none shadow-[2px_2px_0px_#1D2D2E] resize-none text-[#1D2D2E]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#FF7E47] hover:bg-[#e66a35] text-white font-black text-sm flex items-center justify-center gap-2 border-2 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>إرسال الرسالة الآن 🚀</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
