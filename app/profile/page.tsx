'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { BookingVoucherModal } from '@/components/BookingVoucherModal';
import { Booking } from '@/lib/db';
import {
  User,
  Phone,
  Mail,
  Lock,
  Compass,
  FileText,
  Printer,
  Sparkles,
  LogOut,
  Edit,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserCheck,
  ShieldCheck,
  Calendar,
  LogIn
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isLoggedIn, isGuest, userBookings, logout, updateProfile, openAuthModal } = useUserAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Voucher modal state
  const [voucherBooking, setVoucherBooking] = useState<Booking | null>(null);

  const startEditing = () => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone && !user.phone.startsWith('guest-') ? user.phone : '');
      setEmail(user.email || '');
    }
    setPassword('');
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsEditing(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await updateProfile({
      name: name.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      password: password || undefined
    });

    setLoading(false);
    if (res.success) {
      setSuccessMsg('تم حفظ وتحديث بيانات حسابك بنجاح!');
      setIsEditing(false);
      setPassword('');
    } else {
      setErrorMsg(res.error || 'تعذر تحديث البيانات');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFFF5] text-[#1D2D2E]">
        <Navbar />
        <main className="flex-1 max-w-lg mx-auto px-4 py-16 w-full flex items-center justify-center">
          <div className="bg-white border-3 border-[#1D2D2E] rounded-3xl p-8 shadow-[8px_8px_0px_#1D2D2E] text-center space-y-4 w-full">
            <div className="w-16 h-16 rounded-2xl bg-[#FFD95A] border-2 border-[#1D2D2E] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#1D2D2E]">
              <User className="w-8 h-8 text-[#1D2D2E]" />
            </div>
            <h1 className="text-xl font-black text-[#1D2D2E]">الملف الشخصي والحجوزات</h1>
            <p className="text-xs font-bold text-gray-600">
              يرجى تسجيل الدخول أو المتابعة كزائر للاطلاع على ملفك وسجل حجوزاتك السياحية.
            </p>
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => openAuthModal('login')}
                className="w-full py-3 rounded-2xl bg-[#FF7E47] hover:bg-[#ff6c2f] text-white border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </button>

              <button
                onClick={() => openAuthModal('guest')}
                className="w-full py-3 rounded-2xl bg-[#FFD95A] hover:bg-[#fbd34c] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>المتابعة كزائر 👤</span>
              </button>

              <Link
                href="/track-booking"
                className="w-full py-3 rounded-2xl bg-white hover:bg-gray-50 text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] font-black text-xs flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#FF7E47]" />
                <span>الاستعلام عن حجز برقم الحجز أو الهاتف</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFFF5] text-[#1D2D2E]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* User Profile Header Card */}
        <div className="bg-white border-3 border-[#1D2D2E] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#1D2D2E] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#1D2D2E] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#A5F3CF] border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] flex items-center justify-center font-black text-2xl text-[#1D2D2E]">
                {user?.name ? user.name[0] : 'س'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#1D2D2E]">{user?.name}</h1>
                  {isGuest ? (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FFD95A] text-[#1D2D2E] border border-[#1D2D2E]">
                      حساب زائر 👤
                    </span>
                  ) : (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#A5F3CF] text-emerald-900 border border-[#1D2D2E]">
                      عميل معتمد ✓
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-600">
                  {user?.phone && !user.phone.startsWith('guest-') && (
                    <span dir="ltr" className="font-mono">
                      📞 {user.phone}
                    </span>
                  )}
                  {user?.email && <span>✉️ {user.email}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => (isEditing ? setIsEditing(false) : startEditing())}
                className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>{isEditing ? 'إلغاء التعديل' : 'تعديل البيانات'}</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-300 shadow-[2px_2px_0px_rgba(0,0,0,0.1)] text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>

          {/* If Guest: Prompt to convert to full registered user */}
          {isGuest && (
            <div className="p-4 rounded-2xl bg-[#FFD95A]/25 border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-1">
                <strong className="text-xs font-black text-[#1D2D2E] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF7E47]" />
                  هل ترغب في حفظ حجوزاتك بشكل دائم؟
                </strong>
                <p className="text-[11px] font-bold text-gray-600">
                  يمكنك تحويل حساب الزائر إلى حساب رسمي عبر تعيين كلمة مرور ورقم هاتف في قسم تعديل البيانات.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-[#FF7E47] text-white border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-xs font-black cursor-pointer shrink-0"
              >
                تثبيت الحساب بكلمة مرور 🔐
              </button>
            </div>
          )}

          {/* Edit Profile Form */}
          {isEditing && (
            <form onSubmit={handleUpdate} className="p-4 rounded-2xl bg-gray-50 border-2 border-[#1D2D2E] space-y-4">
              <h3 className="text-xs font-black text-[#1D2D2E]">تعديل البيانات الشخصية:</h3>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-gray-700 mb-1">الاسم الكامل:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#1D2D2E] bg-white text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-gray-700 mb-1">رقم الهاتف:</label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0770xxxxxxx"
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#1D2D2E] bg-white text-xs font-bold text-right"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-gray-700 mb-1">البريد الإلكتروني:</label>
                  <input
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#1D2D2E] bg-white text-xs font-bold text-right"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-gray-700 mb-1">
                    كلمة المرور الجديدة (اتركها فارغة إذا لم ترغب في التغيير):
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#1D2D2E] bg-white text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-[#A5F3CF] hover:bg-[#8eeebf] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-xs font-black flex items-center gap-2 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>حفظ التعديلات</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-200 text-gray-700 text-xs font-black cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}
        </div>

        {/* User Bookings Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-[#1D2D2E] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#FF7E47]" />
              سجل حجوزاتك السياحية ({userBookings.length})
            </h2>

            <Link
              href="/track-booking"
              className="px-3 py-1.5 rounded-xl bg-[#FFD95A] hover:bg-[#fcd34d] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-xs font-black flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>البحث برقم حجز آخر 🔍</span>
            </Link>
          </div>

          {userBookings.length === 0 ? (
            <div className="bg-white border-3 border-[#1D2D2E] rounded-3xl p-8 text-center space-y-3 shadow-[6px_6px_0px_#1D2D2E]">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center mx-auto text-amber-700">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-[#1D2D2E]">لا توجد حجوزات مسجلة برقم هاتفك حتى الآن</h3>
              <p className="text-xs font-bold text-gray-500 max-w-md mx-auto">
                عند قيامك بحجز أي رحلة سياحية، ستظهر تفاصيل الحجز ومسار تأكيده هنا مباشرة.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <Link
                  href="/trips"
                  className="px-5 py-2.5 rounded-xl bg-[#FF7E47] text-white border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-xs font-black"
                >
                  استكشف رحلاتنا السياحية 🚀
                </Link>
                <Link
                  href="/track-booking"
                  className="px-4 py-2.5 rounded-xl bg-gray-100 text-[#1D2D2E] border-2 border-[#1D2D2E] text-xs font-black"
                >
                  تتبع حجز سابق
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userBookings.map((booking) => {
                const isConfirmed = booking.status === 'مؤكد' || booking.status === 'مكتمل';
                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-3xl border-3 border-[#1D2D2E] shadow-[6px_6px_0px_#1D2D2E] p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block">رقم الحجز</span>
                        <span className="text-base font-black font-mono text-[#FF7E47]">#{booking.id}</span>
                      </div>
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                          isConfirmed
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
                            : 'bg-amber-50 text-amber-800 border-amber-500'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-bold">
                      <div className="text-[#1D2D2E] font-black text-sm">{booking.tripTitle}</div>
                      <div className="flex justify-between text-gray-600">
                        <span>الوجهة:</span>
                        <span className="text-emerald-800">{booking.destination}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>المسافرين:</span>
                        <span>{booking.travelerCount} مسافرين</span>
                      </div>
                      <div className="flex justify-between border-t border-dashed border-gray-200 pt-1.5 text-gray-800">
                        <span>المبلغ الإجمالي:</span>
                        <span className="font-mono font-black text-[#FF7E47]">
                          {booking.totalPrice.toLocaleString()} {booking.currency}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setVoucherBooking(booking)}
                        className="flex-1 py-2 rounded-xl bg-[#FFD95A] hover:bg-[#fcd34d] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>سند الحجز الرسمي 🖨️</span>
                      </button>

                      <Link
                        href={`/track-booking?query=${booking.id}`}
                        className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1D2D2E] border-2 border-[#1D2D2E] text-xs font-black flex items-center gap-1"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>المسار</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Voucher Modal */}
      {voucherBooking && (
        <BookingVoucherModal
          booking={voucherBooking}
          onClose={() => setVoucherBooking(null)}
        />
      )}

      <Footer />
    </div>
  );
}
