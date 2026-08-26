'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Menu, X, User, LogIn, Compass, ChevronDown, UserCheck, LogOut } from 'lucide-react';
import { SamaLogo } from '@/components/SamaLogo';
import { useUserAuth } from '@/contexts/UserAuthContext';

interface NavbarProps {
  brandOnly?: boolean;
}

export function Navbar({ brandOnly = false }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isLoggedIn, isGuest, logout, openAuthModal } = useUserAuth();

  const isAuthPage = brandOnly || pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return (
      <header
        id="main-navbar-brand-only"
        className="sticky top-0 left-0 right-0 z-50 bg-white border-b-3 border-[#1D2D2E] shadow-sm py-3 sm:py-4 transition-all duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <Link href="/" id="navbar-brand-logo-only" className="flex items-center group">
            <SamaLogo size="md" variant="horizontal" />
          </Link>
        </div>
      </header>
    );
  }

  const navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'الرحلات', href: '/trips' },
    { name: 'العروض', href: '/offers' },
    { name: 'متابعة الحجز 🔍', href: '/track-booking' },
    { name: 'عن الشركة', href: '/about' },
    { name: 'تواصل معنا', href: '/contact' }
  ];

  const isCurrentPage = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 left-0 right-0 z-50 bg-white border-b-3 border-[#1D2D2E] transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" id="navbar-brand-logo" className="flex items-center group">
            <SamaLogo size="sm" variant="horizontal" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => {
              const active = isCurrentPage(link.href);
              return (
                <Link
                  key={link.href}
                  id={`nav-link-${link.href.replace(/[\/🔍\s]/g, '') || 'home'}`}
                  href={link.href}
                  className={`relative text-xs xl:text-sm font-bold transition-colors py-1 ${
                    active
                      ? 'text-[#1D2D2E]'
                      : 'text-[#1D2D2E]/80 hover:text-[#FF7E47]'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-2 bg-[#A5F3CF] -z-10 rounded-sm"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons & User Menu */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* User Account / Guest Button */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-[#1D2D2E] text-xs font-black shadow-[2px_2px_0px_#1D2D2E] cursor-pointer transition-all hover:translate-x-0.5 hover:translate-y-0.5 ${
                    isGuest ? 'bg-[#FFD95A]' : 'bg-[#A5F3CF]'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white border border-[#1D2D2E] flex items-center justify-center text-[10px] font-black">
                    {user?.name ? user.name[0] : '👤'}
                  </div>
                  <span className="max-w-[110px] truncate">{user?.name || 'حسابي'}</span>
                  {isGuest && <span className="text-[9px] bg-white px-1.5 py-0.2 rounded border border-[#1D2D2E]">زائر</span>}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-700" />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div
                    className="absolute left-0 mt-2 w-48 bg-white border-2 border-[#1D2D2E] rounded-2xl shadow-[4px_4px_0px_#1D2D2E] p-2 space-y-1 z-50 animate-in fade-in zoom-in-95"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-gray-100">
                      <div className="text-xs font-black text-[#1D2D2E] truncate">{user?.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono truncate">
                        {isGuest ? 'وضع التصفح كزائر 👁️' : (user?.phone || 'عميل مسجل')}
                      </div>
                    </div>

                    {isGuest && (
                      <button
                        type="button"
                        onClick={() => openAuthModal('register')}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black text-white bg-[#FF7E47] hover:bg-[#e66a35] cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>تسجيل حساب للحجز 🔐</span>
                      </button>
                    )}

                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#1D2D2E] hover:bg-[#FDFFF5]"
                    >
                      <User className="w-3.5 h-3.5 text-[#FF7E47]" />
                      <span>{isGuest ? 'سجل التصفح' : 'الملف والحجوزات'}</span>
                    </Link>

                    <Link
                      href="/track-booking"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#1D2D2E] hover:bg-[#FDFFF5]"
                    >
                      <Compass className="w-3.5 h-3.5 text-emerald-600" />
                      <span>متابعة حالة الحجز</span>
                    </Link>

                    <button
                      type="button"
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1 text-xs font-bold text-[#1D2D2E] bg-white hover:bg-[#FDFFF5] px-3 py-2 rounded-xl border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#FF7E47]" />
                  <span>دخول</span>
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('guest')}
                  className="flex items-center gap-1 text-xs font-black text-[#1D2D2E] bg-[#FFD95A] hover:bg-[#fbd34c] px-3 py-2 rounded-xl border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] cursor-pointer"
                  title="الدخول الفوري كزائر بدون كلمة مرور"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>دخول كزائر</span>
                </button>
              </div>
            )}

            <a
              id="navbar-contact-phone"
              href="tel:07782528287"
              className="flex items-center gap-1 text-xs font-bold text-[#1D2D2E] bg-[#FDFFF5] px-3 py-2 rounded-xl border-2 border-[#1D2D2E] hover:bg-gray-50 transition-colors shadow-[2px_2px_0px_#1D2D2E]"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF7E47]" />
              <span dir="ltr">0778 252 8287</span>
            </a>

            <Link
              id="navbar-cta-book-btn"
              href="/trips"
              className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl text-xs font-black text-white bg-[#FF7E47] border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] hover:shadow-[1px_1px_0px_#1D2D2E] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <span>احجز الآن ✨</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              id="navbar-mobile-cta"
              href="/track-booking"
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-black text-[#1D2D2E] bg-[#FFD95A] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]"
            >
              متابعة الحجز 🔍
            </Link>
            <button
              id="navbar-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#1D2D2E] bg-white border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] focus:outline-none cursor-pointer"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t-2 border-[#1D2D2E] px-4 pt-3 pb-6 space-y-2.5 shadow-xl animate-in slide-in-from-top-2">
          {/* User Status Bar in Mobile */}
          <div className="p-3 bg-[#FDFFF5] border-2 border-[#1D2D2E] rounded-2xl flex items-center justify-between">
            {isLoggedIn ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FFD95A] border border-[#1D2D2E] flex items-center justify-center text-xs font-black">
                    {user?.name ? user.name[0] : '👤'}
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#1D2D2E]">{user?.name}</div>
                    <div className="text-[10px] text-gray-500">{isGuest ? 'حساب زائر' : 'عميل مسجل'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2.5 py-1 rounded-lg bg-[#A5F3CF] border border-[#1D2D2E] text-[11px] font-black text-[#1D2D2E]"
                  >
                    ملفي
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-100 border border-rose-300 text-[11px] font-black text-rose-800"
                  >
                    خروج
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full gap-2">
                <span className="text-xs font-bold text-[#1D2D2E]">أهلاً بك زائرنا الكريم:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      openAuthModal('guest');
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#FFD95A] border-2 border-[#1D2D2E] text-xs font-black"
                  >
                    دخول كزائر 👤
                  </button>
                  <button
                    onClick={() => {
                      openAuthModal('login');
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#FF7E47] text-white border-2 border-[#1D2D2E] text-xs font-black"
                  >
                    تسجيل الدخول
                  </button>
                </div>
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                isCurrentPage(link.href)
                  ? 'bg-[#A5F3CF] border-[#1D2D2E] text-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]'
                  : 'border-transparent text-[#1D2D2E] hover:bg-[#FDFFF5]'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-2 border-t-2 border-dashed border-[#1D2D2E]/20 flex flex-col gap-2">
            <Link
              href="/trips"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF7E47] text-white border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] font-black text-sm"
            >
              <span>احجز رحلتك الآن ✨</span>
            </Link>
            <a
              href="tel:07782528287"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] text-[#1D2D2E] font-bold text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF7E47]" />
              <span dir="ltr">0778 252 8287</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

