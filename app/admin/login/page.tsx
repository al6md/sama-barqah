'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, User, Loader2, AlertCircle, ArrowLeft, Key, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123456');
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
          // Navigate to admin
          window.location.href = '/admin';
        } else {
          router.push('/admin');
        }
      } else {
        setErrorMsg(data.error || 'فشل تسجيل الدخول، يرجى التأكد من اسم المستخدم وكلمة المرور.');
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

  const handleQuickDemoLogin = () => {
    setUsername('admin');
    setPassword('admin123456');
    performLogin('admin', 'admin123456');
  };

  if (checkingInitial) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">جاري التحقق من حالة الدخول...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-amber-400 selection:text-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 animate-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white">تسجيل دخول الإدارة</h1>
          <p className="text-xs text-slate-400">
            سما البارقة للسفر والسياحة - لوحة التحكم
          </p>
        </div>

        {/* Quick Demo Helper Credentials Alert */}
        <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-amber-500/30 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <Key className="w-3.5 h-3.5" />
              <span>بيانات الدخول المعتمدة للإدارة:</span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-[10px] bg-amber-400 text-slate-950 font-black px-2.5 py-1 rounded-lg hover:bg-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>دخول سريع فوري</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            اسم المستخدم: <code className="text-amber-300 font-bold">admin</code> | كلمة المرور: <code className="text-amber-300 font-bold">admin123456</code>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              اسم المستخدم أو البريد
            </label>
            <div className="relative">
              <input
                id="admin-login-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                dir="ltr"
              />
              <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                id="admin-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                dir="ltr"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <button
            id="btn-admin-login-submit"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <>
                <span>دخول لوحة التحكم</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← العودة للموقع العام
          </Link>
        </div>
      </div>
    </div>
  );
}

