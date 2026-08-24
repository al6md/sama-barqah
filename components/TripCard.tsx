'use client';

import Link from 'next/link';
import { Trip } from '@/lib/db';
import { Calendar, Clock, MapPin, Users, CheckCircle2, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
  onBookClick?: (trip: Trip) => void;
}

export function TripCard({ trip, onBookClick }: TripCardProps) {
  const remainingSeats = Math.max(0, trip.maxSeats - trip.bookedSeats);
  const isFull = remainingSeats <= 0;
  const isAlmostFull = remainingSeats > 0 && remainingSeats <= 5;
  const percentageBooked = Math.min(100, Math.round((trip.bookedSeats / trip.maxSeats) * 100));

  return (
    <article
      id={`trip-card-${trip.id}`}
      className="group bg-white rounded-[24px] overflow-hidden border-3 border-[#1D2D2E] shadow-[4px_4px_0px_#1D2D2E] hover:shadow-[8px_8px_0px_#1D2D2E] hover:scale-[1.02] hover:-rotate-1 transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {/* Image & Badges */}
        <div className="relative h-48 overflow-hidden bg-slate-100 border-b-3 border-[#1D2D2E]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={trip.mainImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Top Badges */}
          <div className="absolute top-3 right-3 flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-[#FFD95A] text-[#1D2D2E] border-2 border-[#1D2D2E] flex items-center gap-1 shadow-[2px_2px_0px_#1D2D2E]">
              <MapPin className="w-3 h-3 text-[#1D2D2E]" />
              <span>{trip.destination}</span>
            </span>

            {trip.isOffer && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-[#FF7E47] text-white border-2 border-[#1D2D2E] flex items-center gap-1 shadow-[2px_2px_0px_#1D2D2E]">
                <Sparkles className="w-3 h-3" />
                <span>{trip.offerBadge || 'عرض حصري 🔥'}</span>
              </span>
            )}
          </div>

          {/* Bottom Pill Overlay on Image: Duration & Date */}
          <div className="absolute bottom-2.5 right-2.5 left-2.5 flex items-center justify-between text-[11px] font-bold">
            <span className="flex items-center gap-1 bg-white/95 text-[#1D2D2E] px-2 py-0.5 rounded-md border border-[#1D2D2E]">
              <Clock className="w-3 h-3 text-[#FF7E47]" />
              <span>{trip.duration}</span>
            </span>
            <span className="flex items-center gap-1 bg-white/95 text-[#1D2D2E] px-2 py-0.5 rounded-md border border-[#1D2D2E]">
              <Calendar className="w-3 h-3 text-[#4CC9FE]" />
              <span>انطلاق: {trip.startDate}</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-3">
          <div>
            <span className="inline-block text-[11px] font-black bg-[#A5F3CF] text-[#1D2D2E] px-2 py-0.5 rounded-md border border-[#1D2D2E] mb-1.5">
              {trip.isFeatured ? 'الأكثر طلباً 🔥' : 'رحلة سياحية 🌿'}
            </span>
            <Link
              href={`/trips/${trip.slug}`}
              className="text-base sm:text-lg font-black text-[#1D2D2E] hover:text-[#FF7E47] transition-colors line-clamp-2 leading-tight block"
            >
              {trip.title}
            </Link>
            <p className="text-xs text-[#1D2D2E]/70 font-medium mt-1 line-clamp-2 leading-relaxed">
              {trip.description}
            </p>
          </div>

          {/* Visited Spots tags */}
          {trip.visitedSpots && trip.visitedSpots.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {trip.visitedSpots.slice(0, 3).map((spot, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FDFFF5] border border-[#1D2D2E]/30 text-[#1D2D2E]"
                >
                  {spot}
                </span>
              ))}
              {trip.visitedSpots.length > 3 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-[#1D2D2E]/60">
                  +{trip.visitedSpots.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Seat Capacity / Availability Status */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1 text-[#1D2D2E]/70">
                <Users className="w-3 h-3" />
                <span>المقاعد:</span>
              </span>
              {isFull ? (
                <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[10px]">
                  اكتملت المقاعد
                </span>
              ) : isAlmostFull ? (
                <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                  متبقي {remainingSeats} مقاعد!
                </span>
              ) : (
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                  متاح ({remainingSeats} شاغر)
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#FDFFF5] rounded-full border border-[#1D2D2E]/40 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isFull ? 'bg-rose-500' : isAlmostFull ? 'bg-[#FF7E47]' : 'bg-[#A5F3CF]'
                }`}
                style={{ width: `${percentageBooked}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Actions */}
      <div className="px-4 sm:px-5 pb-4 pt-3 border-t-2 border-[#1D2D2E] flex items-center justify-between gap-2 bg-[#FDFFF5]">
        <div>
          <span className="text-[10px] text-[#1D2D2E]/60 block font-bold">سعر الشخص</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-[#FF7E47] font-sans">
              {trip.price.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-[#1D2D2E]">{trip.currency || 'د.ع'}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href={`/trips/${trip.slug}`}
            id={`btn-view-details-${trip.id}`}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#1D2D2E] bg-white hover:bg-slate-50 border-2 border-[#1D2D2E] transition-colors"
          >
            التفاصيل
          </Link>

          <button
            id={`btn-book-now-${trip.id}`}
            disabled={isFull}
            onClick={() => onBookClick && onBookClick(trip)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 border-2 border-[#1D2D2E] transition-all cursor-pointer ${
              isFull
                ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                : 'bg-[#FFD95A] text-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5'
            }`}
          >
            <span>{isFull ? 'مكتملة' : 'احجز'}</span>
            {!isFull && <ArrowLeft className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </article>
  );
}
