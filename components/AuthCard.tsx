'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '@/contexts/UserAuthContext';
import {
  LogIn,
  UserPlus,
  UserCheck,
  Phone,
  Lock,
  Mail,
  User,
  AlertCircle,
  Loader2,
  Sparkles,
  Search,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { SamaLogo } from '@/components/SamaLogo';
import Link from 'next/link';

interface AuthCardProps {
  initialTab?: 'login' | 'register' | 'guest';
  onSuccess?: () => void;
  showExploreOption?: boolean;
}

export function AuthCard({
  initialTab = 'login',
  onSuccess,
  showExploreOption = true
}: AuthCardProps) {
  const router = useRouter();
  const { login, register, continueAsGuest } = useUserAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'guest'>(initialTab);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Guest form state
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // Quick Track state
  const [quickTrackQuery, setQuickTrackQuery] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginIdentifier.trim()) {
      setErrorMsg('يرجى إدخال رقم الهاتف أو البريد الإلكتروني');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('يرجى إدخال كلمة المرور');
      return;
    }

    setLoading(true);
    const result = await login(loginIdentifier.trim(), loginPassword);
    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.error || 'تعذر تسجيل الدخول، يرجى التأكد من البيانات');
    } else {
      if (onSuccess) onSuccess();
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!regName.trim() || regName.trim().length < 2) {
      setErrorMsg('يرجى كتابة الاسم الثلاثي الكامل');
      return;
    }
    if (!regPhone.trim() || regPhone.replace(/\D/g, '').length < 8) {
      setErrorMsg('يرجى كتابة رقم هاتف عراقي صحيح للتواصل');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setErrorMsg('كلمة المرور يجب ألا تقل عن 4 خانات');
      return;
    }

    setLoading(true);
    const result = await register({
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim() || undefined,
      password: regPassword
    });
    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.error || 'تعذر إنشاء الحساب');
    } else {
      if (onSuccess) onSuccess();
    }
  };

  const handleGuestSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    setLoading(true);
    const result = await continueAsGuest(
      guestName.trim() || 'زائر كريم',
      guestPhone.trim() || undefined
    );
    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.error || 'تعذر المتابعة كزائر');
    } else {
      if (onSuccess) onSuccess();
    }
  };

  const handleQuickTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTrackQuery.trim()) return;
    router.push(`/track-booking?query=${encodeURIComponent(quickTrackQuery.trim())}`);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white border-3 border-[#1D2D2E] rounded-3xl shadow-[8px_8px_0px_#1D2D2E] overflow-hidden">
      {/* Brand Header */}
      <div className="bg-[#FDFFF5] border-b-3 border-[#1D2D2E] p-6 text-center space-y-3">
        <div className="flex justify-center">
          <SamaLogo size="md" variant="horizontal" />
        </div>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A5F3CF] border border-[#1D2D2E] text-[11px] font-black text-[#1D2D2E]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>بوابة العملاء والمسافرين المعتمدة</span>
          </div>
          <p className="text-xs font-bold text-gray-500">
            سجل دخولك أو اضغط «تصفح الرحلات» لاستكشاف ومتابعة أجمل وجهات الشمال والرحلات السياحية
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 bg-gray-100 border-b-2 border-[#1D2D2E] p-1.5 gap-1.5 text-xs font-black">
        <button
          type="button"
          onClick={() => {
            setActiveTab('login');
            setErrorMsg(null);
          }}
          className={`py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'login'
              ? 'bg-white text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]'
              : 'text-gray-600 hover:text-[#1D2D2E]'
          }`}
        >
          <LogIn className="w-4 h-4 text-[#FF7E47]" />
          <span>تسجيل الدخول</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('register');
            setErrorMsg(null);
          }}
          className={`py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'register'
              ? 'bg-white text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]'
              : 'text-gray-600 hover:text-[#1D2D2E]'
          }`}
        >
          <UserPlus className="w-4 h-4 text-emerald-600" />
          <span>حساب جديد</span>
        </button>

            <button
              type="button"
              onClick={() => handleGuestSubmit()}
              disabled={loading}
              className="py-3 px-2 rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-[#FFD95A] hover:bg-[#fcd343] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] hover:translate-x-0.5 hover:translate-y-0.5"
              title="الانتقال الفوري وتصفح كافة الرحلات والعروض بدون حساب"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Compass className="w-4 h-4 text-[#FF7E47]" />
              )}
              <span>تصفح الرحلات 🧭</span>
            </button>
      </div>

      {/* Form Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-400 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">
                رقم الهاتف أو البريد الإلكتروني:
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثال: 07782528287 أو البريد"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-3 pr-10 py-3 rounded-xl border-2 border-[#1D2D2E] bg-white text-xs font-bold focus:bg-[#FDFFF5] focus:outline-none focus:ring-2 focus:ring-[#FF7E47]"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">
                كلمة المرور:
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-3 pr-10 py-3 rounded-xl border-2 border-[#1D2D2E] bg-white text-xs font-bold focus:bg-[#FDFFF5] focus:outline-none focus:ring-2 focus:ring-[#FF7E47]"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#FF7E47] hover:bg-[#ff6c2f] text-white border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all hover:translate-x-0.5 hover:translate-y-0.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              <span>تسجيل الدخول ومتابعة الرحلات</span>
            </button>

            <div className="pt-2 flex items-center justify-between text-xs text-gray-600 font-bold border-t border-gray-100">
              <button
                type="button"
                onClick={() => handleGuestSubmit()}
                className="text-amber-800 hover:text-amber-900 font-black flex items-center gap-1 cursor-pointer"
                title="الانتقال الفوري لتصفح الرحلات"
              >
                <Compass className="w-3.5 h-3.5 text-[#FF7E47]" />
                <span>تصفح الرحلات مباشرة 🧭</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-[#FF7E47] font-black hover:underline cursor-pointer"
              >
                إنشاء حساب جديد
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: REGISTER */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1">
                الاسم الكامل (الثلاثي):
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثال: علي ماجد الكعبي"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border-2 border-[#1D2D2E] bg-white text-xs font-bold focus:bg-[#FDFFF5] focus:outline-none"
                />
                <User className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1">
                رقم الهاتف (للتواصل وتأكيد الحجز):
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="0770xxxxxxx"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border-2 border-[#1D2D2E] bg-white text-xs font-bold text-right focus:bg-[#FDFFF5] focus:outline-none"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1">
                البريد الإلكتروني (اختياري):
              </label>
              <div className="relative">
                <input
                  type="email"
                  dir="ltr"
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border-2 border-[#1D2D2E] bg-white text-xs font-bold text-right focus:bg-[#FDFFF5] focus:outline-none"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1">
                كلمة المرور للحساب:
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="4 خانات أو أكثر"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border-2 border-[#1D2D2E] bg-white text-xs font-bold focus:bg-[#FDFFF5] focus:outline-none"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#A5F3CF] hover:bg-[#8defbf] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all hover:translate-x-0.5 hover:translate-y-0.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              <span>إنشاء حساب جديد وتأكيد الدخول</span>
            </button>

            <div className="pt-2 text-center text-xs text-gray-600 font-bold border-t border-gray-100 flex items-center justify-center gap-2">
              <span>لديك حساب قائم؟</span>
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-[#FF7E47] font-black hover:underline cursor-pointer"
              >
                تسجيل الدخول
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: GUEST */}
        {activeTab === 'guest' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#FFD95A]/25 border-2 border-[#1D2D2E] text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#1D2D2E] font-black text-sm">
                <Sparkles className="w-4 h-4 text-[#FF7E47]" />
                <span>المتابعة والاستكشاف كزائر (تصفح الرحلات فقط) 👁️</span>
              </div>
              <p className="text-gray-700 leading-relaxed font-bold">
                يمكنك كزائر تصفح كافة جداول الرحلات، البرامج السياحية، الأسعار، والمقاعد المتاحة. 
                <span className="block text-rose-700 font-black mt-1">
                  ⚠️ ملاحظة: الحجز الفعلي وتثبيت المقاعد وإصدار سندات السفر يتطلب تسجيل حساب برقم هاتفك.
                </span>
              </p>
            </div>

            <form onSubmit={handleGuestSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-[#1D2D2E] mb-1">
                  اسمك الكريم (اختياري):
                </label>
                <input
                  type="text"
                  placeholder="مثال: زائر كريم"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-[#1D2D2E] bg-white text-xs font-bold focus:bg-[#FDFFF5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#1D2D2E] mb-1">
                  رقم الهاتف (اختياري):
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="0770xxxxxxx"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-[#1D2D2E] bg-white text-xs font-bold text-right focus:bg-[#FDFFF5] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-[#FFD95A] hover:bg-[#fbd34c] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all hover:translate-x-0.5 hover:translate-y-0.5"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                  <span>المتابعة لتصفح الرحلات كزائر 👁️</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Quick Booking Tracker Section */}
        <div className="pt-4 border-t-2 border-dashed border-[#1D2D2E]/20 space-y-3">
          <div className="flex items-center justify-between text-xs font-black text-[#1D2D2E]">
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#FF7E47]" />
              <span>هل لديك رقم حجز مسبق وتريد تتبعه؟</span>
            </div>
            <Link
              href="/track-booking"
              className="text-[11px] text-[#FF7E47] hover:underline font-black"
            >
              صفحة التتبع 🔍
            </Link>
          </div>

          <form onSubmit={handleQuickTrackSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="أدخل رقم الحجز (مثال: SB-2026-0001) أو الهاتف"
              value={quickTrackQuery}
              onChange={(e) => setQuickTrackQuery(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border-2 border-[#1D2D2E] text-xs font-bold bg-[#FDFFF5] focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white hover:bg-gray-50 text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-xs font-black flex items-center gap-1 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>استعلام</span>
            </button>
          </form>
        </div>

        {/* Fast explore button if enabled */}
        {showExploreOption && (
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => handleGuestSubmit()}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-[#FFD95A]/30 hover:bg-[#FFD95A]/70 text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all hover:translate-x-0.5 hover:translate-y-0.5"
            >
              <Compass className="w-4 h-4 text-[#FF7E47]" />
              <span>تصفح الرحلات والعروض السياحية مباشرة 🗺️</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
