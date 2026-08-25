'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SiteSettings } from '@/lib/db';
import { Settings, Save, Lock, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Phone, Mail, MapPin } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Security password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSettings(data.settings);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMsg(data.error || 'حدث خطأ أثناء حفظ الإعدادات.');
      }
    } catch (e) {
      setErrorMsg('تعذر الاتصال بالخادم.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(false);

    if (newPassword.length < 6) {
      setPassError('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('كلمة المرور الجديدة وتأكيدها غير متطابقين.');
      return;
    }

    setPassLoading(true);

    try {
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('sama_admin_token') : null;
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(savedToken ? { Authorization: `Bearer ${savedToken}`, 'x-admin-token': savedToken } : {})
        },
        body: JSON.stringify({
          action: 'change_password',
          currentPassword,
          newPassword
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPassSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPassError(data.error || 'فشل تغيير كلمة المرور.');
      }
    } catch (e) {
      setPassError('حدث خطأ في الاتصال.');
    } finally {
      setPassLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-12 text-center text-xs font-black text-[#1D2D2E]">جاري تحميل إعدادات الموقع...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div className="border-b-[3px] border-[#1D2D2E] pb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-[#1D2D2E]">إعدادات الموقع ومعلومات الشركة</h1>
          <p className="text-xs font-bold text-[#1D2D2E]/70 mt-1">
            تعديل أرقام الهواتف، الواتساب، العناوين، والنصوص الظاهرة في الصفحة الرئيسية.
          </p>
        </div>

        {/* Settings Form */}
        {settings && (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            {saveSuccess && (
              <div className="p-4 rounded-2xl bg-[#A5F3CF] border-2 border-[#1D2D2E] text-[#1D2D2E] text-xs font-black flex items-center gap-2 shadow-[3px_3px_0px_#1D2D2E] animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#1D2D2E] shrink-0" />
                <span>تم حفظ وتحديث إعدادات الموقع بنجاح!</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-100 border-2 border-rose-600 text-rose-800 text-xs font-black flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="p-6 sm:p-8 rounded-3xl bg-white border-[3px] border-[#1D2D2E] shadow-[5px_5px_0px_#1D2D2E] space-y-6">
              <h3 className="text-base font-black text-[#1D2D2E] flex items-center gap-2 border-b-2 border-[#1D2D2E]/15 pb-4">
                <Settings className="w-5 h-5 text-[#FF7E47]" />
                <span>بيانات الاتصال والمقر</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">اسم الشركة</label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">رقم الهاتف الرئيسي</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E]"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">رقم الواتساب (بدون +)</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E]"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">البريد الإلكتروني الرسمي</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E]"
                    dir="ltr"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">عنوان المقر الرئيسي</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E]"
                  />
                </div>
              </div>
            </div>

            {/* Hero & Texts */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-[3px] border-[#1D2D2E] shadow-[5px_5px_0px_#1D2D2E] space-y-6">
              <h3 className="text-base font-black text-[#1D2D2E] border-b-2 border-[#1D2D2E]/15 pb-4">
                نصوص الواجهة الرئيسية (Hero Section)
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">عنوان الترحيب الرئيسي</label>
                  <input
                    type="text"
                    value={settings.heroTitle}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">الوصف الفرعي</label>
                  <textarea
                    rows={2}
                    value={settings.heroSubtitle}
                    onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">رمز العملة الافتراضية</label>
                    <input
                      type="text"
                      value={settings.currencySymbol}
                      onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">رابط صفحة فيسبوك / انستغرام</label>
                    <input
                      type="text"
                      value={settings.instagramUrl || ''}
                      onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E]"
                      placeholder="https://instagram.com/sama_albarqah"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-2xl bg-[#FF7E47] hover:bg-[#ff6c2f] text-white border-2 border-[#1D2D2E] font-black text-xs shadow-[3px_3px_0px_#1D2D2E] active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>حفظ التغييرات</span>
            </button>
          </form>
        )}

        {/* Password Change Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-[3px] border-[#1D2D2E] shadow-[5px_5px_0px_#1D2D2E] space-y-6 pt-8">
          <h3 className="text-base font-black text-[#1D2D2E] flex items-center gap-2 border-b-2 border-[#1D2D2E]/15 pb-4">
            <Lock className="w-5 h-5 text-[#FF7E47]" />
            <span>تغيير كلمة مرور لوحة التحكم</span>
          </h3>

          {passSuccess && (
            <div className="p-4 rounded-2xl bg-[#A5F3CF] border-2 border-[#1D2D2E] text-[#1D2D2E] text-xs font-black flex items-center gap-2 shadow-[3px_3px_0px_#1D2D2E]">
              <CheckCircle2 className="w-4 h-4 text-[#1D2D2E] shrink-0" />
              <span>تم تحديث كلمة المرور بنجاح!</span>
            </div>
          )}

          {passError && (
            <div className="p-4 rounded-2xl bg-rose-100 border-2 border-rose-600 text-rose-800 text-xs font-black flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{passError}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">كلمة المرور الحالية</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">كلمة المرور الجديدة</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">تأكيد كلمة المرور الجديدة</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E]"
              />
            </div>

            <button
              type="submit"
              disabled={passLoading}
              className="px-6 py-2.5 rounded-xl bg-[#FFD95A] hover:bg-[#fcd34d] text-[#1D2D2E] border-2 border-[#1D2D2E] font-black text-xs shadow-[2px_2px_0px_#1D2D2E] active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {passLoading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
