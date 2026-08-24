import { NextRequest, NextResponse } from 'next/server';
import { db, BookingStatus } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const booking = db.getBookingById(id);

    if (!booking) {
      return NextResponse.json({ success: false, error: 'لم يتم العثور على الحجز' }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    if (!body.status) {
      return NextResponse.json({ success: false, error: 'يرجى تحديد حالة الحجز' }, { status: 400 });
    }

    const updated = db.updateBookingStatus(id, body.status as BookingStatus, body.note);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'الحجز غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const { id } = await params;
    const success = db.deleteBooking(id);

    if (!success) {
      return NextResponse.json({ success: false, error: 'الحجز غير موجود أو تم حذفه مسبقاً' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'تم حذف الحجز بنجاح وإعادة المقاعد للرحلة' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
