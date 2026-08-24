import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

/**
 * GET /api/admin/trips
 * Protected: Returns all trips (including draft and hidden).
 */
export async function GET(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const trips = db.getTrips();
    return NextResponse.json({ success: true, trips });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/trips
 * Protected: Create a new trip.
 */
export async function POST(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.title || !body.destination || !body.price || !body.startDate) {
      return NextResponse.json(
        { success: false, error: 'يرجى تزويد عنوان الرحلة، الوجهة، السعر، وتاريخ الانطلاق.' },
        { status: 400 }
      );
    }

    const slug = body.slug || body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0621-\u064A-]+/g, '') + `-${Date.now()}`;

    const newTrip = db.createTrip({
      title: body.title.trim(),
      slug,
      destination: body.destination.trim(),
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      currency: body.currency || 'د.ع',
      startDate: body.startDate,
      endDate: body.endDate || body.startDate,
      duration: body.duration || '4 أيام / 3 ليالي',
      maxSeats: Number(body.maxSeats) || 40,
      mainImage: body.mainImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      images: body.images && body.images.length > 0 ? body.images : [body.mainImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'],
      description: body.description || '',
      overview: body.overview || '',
      dailyProgram: body.dailyProgram || [],
      includedServices: body.includedServices || ['باصات VIP حديثة مكيفة', 'إقامة فندقية راقية', 'مرشد سياحي مرافق'],
      excludedServices: body.excludedServices || ['المصاريف الشخصية', 'الطلبات الإضافية في الفندق'],
      departureInfo: body.departureInfo || 'كربلاء — نهاية شارع الإسكان — محلات الملعب القديم',
      visitedSpots: body.visitedSpots || [],
      status: body.status || 'active',
      isFeatured: Boolean(body.isFeatured),
      isOffer: Boolean(body.isOffer),
      offerBadge: body.offerBadge
    });

    return NextResponse.json({
      success: true,
      trip: newTrip,
      message: 'تم إنشاء الرحلة بنجاح.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
