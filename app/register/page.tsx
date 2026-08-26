'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuthCard } from '@/components/AuthCard';
import { useUserAuth } from '@/contexts/UserAuthContext';

export default function RegisterPage() {
  const { isLoggedIn, isGuest } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn && !isGuest) {
      router.push('/profile');
    }
  }, [isLoggedIn, isGuest, router]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFFF5] text-[#1D2D2E]">
      <Navbar brandOnly />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 sm:py-16 w-full flex items-center justify-center">
        <AuthCard
          initialTab="register"
          onSuccess={() => router.push('/')}
          showExploreOption={true}
        />
      </main>

      <Footer />
    </div>
  );
}
