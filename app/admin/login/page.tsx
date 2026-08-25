'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Lock,
  User,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingInitial, setCheckingInitial] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('sama_admin_token') : null;
    fetch('/api/admin/auth', {
      headers: savedToken ? { Authorization: `Bearer ${savedToken}`, 'x-admin-token': savedToken } : {}
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.isAuthenticated) {
          router.replace('/admin');
        } else {
          setCheckingInitial(false);
        }
      })
      .catch(() => {
        setCheckingInitial(false);
      });
  }, [router]);

  const performLogin = async (userVal: string, passVal: string) => {
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          username: userVal.trim(),
          password: passVal.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof window !== 'undefined') {
          if (data.token) {
            localStorage.setItem('sama_admin_token', data.token);
            sessionStorage.setItem('sama_admin_token', data.token);
            try {
              document.cookie = `sama_admin_token=${data.token}; path=/; max-age=604800; SameSite=None; Secure`;
            } catch (e) {}
          }
          window.location.href = '/admin';
        } else {
          router.push('/admin');
        }
      } else {
        setErrorMsg(data.error || 'اسم المستخدم أو كلمة المرور غير صحيحة، يرجى المحاولة مجدداً.');
        setLoading(false);
      }
    } catch (e: any) {
      setErrorMsg('حدث خطأ في الاتصال بالخادم، يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(username, password);
  };

  if (checkingInitial) {
    return (
      <div className="min-h-screen bg-[#FDFFF5] flex items-center justify-center text-[#1D2D2E]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#1D2D2E] border-t-[#FF7E47] rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-[#1D2D2E] font-black">جاري التحقق من أذونات الدخول المشفرة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFFF5] flex items-center justify-center p-4 selection:bg-[#FFD95A] selection:text-[#1D2D2E] relative overflow-hidden">
      {/* Background Decorative Graphic Shapes */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#FFD95A]/40 rounded-full border-[3px] border-[#1D2D2E] pointer-events-none"></div>
      <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-[#4CC9FE]/30 rounded-3xl rotate-12 border-[3px] border-[#1D2D2E] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Card Container */}
        <div className="bg-white border-[3px] border-[#1D2D2E] rounded-3xl p-8 sm:p-10 shadow-[6px_6px_0px_#1D2D2E] space-y-8 animate-in zoom-in-95 duration-200">
          {/* Header Brand */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#FFD95A] border-2 border-[#1D2D2E] text-[#1D2D2E] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#1D2D2E]">
              <Shield className="w-9 h-9" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#1D2D2E] tracking-tight">بوابة إدارة سما البارقة</h1>
              <p className="text-xs font-bold text-[#1D2D2E]/70 mt-1">
                نظام الإدارة المركزي للحجوزات، البرامج السياحية، والمبيعات
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-100 border-2 border-rose-600 text-rose-800 text-xs font-black flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">
                اسم المستخدم أو البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  id="admin-login-username"
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 pr-11 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-black text-[#1D2D2E] focus:outline-none focus:bg-white shadow-[2px_2px_0px_#1D2D2E] transition-all placeholder:text-gray-400"
                  dir="ltr"
                />
                <User className="w-4 h-4 text-[#1D2D2E] absolute right-4 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#1D2D2E] mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="admin-login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 pl-11 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-xs font-black text-[#1D2D2E] focus:outline-none focus:bg-white shadow-[2px_2px_0px_#1D2D2E] transition-all placeholder:text-gray-400"
                  dir="ltr"
                />
                <Lock className="w-4 h-4 text-[#1D2D2E] absolute right-4 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-[#1D2D2E] hover:text-[#FF7E47] absolute left-3.5 top-3 cursor-pointer"
                  title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="btn-admin-login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl text-xs font-black text-white bg-[#FF7E47] hover:bg-[#ff6c2f] border-2 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <span>تسجيل الدخول إلى لوحة التحكم</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Secure & Encrypted Footnote */}
          <div className="pt-4 border-t-2 border-[#1D2D2E]/10 flex items-center justify-between text-[11px] font-bold text-[#1D2D2E]/70">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>جلسة عمل آمنة ومشفرة</span>
            </span>
            <Link href="/" className="hover:text-[#FF7E47] underline transition-colors">
              الموقع العام ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
