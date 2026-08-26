'use client';

import React from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { AuthCard } from '@/components/AuthCard';
import { X } from 'lucide-react';

export function AuthModal() {
  const { isAuthModalOpen, authModalTab, closeAuthModal } = useUserAuth();

  if (!isAuthModalOpen) return null;

  return (
    <div
      id="sama-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1D2D2E]/75 backdrop-blur-xs overflow-y-auto"
      onClick={closeAuthModal}
    >
      <div
        className="relative max-w-xl w-full my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuthModal}
          className="absolute left-4 top-4 z-20 p-2 rounded-xl bg-white hover:bg-gray-100 text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] cursor-pointer"
          title="إغلاق النافذة"
        >
          <X className="w-4 h-4" />
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
