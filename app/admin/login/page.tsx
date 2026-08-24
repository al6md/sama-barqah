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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-amber-400/20"></div>
          <p className="text-xs text-slate-400 font-medium">جاري التحقق من أذونات الدخول المشفرة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-amber-400 selection:text-slate-950 relative overflow-hidden">
      {/* Subtle Background Glow Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Card Container */}
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-200">
          {/* Header Brand */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
              <Shield className="w-9 h-9" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">بوابة إدارة سما البارقة</h1>
              <p className="text-xs text-slate-400 mt-1">
                نظام الإدارة المركزي للحجوزات، البرامج السياحية، والمبيعات
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
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
                  className="w-full px-4 py-3 pr-11 rounded-2xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all placeholder:text-slate-600"
                  dir="ltr"
                />
                <User className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
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
                  className="w-full px-4 py-3 pr-11 pl-11 rounded-2xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all placeholder:text-slate-600"
                  dir="ltr"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-500 hover:text-slate-300 absolute left-3.5 top-3 cursor-pointer"
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
              className="w-full py-3.5 px-6 rounded-2xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
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
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>جلسة عمل آمنة ومشفرة</span>
            </span>
            <Link href="/" className="hover:text-amber-400 transition-colors">
              الموقع العام ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
