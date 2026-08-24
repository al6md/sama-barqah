'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { TripCard } from '@/components/TripCard';
import { BookingModal } from '@/components/BookingModal';
import { Trip } from '@/lib/db';
import { Compass, Search, Filter, MapPin, Calendar, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

function TripsContent() {
  const searchParams = useSearchParams();
  const initialDestination = searchParams.get('destination') || '';

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTripForBooking, setSelectedTripForBooking] = useState<Trip | null>(null);

  // Filters
  const [selectedDestination, setSelectedDestination] = useState(initialDestination);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'date'>('default');

  useEffect(() => {
    fetch('/api/trips')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTrips(data.trips);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const destinationsList = useMemo(() => {
    const list = Array.from(new Set(trips.map((t) => t.destination)));
    return ['الكل', ...list];
  }, [trips]);

  const filteredTrips = useMemo(() => {
    return trips
      .filter((t) => {
        if (selectedDestination && selectedDestination !== 'الكل') {
          if (!t.destination.includes(selectedDestination) && !selectedDestination.includes(t.destination)) {
            return false;
          }
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchDest = t.destination.toLowerCase().includes(q);
          const matchDesc = t.description.toLowerCase().includes(q);
          if (!matchTitle && !matchDest && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'date') return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        return 0;
      });
  }, [trips, selectedDestination, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFFF5] text-[#1D2D2E]">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#4CC9FE] text-[#1D2D2E] border-b-3 border-[#1D2D2E] pt-28 pb-12 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-black bg-[#FFD95A] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] px-3.5 py-1 rounded-full uppercase inline-block">
            دليل الرحلات السياحية لعام 2026 🗺️
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1D2D2E] drop-shadow-[2px_2px_0px_white]">
            جميع الرحلات السياحية
          </h1>
          <p className="text-sm font-bold text-[#1D2D2E]/85 max-w-xl mx-auto">
            تصفح باقات السفر إلى أروع مناطق العراق وكردستان، مع تفاصيل البرامج والأسعار المحدثة لحظياً.
          </p>
        </div>
      </section>

      {/* Filters & Content Section */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        {/* Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-[24px] border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative col-span-1 sm:col-span-2">
              <input
                id="trips-search-input"
                type="text"
                placeholder="ابحث بالاسم، المدينة، أو المعلم السياحي..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] font-bold text-xs sm:text-sm focus:outline-none shadow-[2px_2px_0px_#1D2D2E] text-[#1D2D2E]"
              />
              <Search className="w-4 h-4 text-[#1D2D2E] absolute right-3.5 top-3.5" />
            </div>

            {/* Destination filter */}
            <div>
              <select
                id="trips-filter-destination"
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] font-bold text-xs sm:text-sm text-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] focus:outline-none cursor-pointer"
              >
                {destinationsList.map((d) => (
                  <option key={d} value={d === 'الكل' ? '' : d}>
                    {d === 'الكل' ? 'جميع الوجهات' : d}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort order */}
            <div>
              <select
                id="trips-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FDFFF5] border-2 border-[#1D2D2E] font-bold text-xs sm:text-sm text-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] focus:outline-none cursor-pointer"
              >
                <option value="default">الترتيب الافتراضي</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
                <option value="date">تاريخ الانطلاق الأقرب</option>
              </select>
            </div>
          </div>

          {/* Quick pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t-2 border-dashed border-[#1D2D2E]/20">
            <span className="text-xs text-[#1D2D2E] font-black ml-2">تصفية سريعة:</span>
            {destinationsList.map((d) => {
              const active = (d === 'الكل' && !selectedDestination) || selectedDestination === d;
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDestination(d === 'الكل' ? '' : d)}
                  className={`px-3 py-1 rounded-xl text-xs font-black border-2 border-[#1D2D2E] transition-all cursor-pointer ${
                    active
                      ? 'bg-[#FF7E47] text-white shadow-[2px_2px_0px_#1D2D2E]'
                      : 'bg-white text-[#1D2D2E] hover:bg-[#FFD95A]'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trips Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-[24px] bg-slate-200 border-3 border-slate-300"></div>
            ))}
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onBookClick={(t) => setSelectedTripForBooking(t)}
              />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-white rounded-[24px] border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FFD95A] border-2 border-[#1D2D2E] text-[#1D2D2E] flex items-center justify-center mx-auto shadow-[2px_2px_0px_#1D2D2E]">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-[#1D2D2E]">لا توجد رحلات مطابقة لمعايير البحث</h3>
            <p className="text-xs font-bold text-[#1D2D2E]/70 max-w-sm mx-auto">
              جرب تغيير كلمات البحث أو إزالة التصفية لمشاهدة جميع الرحلات السياحية المتوفرة.
            </p>
            <button
              onClick={() => {
                setSelectedDestination('');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#FF7E47] text-white text-xs font-black border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] hover:bg-[#e66a35] cursor-pointer"
            >
              عرض جميع الرحلات
            </button>
          </div>
        )}
      </section>

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

export default function TripsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFFF5]"></div>}>
      <TripsContent />
    </Suspense>
  );
}
