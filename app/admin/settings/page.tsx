'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SiteSettings } from '@/lib/db';
import {
  Settings,
  Save,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  ShieldAlert
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Admin Profile & Username state
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminName, setAdminName] = useState('مدير عام سما البارقة');
  const [adminEmail, setAdminEmail] = useState('admin@samabarqah.iq');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Security password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('sama_admin_token') : null;

    // Load site settings and current admin profile
    Promise.all([
      fetch('/api/settings').then((res) => res.json()),
      fetch('/api/admin/auth', {
        headers: savedToken ? { Authorization: `Bearer ${savedToken}`, 'x-admin-token': savedToken } : {}
      }).then((res) => res.json())
    ])
      .then(([settingsData, authData]) => {
        if (settingsData?.success) {
          setSettings(settingsData.settings);
        }
        if (authData?.user) {
          setAdminUsername(authData.user.username || 'admin');
          setAdminName(authData.user.name || 'مدير عام سما البارقة');
          setAdminEmail(authData.user.email || 'admin@samabarqah.iq');
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
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        setErrorMsg(data.error || 'حدث خطأ أثناء حفظ الإعدادات.');
      }
    } catch (e) {
      setErrorMsg('تعذر الاتصال بالخادم.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateUsernameAndProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);

    if (!adminUsername || adminUsername.trim().length < 3) {
      setProfileError('اسم المستخدم يجب أن يتكون من 3 أحرف على الأقل.');
      return;
    }

    setProfileSaving(true);

    try {
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('sama_admin_token') : null;
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(savedToken ? { Authorization: `Bearer ${savedToken}`, 'x-admin-token': savedToken } : {})
        },
        body: JSON.stringify({
          action: 'change_username',
          newUsername: adminUsername.trim(),
          name: adminName.trim(),
          email: adminEmail.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProfileSuccess(true);
        if (data.user) {
          setAdminUsername(data.user.username);
          setAdminName(data.user.name);
          setAdminEmail(data.user.email);
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('sama_admin_user', JSON.stringify(data.user));
              window.dispatchEvent(new Event('admin_user_updated'));
            } catch (e) {}
          }
        }
        setTimeout(() => setProfileSuccess(false), 4000);
      } else {
        setProfileError(data.error || 'فشل تحديث اسم المستخدم.');
      }
    } catch (e) {
      setProfileError('حدث خطأ في الاتصال بالخادم.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(false);

    if (!currentPassword) {
      setPassError('يرجى إدخال كلمة المرور الحالية.');
      return;
    }

    if (newPassword.length < 6) {
      setPassError('كلمة المرور الجديدة يجب أن تكون 6 أحرف/أرقام على الأقل.');
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
        setTimeout(() => setPassSuccess(false), 4500);
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
        <div className="p-16 text-center text-xs font-black text-[#1D2D2E] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-[#1D2D2E] border-t-[#FF7E47] rounded-full animate-spin"></div>
          <span>جاري تحميل إعدادات النظام وبيانات الدخول...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl pb-16">
        {/* Header */}
        <div className="border-b-[3px] border-[#1D2D2E] pb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFD95A] border-2 border-[#1D2D2E] text-[10px] font-black text-[#1D2D2E]">
              إعدادات النظام والأمان
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1D2D2E]">إعدادات المنظومة وحساب الإدارة</h1>
          <p className="text-xs font-bold text-[#1D2D2E]/70 mt-1">
            إدارة اسم المستخدم، كلمة مرور المدير، أرقام التواصل والواتساب، والنصوص التعريفية للشركة.
          </p>
        </div>

        {/* 1. Admin Username & Profile Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-[3px] border-[#1D2D2E] shadow-[5px_5px_0px_#1D2D2E] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#1D2D2E]/15 pb-4">
            <h3 className="text-base font-black text-[#1D2D2E] flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#FF7E47]" />
              <span>تغيير اسم المستخدم وبيانات المدير (Admin Profile)</span>
            </h3>
            <span className="text-[11px] font-black px-3 py-1 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-[#1D2D2E]">
              اسم المستخدم الحالي: <span className="text-[#FF7E47] font-mono font-bold">@{adminUsername}</span>
            </span>
          </div>

          {profileSuccess && (
            <div className="p-4 rounded-2xl bg-[#A5F3CF] border-2 border-[#1D2D2E] text-[#1D2D2E] text-xs font-black flex items-center gap-2 shadow-[3px_3px_0px_#1D2D2E] animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#1D2D2E] shrink-0" />
              <span>تم تحديث اسم المستخدم والبيانات الشخصية للمدير بنجاح!</span>
            </div>
          )}

          {profileError && (
            <div className="p-4 rounded-2xl bg-rose-100 border-2 border-rose-600 text-rose-800 text-xs font-black flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateUsernameAndProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-[#1D2D2E] mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FF7E47]" />
                  <span>اسم المستخدم لتسجيل الدخول (Username)</span>
                </label>
                <div className="relative">
                  <input
                    id="input-admin-username"
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-black text-[#1D2D2E] focus:outline-none focus:bg-white"
                    dir="ltr"
                  />
                </div>
                <p className="text-[10px] text-[#1D2D2E]/60 font-bold mt-1">
                  * يُستخدم لتسجيل الدخول إلى لوحة التحكم (باللغة الإنجليزية أو الأرقام).
                </p>
              </div>

              <div>
                <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">
                  الاسم الظاهر للمدير (Display Name)
                </label>
                <input
                  id="input-admin-name"
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="مدير عام سما البارقة"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] focus:outline-none focus:bg-white"
                />
                <p className="text-[10px] text-[#1D2D2E]/60 font-bold mt-1">
                  * يظهر في أعلى الشريط الجانبي وسجلات التدقيق.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">
                  البريد الإلكتروني لحساب الإدارة
                </label>
                <input
                  id="input-admin-email"
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@samabarqah.iq"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] focus:outline-none focus:bg-white"
                  dir="ltr"
                />
              </div>
            </div>

            <button
              id="btn-save-username-profile"
              type="submit"
              disabled={profileSaving}
              className="px-6 py-2.5 rounded-xl bg-[#FFD95A] hover:bg-[#fcd34d] text-[#1D2D2E] border-2 border-[#1D2D2E] font-black text-xs shadow-[2px_2px_0px_#1D2D2E] active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {profileSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ وتحديث اسم المستخدم</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* 2. Change Password Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-[3px] border-[#1D2D2E] shadow-[5px_5px_0px_#1D2D2E] space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#1D2D2E]/15 pb-4">
            <h3 className="text-base font-black text-[#1D2D2E] flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#FF7E47]" />
              <span>تغيير كلمة المرور من الإعدادات (Change Password)</span>
            </h3>
            <span className="text-[11px] font-bold text-[#1D2D2E]/60 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-[#FF7E47]" />
              <span>تشفير آمن</span>
            </span>
          </div>

          {passSuccess && (
            <div className="p-4 rounded-2xl bg-[#A5F3CF] border-2 border-[#1D2D2E] text-[#1D2D2E] text-xs font-black flex items-center gap-2 shadow-[3px_3px_0px_#1D2D2E] animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#1D2D2E] shrink-0" />
              <span>تم تحديث وتغيير كلمة المرور بنجاح! يمكنك استخدامها في تسجيلات الدخول القادمة.</span>
            </div>
          )}

          {passError && (
            <div className="p-4 rounded-2xl bg-rose-100 border-2 border-rose-600 text-rose-800 text-xs font-black flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{passError}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">
                كلمة المرور الحالية (Current Password)
              </label>
              <div className="relative">
                <input
                  id="input-current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  placeholder="أدخل كلمة المرور الحالية"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] focus:outline-none focus:bg-white"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute left-3 top-2.5 text-[#1D2D2E] hover:text-[#FF7E47] cursor-pointer p-0.5"
                  title={showCurrentPassword ? 'إخفاء' : 'إظهار'}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">
                  كلمة المرور الجديدة (New Password)
                </label>
                <div className="relative">
                  <input
                    id="input-new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="6 خانات على الأقل"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] focus:outline-none focus:bg-white"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute left-3 top-2.5 text-[#1D2D2E] hover:text-[#FF7E47] cursor-pointer p-0.5"
                    title={showNewPassword ? 'إخفاء' : 'إظهار'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">
                  تأكيد كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <input
                    id="input-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="أعد كتابة الكلمة الجديدة"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E] focus:outline-none focus:bg-white"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-2.5 text-[#1D2D2E] hover:text-[#FF7E47] cursor-pointer p-0.5"
                    title={showConfirmPassword ? 'إخفاء' : 'إظهار'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              id="btn-submit-change-password"
              type="submit"
              disabled={passLoading}
              className="px-6 py-2.5 rounded-xl bg-[#FF7E47] hover:bg-[#ff6c2f] text-white border-2 border-[#1D2D2E] font-black text-xs shadow-[2px_2px_0px_#1D2D2E] active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {passLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري تحديث كلمة المرور...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>تأكيد وتحديث كلمة المرور</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* 3. Site Settings Form */}
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
                <span>بيانات الاتصال والمقر العام للشركة</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">اسم الشركة بالعربي</label>
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
                  <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">رقم الواتساب للتواصل المباشر</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber || settings.phone}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value, whatsapp: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E]"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">البريد الإلكتروني للشركة</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-bold text-[#1D2D2E]"
                    dir="ltr"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">عنوان المقر ونقطة التجمع</label>
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
              id="btn-save-site-settings"
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-2xl bg-[#FF7E47] hover:bg-[#ff6c2f] text-white border-2 border-[#1D2D2E] font-black text-xs shadow-[3px_3px_0px_#1D2D2E] active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>حفظ إعدادات الموقع</span>
            </button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
