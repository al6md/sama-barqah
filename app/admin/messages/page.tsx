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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">رسائل واستفسارات العملاء</h1>
            <p className="text-xs text-slate-400 mt-1">
              الرسائل الواردة عبر نموذج الاتصال في الموقع العام.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchMessages();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors self-start cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث الرسائل</span>
          </button>
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">جاري تحميل الرسائل...</div>
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
                  className={`p-6 rounded-3xl border transition-all ${
                    msg.isRead
                      ? 'bg-slate-950/60 border-slate-800 opacity-80'
                      : 'bg-slate-950 border-amber-500/30 shadow-lg'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          msg.isRead ? 'bg-slate-800 text-slate-400' : 'bg-amber-400 text-slate-950'
                        }`}
                      >
                        {msg.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{msg.name}</h4>
                        <span className="text-[11px] text-slate-400">{msg.subject}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(msg.createdAt).toLocaleDateString('ar-IQ')}</span>
                      </span>

                      <button
                        onClick={() => handleToggleRead(msg.id, Boolean(msg.isRead))}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                          msg.isRead
                            ? 'bg-slate-900 text-slate-400 border-slate-700'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {msg.isRead ? 'تمت القراءة' : 'تحديد كمقروء'}
                      </button>
                    </div>
                  </div>

                  <div className="py-4 text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-2xl my-3 border border-slate-800/60">
                    {msg.message}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                    <div className="flex items-center gap-4 text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-slate-300" dir="ltr">
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        <span>{msg.phone}</span>
                      </span>
                      {msg.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-sky-400" />
                          <span>{msg.email}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>محادثة واتساب</span>
                      </a>
                      <a
                        href={`tel:${msg.phone}`}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>اتصال هاتفي</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center bg-slate-950 rounded-3xl border border-slate-800 space-y-2">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">لا توجد رسائل جديدة حالياً.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
