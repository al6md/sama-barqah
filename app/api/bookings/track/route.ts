import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || searchParams.get('code') || searchParams.get('phone') || '';

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'يرجى إدخال رقم الحجز المرجعي أو رقم الهاتف للبحث' }, { status: 400 });
    }

    const bookings = db.searchBookingsForTracking(query);

    if (bookings.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'لم نتمكن من العثور على أي حجز مطابق لبيانات البحث المدخلة. يرجى التأكد من كتابة رقم الحجز مثل (SB-2026-0001) أو رقم الهاتف بشكل صحيح.'
      }, { status: 404 });
    }

    // Attach trip details if needed
    const enrichedBookings = bookings.map(booking => {
      const trip = db.getTripById(booking.tripId);
      return {
        ...booking,
        tripDetails: trip ? {
          title: trip.title,
          destination: trip.destination,
          startDate: trip.startDate,
          endDate: trip.endDate,
          duration: trip.duration,
          departureInfo: trip.departureInfo,
          mainImage: trip.mainImage,
          price: trip.price,
          currency: trip.currency
        } : null
      };
    });

    return NextResponse.json({
      success: true,
      count: enrichedBookings.length,
      bookings: enrichedBookings
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = (body.query || body.code || body.phone || '').trim();

    if (!query) {
      return NextResponse.json({ success: false, error: 'يرجى إدخال رقم الحجز أو رقم الهاتف' }, { status: 400 });
    }

    const bookings = db.searchBookingsForTracking(query);

    if (bookings.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'لم يتم العثور على أي حجز مطابق. تأكد من إدخال رقم الحجز المرجعي أو رقم الهاتف المسجل بالحجز.'
      }, { status: 404 });
    }

    const enrichedBookings = bookings.map(booking => {
      const trip = db.getTripById(booking.tripId);
      return {
        ...booking,
        tripDetails: trip ? {
          title: trip.title,
          destination: trip.destination,
          startDate: trip.startDate,
          endDate: trip.endDate,
          duration: trip.duration,
          departureInfo: trip.departureInfo,
          mainImage: trip.mainImage,
          price: trip.price,
          currency: trip.currency
        } : null
      };
    });

    return NextResponse.json({
      success: true,
      count: enrichedBookings.length,
      bookings: enrichedBookings
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
