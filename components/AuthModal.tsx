'use client';

import React, { useEffect } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { AuthCard } from '@/components/AuthCard';
import { X } from 'lucide-react';

export function AuthModal() {
  const { isAuthModalOpen, authModalTab, closeAuthModal } = useUserAuth();

  useEffect(() => {
    if (!isAuthModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAuthModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  return (
    <div
      id="sama-auth-modal"
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-5 bg-[#1D2D2E]/80 backdrop-blur-xs flex justify-center items-start sm:items-center min-h-screen"
      onClick={closeAuthModal}
    >
      <div
        className="relative max-w-xl w-full my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuthModal}
          className="absolute left-4 top-4 z-20 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] cursor-pointer text-xs font-black"
          title="إغلاق النافذة"
        >
          <X className="w-4 h-4" />
          <span>إلغاء</span>
        </button>

        <AuthCard
          initialTab={authModalTab || 'login'}
          onSuccess={closeAuthModal}
          showExploreOption={false}
        />
      </div>
    </div>
  );
}
