'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { TripCard } from '@/components/TripCard';
import { BookingModal } from '@/components/BookingModal';
import { Trip } from '@/lib/db';
import { Sparkles, Tag, Gift, CheckCircle2 } from 'lucide-react';

export default function OffersPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTripForBooking, setSelectedTripForBooking] = useState<Trip | null>(null);

  useEffect(() => {
    fetch('/api/trips?offer=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTrips(data.trips);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFFF5] text-[#1D2D2E]">
      <Navbar />

      <section className="bg-[#A5F3CF] text-[#1D2D2E] border-b-3 border-[#1D2D2E] pt-28 pb-12 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-black bg-[#FF7E47] text-white border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] px-3.5 py-1 rounded-full uppercase flex items-center gap-1.5 w-fit mx-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>باقات توفير حصرية لموسم 2026 🔥</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1D2D2E]">
            عروض وخصومات الرحلات السياحية
          </h1>
          <p className="text-sm font-bold text-[#1D2D2E]/80 max-w-xl mx-auto">
            استمتع بأفضل الأسعار وباقات الخصم المخصصة للعوائل والمجموعات على أرقى رحلات كردستان والعراق.
          </p>
        </div>
      </section>

      <main className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-[24px] bg-slate-200 border-3 border-slate-300"></div>
            ))}
          </div>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onBookClick={(t) => setSelectedTripForBooking(t)}
              />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-white rounded-[24px] border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#FFD95A] border-2 border-[#1D2D2E] flex items-center justify-center mx-auto shadow-[2px_2px_0px_#1D2D2E]">
              <Tag className="w-8 h-8 text-[#1D2D2E]" />
            </div>
            <h3 className="text-lg font-black text-[#1D2D2E]">ترقبوا عروضنا الجديدة قريباً!</h3>
            <p className="text-xs font-bold text-[#1D2D2E]/70 mt-1">
              يتم تحديث العروض الموسمية أسبوعياً.
            </p>
          </div>
        )}
      </main>

      <Footer />
      <FloatingWhatsApp />

      <BookingModal
        trip={selectedTripForBooking}
        isOpen={Boolean(selectedTripForBooking)}
        onClose={() => setSelectedTripForBooking(null)}
      />
    </div>
  );
}
