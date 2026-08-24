'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Phone, Menu, X, Calendar, Shield, Sparkles } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'الرحلات', href: '/trips' },
    { name: 'العروض', href: '/offers' },
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
          <Link href="/" id="navbar-brand-logo" className="flex items-center gap-2.5 group">
            <span className="text-2xl sm:text-3xl transition-transform group-hover:scale-110">✈️</span>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-[#FF7E47] tracking-tight flex items-center gap-1.5 leading-none">
                سما البارقة
              </span>
              <span className="text-[10px] text-[#1D2D2E]/70 font-extrabold tracking-wider mt-0.5">
                سافر معنا… نحو تجربة لا تُنسى ✨
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const active = isCurrentPage(link.href);
              return (
                <Link
                  key={link.href}
                  id={`nav-link-${link.href.replace('/', '') || 'home'}`}
                  href={link.href}
                  className={`relative text-sm font-bold transition-colors py-1 ${
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

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              id="navbar-contact-phone"
              href="tel:07782528287"
              className="flex items-center gap-1.5 text-xs font-bold text-[#1D2D2E] bg-[#FDFFF5] px-3.5 py-2 rounded-xl border-2 border-[#1D2D2E] hover:bg-[#FFD95A] transition-colors shadow-[2px_2px_0px_#1D2D2E]"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF7E47]" />
              <span dir="ltr">0778 252 8287</span>
            </a>

            <Link
              id="navbar-cta-book-btn"
              href="/trips"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-black text-white bg-[#FF7E47] border-2 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] hover:shadow-[2px_2px_0px_#1D2D2E] hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              <span>احجز الآن ✨</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              id="navbar-mobile-cta"
              href="/trips"
              className="px-3 py-1.5 rounded-xl text-xs font-black text-white bg-[#FF7E47] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]"
            >
              احجز الآن ✨
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
        <div className="md:hidden bg-white border-t-2 border-[#1D2D2E] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-base font-bold transition-all border-2 ${
                isCurrentPage(link.href)
                  ? 'bg-[#A5F3CF] border-[#1D2D2E] text-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]'
                  : 'border-transparent text-[#1D2D2E] hover:bg-[#FDFFF5]'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t-2 border-dashed border-[#1D2D2E]/20 flex flex-col gap-2">
            <a
              href="tel:07782528287"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFD95A] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] text-[#1D2D2E] font-black text-sm"
            >
              <Phone className="w-4 h-4 text-[#FF7E47]" />
              <span dir="ltr">0778 252 8287</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
