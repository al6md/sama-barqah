'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { TripCard } from '@/components/TripCard';
import { BookingModal } from '@/components/BookingModal';
import { Trip } from '@/lib/db';
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  Search,
  Sparkles,
  ShieldCheck,
  Award,
  Bus,
  Hotel,
  Clock,
  ArrowLeft,
  Star,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

export default function HomePage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTripForBooking, setSelectedTripForBooking] = useState<Trip | null>(null);

  // Search Widget State
  const [searchDestination, setSearchDestination] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchTravelers, setSearchTravelers] = useState('2');

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

  const featuredTrips = trips.filter((t) => t.isFeatured);
  const offerTrips = trips.filter((t) => t.isOffer);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchDestination) query.set('destination', searchDestination);
    if (searchDate) query.set('date', searchDate);
    if (searchTravelers) query.set('travelers', searchTravelers);
    window.location.href = `/trips?${query.toString()}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFFF5] text-[#1D2D2E] relative overflow-x-hidden">
      <Navbar />

      {/* Organic Blobs Background */}
      <div className="absolute top-24 left-6 pointer-events-none -z-10 opacity-30">
        <svg width="220" height="220" viewBox="0 0 200 200">
          <path
            fill="#FFD95A"
            d="M44.7,-76.4C58.3,-69.2,70.1,-58.5,78.2,-45.5C86.3,-32.5,90.8,-17.2,90.2,-2C89.5,13.2,83.7,28.3,75.1,41.9C66.5,55.5,55.1,67.6,41.4,75.6C27.7,83.5,11.8,87.4,-3.2,93C-18.2,98.6,-32.3,105.8,-45.1,101.9C-57.9,98.1,-69.5,83.1,-77.4,67.4C-85.3,51.8,-89.6,35.4,-91.1,19.2C-92.6,3,-91.3,-13,-85.4,-27.1C-79.5,-41.2,-69,-53.4,-56.3,-61.2C-43.5,-69,-28.6,-72.4,-14.2,-78.3C0.2,-84.2,14.7,-92.5,29.1,-91.8C43.5,-91.1,31.1,-83.6,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className="absolute top-[40%] right-[-50px] pointer-events-none -z-10 opacity-25">
        <svg width="260" height="260" viewBox="0 0 200 200">
          <path
            fill="#A5F3CF"
            d="M38.1,-63.9C50.5,-57.8,62.3,-49.4,70.2,-37.8C78.1,-26.2,82.1,-11.4,80.7,2.8C79.3,17,72.5,30.6,63.4,42.2C54.3,53.8,42.9,63.4,29.7,70.1C16.5,76.8,1.5,80.6,-13.9,79.5C-29.3,78.4,-45.1,72.4,-56.9,61.9C-68.7,51.4,-76.5,36.4,-80.7,20.4C-84.9,4.4,-85.5,-12.6,-79.8,-27.1C-74.1,-41.6,-62.1,-53.6,-48.5,-59.4C-34.9,-65.2,-19.7,-64.8,-4.7,-57.8C10.3,-50.8,25.7,-70,38.1,-63.9Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      {/* =========================================================================
          HERO & SEARCH CONTENT GRID
      ========================================================================= */}
      <section id="hero-section" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Hero Column (8 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="relative pt-2">
              {/* Floating Yellow Badge */}
              <div className="inline-block bg-[#FFD95A] text-[#1D2D2E] font-black text-xs sm:text-sm px-4 py-1.5 rounded-full border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] transform rotate-3 sm:rotate-4 mb-4">
                سافر معنا… نحو تجربة لا تُنسى ✨
              </div>

              {/* Big Display Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1D2D2E] tracking-tight leading-[1.15]">
                اكتشف جمال{' '}
                <span className="text-[#4CC9FE] drop-shadow-[3px_3px_0px_#1D2D2E]">
                  كردستان معنا
                </span>
                <br />
                بأسعار مميزة 🌄✨
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#1D2D2E]/90 font-bold mt-4 max-w-xl leading-relaxed">
                استمتع برحلة مليئة بالطبيعة الخلابة، الأجواء الساحرة، والمعالم التي تستحق أن تُرى! لا تجعل أجمل الذكريات مجرد حلم… احجز رحلتك الآن وسافر معنا! ✈️💙
              </p>

              {/* Features Pill */}
              <div className="mt-3 inline-flex items-center gap-2 bg-[#A5F3CF] text-[#1D2D2E] font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-xl border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]">
                <span>🎒 نوفّر لك كل ما تحتاجه لرحلة مريحة:</span>
                <span>جولات سياحية • حجز فنادق • حجز تذاكر</span>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <Link
                  id="hero-explore-trips-btn"
                  href="/trips"
                  className="px-6 py-3.5 rounded-2xl text-sm font-black text-white bg-[#FF7E47] border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] hover:shadow-[2px_2px_0px_#1D2D2E] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  احجز رحلتك الآن ✈️
                </Link>

                <a
                  id="hero-whatsapp-btn"
                  href="https://wa.me/9647782528287?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%B4%D8%B1%D9%83%D8%A9%20%D8%B3%D9%85%D8%A7%20%D8%A7%D9%84%D8%A8%D8%A7%D8%B1%D9%82%D8%A9%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A7%D9%84%D8%AD%D8%AC%D8%B2%20%D9%88%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%20%D9%83%D8%B1%D8%AF%D8%B3%D8%AA%D8%A7%D9%86"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3.5 rounded-2xl text-sm font-black text-[#1D2D2E] bg-[#A5F3CF] border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] hover:shadow-[2px_2px_0px_#1D2D2E] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <span>استفسار واتساب (07782528287)</span>
                  <ArrowLeft className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Trip Preview Strip */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-[#1D2D2E] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF7E47]" />
                  <span>رحلات مختارة وموصى بها:</span>
                </span>
                <Link href="/trips" className="text-xs font-black text-[#FF7E47] hover:underline">
                  شاهد الكل ({trips.length}) ←
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trips.slice(0, 2).map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-white rounded-2xl border-3 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] p-3 flex gap-3 items-center hover:scale-[1.02] hover:-rotate-1 transition-all"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 border-[#1D2D2E]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={trip.mainImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80'}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black bg-[#A5F3CF] text-[#1D2D2E] px-2 py-0.5 rounded border border-[#1D2D2E] inline-block mb-1">
                        {trip.destination}
                      </span>
                      <h4 className="text-xs font-black text-[#1D2D2E] truncate">{trip.title}</h4>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-sm font-black text-[#FF7E47]">{trip.price.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-[#1D2D2E]">{trip.currency}</span>
                      </div>
                    </div>
                    <Link
                      href={`/trips/${trip.slug}`}
                      className="p-2 rounded-xl bg-[#FFD95A] border-2 border-[#1D2D2E] text-[#1D2D2E] font-bold text-xs shrink-0 hover:bg-[#FF7E47] hover:text-white transition-colors"
                      title="عرض الرحلة"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Search Panel (5 cols) in Sky Blue */}
          <div className="lg:col-span-5">
            <aside
              id="hero-search-panel"
              className="bg-[#4CC9FE] border-3 border-[#1D2D2E] rounded-[32px] p-6 sm:p-7 shadow-[10px_10px_0px_#A5F3CF] space-y-5"
            >
              <div className="text-center space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-[2px_2px_0px_#1D2D2E]">
                  وين وجهتك الجاية؟ 👀
                </h2>
                <p className="text-xs font-bold text-[#1D2D2E]">
                  اختر وجهتك المفضلة واحجز مقعدك بثواني
                </p>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                {/* Destination */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#1D2D2E] block flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1D2D2E]" />
                    <span>الوجهة المختارة</span>
                  </label>
                  <select
                    id="search-destination-select"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white border-2 border-[#1D2D2E] font-bold text-sm text-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] focus:outline-none cursor-pointer"
                  >
                    <option value="">جميع وجهات كردستان</option>
                    <option value="السليمانية">📍 سليمانية — 100 ألف</option>
                    <option value="دهوك">📍 دهوك — 70 ألف</option>
                    <option value="أربيل">📍 أربيل — 75 ألف</option>
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#1D2D2E] block flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#1D2D2E]" />
                    <span>تاريخ الانطلاق</span>
                  </label>
                  <input
                    id="search-date-input"
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white border-2 border-[#1D2D2E] font-bold text-sm text-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] focus:outline-none cursor-pointer"
                  />
                </div>

                {/* Travelers */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#1D2D2E] block flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#1D2D2E]" />
                    <span>عدد الأشخاص</span>
                  </label>
                  <select
                    id="search-travelers-select"
                    value={searchTravelers}
                    onChange={(e) => setSearchTravelers(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white border-2 border-[#1D2D2E] font-bold text-sm text-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] focus:outline-none cursor-pointer"
                  >
                    <option value="1">شخص واحد (1)</option>
                    <option value="2">شخصين (2)</option>
                    <option value="3">3 أشخاص</option>
                    <option value="4">عائلة (4+)</option>
                    <option value="6">كروب سياحي (6+)</option>
                  </select>
                </div>

                {/* Big Search Button */}
                <button
                  id="hero-search-submit-btn"
                  type="submit"
                  className="w-full p-3.5 rounded-2xl bg-[#FFD95A] text-[#1D2D2E] border-3 border-[#1D2D2E] font-black text-base shadow-[4px_4px_0px_#1D2D2E] hover:shadow-[2px_2px_0px_#1D2D2E] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>ابحث عن رحلة 🚀</span>
                </button>
              </form>

              {/* Trust Box */}
              <div className="bg-white/40 border-2 border-[#1D2D2E]/20 rounded-2xl p-3.5 text-xs font-bold text-[#1D2D2E] leading-relaxed">
                <strong className="block text-sm font-black text-[#1D2D2E] mb-0.5">سما البارقة — كربلاء ✨</strong>
                📍 كربلاء — نهاية شارع الإسكان — محلات الملعب القديم<br />
                <span className="inline-block mt-1 text-[#1D2D2E]">📞 خط الحجز المباشر: <a href="tel:07782528287" className="font-black underline" dir="ltr">0778 252 8287</a></span>
              </div>
            </aside>
          </div>

        </div>
      </section>

      {/* =========================================================================
          FEATURED TRIPS & PACKAGES SHOWCASE
      ========================================================================= */}
      <section id="trips-showcase" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-black bg-[#FFD95A] text-[#1D2D2E] border-2 border-[#1D2D2E] px-3 py-1 rounded-full shadow-[2px_2px_0px_#1D2D2E] uppercase inline-block mb-2">
              وجهات سياحية مختارة بعناية 🏞️
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1D2D2E]">
              أحدث الرحلات السياحية لعام 2026
            </h2>
            <p className="text-xs sm:text-sm text-[#1D2D2E]/70 font-bold mt-1 max-w-xl">
              رحلات أسبوعية بأرقى الباصات الفاخرة مع برامج ترفيهية متكاملة.
            </p>
          </div>

          <Link
            id="view-all-trips-btn"
            href="/trips"
            className="inline-flex items-center gap-2 text-sm font-black text-[#1D2D2E] bg-white border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] hover:shadow-[1px_1px_0px_#1D2D2E] px-4 py-2 rounded-xl hover:translate-x-0.5 hover:translate-y-0.5 transition-all self-start sm:self-auto"
          >
            <span>عرض كافة الرحلات ({trips.length})</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
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
          <div className="p-12 text-center bg-white rounded-[24px] border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E]">
            <p className="text-[#1D2D2E] font-bold">لا توجد رحلات متاحة حالياً.</p>
          </div>
        )}
      </section>

      {/* =========================================================================
          SPECIAL OFFERS SECTION
      ========================================================================= */}
      {offerTrips.length > 0 && (
        <section id="special-offers-section" className="py-16 bg-[#A5F3CF] border-y-3 border-[#1D2D2E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-black bg-[#FF7E47] text-white border-2 border-[#1D2D2E] px-3 py-1 rounded-full shadow-[2px_2px_0px_#1D2D2E] uppercase inline-flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>عروض التوفير والخصومات الحصرية 🔥</span>
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#1D2D2E]">
                  سافر بأفضل الأسعار الموفرة
                </h2>
              </div>
              <Link
                href="/offers"
                className="text-xs font-black text-[#1D2D2E] bg-white border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] px-3.5 py-1.5 rounded-xl hover:bg-[#FFD95A] transition-colors self-start sm:self-auto"
              >
                <span>مشاهدة كل العروض ({offerTrips.length}) ←</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offerTrips.slice(0, 2).map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white border-3 border-[#1D2D2E] rounded-[24px] p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-center shadow-[6px_6px_0px_#1D2D2E] hover:scale-[1.01] transition-all"
                >
                  <div className="w-full sm:w-44 h-40 rounded-2xl overflow-hidden shrink-0 border-2 border-[#1D2D2E]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={trip.mainImage}
                      alt={trip.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2.5 w-full">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-[#FF7E47] text-white border border-[#1D2D2E] inline-block">
                      {trip.offerBadge || 'عرض الموسم 🔥'}
                    </span>
                    <h3 className="text-base font-black text-[#1D2D2E] line-clamp-1">{trip.title}</h3>
                    <p className="text-xs text-[#1D2D2E]/70 font-medium line-clamp-2">{trip.description}</p>
                    
                    <div className="flex items-center justify-between pt-2 border-t-2 border-dashed border-[#1D2D2E]/20">
                      <div>
                        <span className="text-xl font-black text-[#FF7E47]">
                          {trip.price.toLocaleString()} {trip.currency}
                        </span>
                        {trip.originalPrice && (
                          <span className="text-xs text-[#1D2D2E]/50 line-through mr-2 font-bold">
                            {trip.originalPrice.toLocaleString()} {trip.currency}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedTripForBooking(trip)}
                        className="px-4 py-2 rounded-xl text-xs font-black bg-[#FFD95A] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] hover:bg-[#FF7E47] hover:text-white transition-colors cursor-pointer"
                      >
                        احجز الآن ✨
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          WHY CHOOSE SAMA AL BARQAH (لماذا نحن)
      ========================================================================= */}
      <section id="why-us-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-black bg-[#FFD95A] text-[#1D2D2E] border-2 border-[#1D2D2E] px-3 py-1 rounded-full shadow-[2px_2px_0px_#1D2D2E] uppercase inline-block">
            معايير الجودة والراحة 👑
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1D2D2E]">
            لماذا يفضل المسافرون شركة سما البارقة؟
          </h2>
          <p className="text-xs sm:text-sm text-[#1D2D2E]/70 font-bold">
            نحرص على تقديم تجربة سفر استثنائية تجمع بين الراحة المطلقة والأمان والبرامج الترفيهية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-[24px] bg-white border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-3 hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_#1D2D2E] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD95A] border-2 border-[#1D2D2E] text-[#1D2D2E] flex items-center justify-center shadow-[2px_2px_0px_#1D2D2E]">
              <Bus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#1D2D2E]">باصات VIP حديثة</h3>
            <p className="text-xs text-[#1D2D2E]/70 font-bold leading-relaxed">
              باصات سياحية مكيفة ومجهزة بأحدث مقاعد الراحة وشاشات عرض ونظام صوتي لضمان رحلة ممتعة.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-[24px] bg-white border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-3 hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_#1D2D2E] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#4CC9FE] border-2 border-[#1D2D2E] text-white flex items-center justify-center shadow-[2px_2px_0px_#1D2D2E]">
              <Hotel className="w-6 h-6 text-[#1D2D2E]" />
            </div>
            <h3 className="text-lg font-black text-[#1D2D2E]">فنادق 4 و 5 نجوم</h3>
            <p className="text-xs text-[#1D2D2E]/70 font-bold leading-relaxed">
              إقامات فندقية منتقاة بعناية في قلب المدن السياحية ومطلة على الطبيعة مع بوفيه إفطار مفتوح.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-[24px] bg-white border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-3 hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_#1D2D2E] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#A5F3CF] border-2 border-[#1D2D2E] text-[#1D2D2E] flex items-center justify-center shadow-[2px_2px_0px_#1D2D2E]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#1D2D2E]">مرشدون محترفون</h3>
            <p className="text-xs text-[#1D2D2E]/70 font-bold leading-relaxed">
              كادر إرشادي سياحي ذو خبرة يرافقكم على مدار الساعة لتنظيم الجولات وشرح المعالم.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-[24px] bg-white border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-3 hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_#1D2D2E] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FF7E47] border-2 border-[#1D2D2E] text-white flex items-center justify-center shadow-[2px_2px_0px_#1D2D2E]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#1D2D2E]">حجز فوري وموثوق</h3>
            <p className="text-xs text-[#1D2D2E]/70 font-bold leading-relaxed">
              تأكيد مباشر للحجوزات وتواصل فوري عبر الواتساب مع خيارات دفع مرنة ومريحة.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CUSTOMER TESTIMONIALS (آراء المسافرين)
      ========================================================================= */}
      <section id="testimonials-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-black bg-[#FFD95A] text-[#1D2D2E] border-2 border-[#1D2D2E] px-3 py-1 rounded-full shadow-[2px_2px_0px_#1D2D2E] uppercase inline-block">
            شهادات نعتز بها ⭐
          </span>
          <h2 className="text-3xl font-black text-[#1D2D2E]">
            تجارب المسافرين مع سما البارقة
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="bg-white p-6 rounded-[24px] border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-[#1D2D2E]/80 font-bold leading-relaxed">
              «من أجمل الرحلات التي قمت بها مع عائلتي إلى السليمانية ودوكان. الفندق كان راقياً جداً والباص مريح للغاية، والمرشد السياحي كان قمة في الذوق والتعاون.»
            </p>
            <div className="flex items-center gap-3 pt-3 border-t-2 border-dashed border-[#1D2D2E]/20">
              <div className="w-9 h-9 rounded-full bg-[#FFD95A] border-2 border-[#1D2D2E] text-[#1D2D2E] font-black flex items-center justify-center text-xs">
                ع.ب
              </div>
              <div>
                <h4 className="text-xs font-black text-[#1D2D2E]">د. علي البغدادي</h4>
                <span className="text-[11px] text-[#1D2D2E]/60 font-bold">رحلة السليمانية العائلية</span>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-6 rounded-[24px] border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-[#1D2D2E]/80 font-bold leading-relaxed">
              «خدمة الحجز من الموقع كانت سريعة وتواصلوا معي على الواتساب خلال دقائق لتأكيد المقاعد. رحلة دهوك وزاخو كانت منظمة بأعلى مستوى، شكراً لفريق سما البارقة.»
            </p>
            <div className="flex items-center gap-3 pt-3 border-t-2 border-dashed border-[#1D2D2E]/20">
              <div className="w-9 h-9 rounded-full bg-[#4CC9FE] border-2 border-[#1D2D2E] text-[#1D2D2E] font-black flex items-center justify-center text-xs">
                م.ك
              </div>
              <div>
                <h4 className="text-xs font-black text-[#1D2D2E]">المهندسة مروة الكرخي</h4>
                <span className="text-[11px] text-[#1D2D2E]/60 font-bold">رحلة دهوك وزاخو</span>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white p-6 rounded-[24px] border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-[#1D2D2E]/80 font-bold leading-relaxed">
              «الالتزام بالمواعيد والبرنامج السياحي الدقيق أكثر ما يميز هذه الشركة. كانت تجربة تلفريك جبل كورك والأهوار ممتازة وممتعة للغاية.»
            </p>
            <div className="flex items-center gap-3 pt-3 border-t-2 border-dashed border-[#1D2D2E]/20">
              <div className="w-9 h-9 rounded-full bg-[#A5F3CF] border-2 border-[#1D2D2E] text-[#1D2D2E] font-black flex items-center justify-center text-xs">
                ح.س
              </div>
              <div>
                <h4 className="text-xs font-black text-[#1D2D2E]">أ. حسام السعدي</h4>
                <span className="text-[11px] text-[#1D2D2E]/60 font-bold">رحلة أربيل وراوندوز</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CALL TO ACTION BANNER
      ========================================================================= */}
      <section id="cta-banner" className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-[32px] bg-[#FFD95A] text-[#1D2D2E] p-8 sm:p-12 overflow-hidden border-3 border-[#1D2D2E] shadow-[8px_8px_0px_#1D2D2E]">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-black text-[#1D2D2E] bg-white px-3 py-1 rounded-full border-2 border-[#1D2D2E]">
              تخطيط رحلات خاص وعائلي 🎒
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1D2D2E] leading-tight">
              هل تخطط لرحلة عائلية أو كروب خاص؟
            </h2>
            <p className="text-xs sm:text-sm text-[#1D2D2E]/80 font-bold leading-relaxed">
              فريقنا جاهز لتصميم جدول سياحي مخصص بالكامل يناسب احتياجاتكم وميزانيتكم مع توفير الباصات الخاصة وحجوزات الفنادق الفاخرة.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://wa.me/9647782528287?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%B4%D8%B1%D9%83%D8%A9%20%D8%B3%D9%85%D8%A7%20%D8%A7%D9%84%D8%A8%D8%A7%D8%B1%D9%82%D8%A9%D8%8C%20%D9%86%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%AD%D8%AC%D8%B2%20%D8%B1%D8%AD%D9%84%D8%A9%20%D8%A5%D9%84%D9%89%20%D9%83%D8%B1%D8%AF%D8%B3%D8%AA%D8%A7%D9%86"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-2xl bg-[#FF7E47] text-white font-black text-xs sm:text-sm flex items-center gap-2 border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>تواصل معنا عبر واتساب (07782528287)</span>
              </a>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-2xl bg-white text-[#1D2D2E] font-black text-xs sm:text-sm border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                تفاصيل التواصل والعنوان 📍
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />

      {/* Booking Modal */}
      <BookingModal
        trip={selectedTripForBooking}
        isOpen={Boolean(selectedTripForBooking)}
        onClose={() => setSelectedTripForBooking(null)}
      />
    </div>
  );
}
