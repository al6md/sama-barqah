import { NextRequest, NextResponse } from 'next/server';
import { db, BookingStatus } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

/**
 * GET /api/admin/bookings
 * Protected: Requires Admin authentication.
 * Returns all bookings with optional filtering and summary metrics.
 */
export async function GET(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح بالدخول. يرجى تسجيل الدخول كمدير نظام.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status') as BookingStatus | 'الكل' | null;
    const query = searchParams.get('q')?.toLowerCase();

    let bookings = db.getBookings(statusParam || undefined);

    if (query) {
      bookings = bookings.filter(
        (b) =>
          b.id.toLowerCase().includes(query) ||
          b.customerName.toLowerCase().includes(query) ||
          b.customerPhone.includes(query) ||
          b.tripTitle.toLowerCase().includes(query) ||
          b.destination.toLowerCase().includes(query)
      );
    }

    const totalCount = bookings.length;
    const newCount = bookings.filter((b) => b.status === 'جديد').length;
    const confirmedCount = bookings.filter((b) => b.status === 'مؤكد' || b.status === 'مكتمل').length;
    const totalRevenue = bookings
      .filter((b) => b.status !== 'ملغي')
      .reduce((acc, b) => acc + (b.totalPrice || 0), 0);

    return NextResponse.json({
      success: true,
      bookings,
      metrics: {
        totalCount,
        newCount,
        confirmedCount,
        totalRevenue
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/bookings
 * Protected: Allows Admin to manually create a booking for walk-in / phone clients.
 */
export async function POST(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.customerName || !body.customerPhone || !body.tripId || !body.travelerCount) {
      return NextResponse.json(
        { success: false, error: 'يرجى تزويد كافة البيانات الإلزامية للحجز.' },
        { status: 400 }
      );
    }

    const result = db.createBooking({
      tripId: body.tripId,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      travelerCount: Number(body.travelerCount),
      preferredContactMethod: body.preferredContactMethod || 'phone',
      notes: body.notes ? `[تم الإدخال يدوياً بواسطة الأدمن] ${body.notes}` : '[تم الإدخال يدوياً بواسطة الأدمن]'
    });

    if (!result.success || !result.booking) {
      return NextResponse.json({ success: false, error: result.error || 'تعذر إنشاء الحجز' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      booking: result.booking,
      message: 'تم إنشاء الحجز بنجاح.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
