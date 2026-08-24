import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const destination = searchParams.get('destination') || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const offer = searchParams.get('offer') === 'true' ? true : undefined;
    const all = searchParams.get('all') === 'true';

    // If 'all' is requested (for admin), verify auth
    if (all) {
      const isAdmin = await verifyAdminSession(req);
      if (!isAdmin) {
        // Return active trips only for non-admin
        const trips = db.getTrips({ onlyActive: true, featured, offer, destination });
        return NextResponse.json({ success: true, trips });
      }
      const trips = db.getTrips({ featured, offer, destination });
      return NextResponse.json({ success: true, trips });
    }

    const trips = db.getTrips({ onlyActive: true, featured, offer, destination });
    return NextResponse.json({ success: true, trips });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.destination || !body.price || !body.startDate) {
      return NextResponse.json({ success: false, error: 'يرجى تعبئة الحقول الأساسية المطلوبة' }, { status: 400 });
    }

    // Generate slug from title or random string
    const slug = body.slug || body.title.trim().toLowerCase().replace(/[\s/\\?%*:|"<>]+/g, '-').replace(/^-+|-+$/g, '') || `trip-${Date.now()}`;

    const trip = db.createTrip({
      title: body.title,
      slug,
      destination: body.destination,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      currency: body.currency || 'د.ع',
      startDate: body.startDate,
      endDate: body.endDate || body.startDate,
      duration: body.duration || '3 أيام / ليلتين',
      maxSeats: Number(body.maxSeats) || 20,
      mainImage: body.mainImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [body.mainImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'],
      description: body.description || '',
      overview: body.overview || '',
      dailyProgram: Array.isArray(body.dailyProgram) ? body.dailyProgram : [],
      includedServices: Array.isArray(body.includedServices) ? body.includedServices : [],
      excludedServices: Array.isArray(body.excludedServices) ? body.excludedServices : [],
      departureInfo: body.departureInfo || '',
      visitedSpots: Array.isArray(body.visitedSpots) ? body.visitedSpots : [],
      status: body.status || 'active',
      isFeatured: Boolean(body.isFeatured),
      isOffer: Boolean(body.isOffer),
      offerBadge: body.offerBadge || undefined,
      isSeed: false
    });

    return NextResponse.json({ success: true, trip });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
