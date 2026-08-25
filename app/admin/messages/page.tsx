'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContactMessage } from '@/lib/db';
import { MessageSquare, Mail, Phone, Clock, CheckCircle2, Trash2, RefreshCw } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/contact');
        const data = await res.json();
        if (isMounted && data.success) {
          setMessages(data.messages);
          setLoading(false);
        }
      } catch (e) {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: !currentRead })
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isRead: !currentRead } : m))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[3px] border-[#1D2D2E] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1D2D2E]">رسائل واستفسارات العملاء</h1>
            <p className="text-xs font-bold text-[#1D2D2E]/70 mt-1">
              الرسائل الواردة عبر نموذج الاتصال في الموقع العام.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchMessages();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FFD95A] hover:bg-[#fcd34d] text-xs font-black text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] active:translate-y-0.5 transition-all self-start cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث الرسائل</span>
          </button>
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="p-12 text-center text-xs font-black text-[#1D2D2E]/60">جاري تحميل الرسائل...</div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg) => {
              const cleanPhone = msg.phone.replace(/\D/g, '');
              const formattedPhone = cleanPhone.startsWith('0')
                ? `964${cleanPhone.slice(1)}`
                : cleanPhone;
              const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
                `مرحباً ${msg.name}، معك سما البارقة للسفر والسياحة بخصوص استفسارك.`
              )}`;

              return (
                <div
                  key={msg.id}
                  className={`p-6 rounded-3xl border-[3px] border-[#1D2D2E] transition-all ${
                    msg.isRead
                      ? 'bg-white shadow-[3px_3px_0px_#1D2D2E] opacity-90'
                      : 'bg-[#FFD95A]/20 shadow-[5px_5px_0px_#1D2D2E]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#1D2D2E]/15 pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl border-2 border-[#1D2D2E] flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_#1D2D2E] ${
                          msg.isRead ? 'bg-white text-[#1D2D2E]' : 'bg-[#FF7E47] text-white'
                        }`}
                      >
                        {msg.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-[#1D2D2E]">{msg.name}</h4>
                        <span className="text-xs font-bold text-[#1D2D2E]/70">{msg.subject}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-xs font-bold text-[#1D2D2E]/60 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(msg.createdAt).toLocaleDateString('ar-IQ')}</span>
                      </span>

                      <button
                        onClick={() => handleToggleRead(msg.id, Boolean(msg.isRead))}
                        className={`px-3 py-1 rounded-xl text-xs font-black border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] transition-all cursor-pointer ${
                          msg.isRead
                            ? 'bg-white text-[#1D2D2E] hover:bg-gray-50'
                            : 'bg-[#A5F3CF] text-[#1D2D2E] hover:bg-[#86efac]'
                        }`}
                      >
                        {msg.isRead ? 'تمت القراءة' : 'تحديد كمقروء'}
                      </button>
                    </div>
                  </div>

                  <div className="py-4 text-xs font-bold text-[#1D2D2E] leading-relaxed bg-[#FDFFF5] p-4 rounded-2xl my-3 border-2 border-[#1D2D2E]">
                    {msg.message}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                    <div className="flex items-center gap-4 text-[#1D2D2E]">
                      <span className="flex items-center gap-1.5 font-mono font-black text-[#1D2D2E]" dir="ltr">
                        <Phone className="w-4 h-4 text-[#FF7E47]" />
                        <span>{msg.phone}</span>
                      </span>
                      {msg.email && (
                        <span className="flex items-center gap-1.5 font-bold">
                          <Mail className="w-4 h-4 text-[#4CC9FE]" />
                          <span>{msg.email}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#A5F3CF] hover:bg-[#86efac] text-[#1D2D2E] border-2 border-[#1D2D2E] font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#1D2D2E] transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>محادثة واتساب</span>
                      </a>
                      <a
                        href={`tel:${msg.phone}`}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-[#FDFFF5] text-[#1D2D2E] border-2 border-[#1D2D2E] font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#1D2D2E] transition-all cursor-pointer"
                      >
                        <Phone className="w-4 h-4" />
                        <span>اتصال هاتفي</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center bg-white rounded-3xl border-[3px] border-[#1D2D2E] shadow-[5px_5px_0px_#1D2D2E] space-y-2">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-xs font-black text-[#1D2D2E]">لا توجد رسائل جديدة حالياً.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
