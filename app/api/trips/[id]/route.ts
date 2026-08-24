import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Check if id is actually a slug or ID
    let trip = db.getTripById(id);
    if (!trip) {
      trip = db.getTripBySlug(id);
    }

    if (!trip) {
      return NextResponse.json({ success: false, error: 'الرحلة غير موجودة' }, { status: 404 });
    }

    return NextResponse.json({ success: true, trip });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = db.updateTrip(id, {
      ...body,
      price: body.price !== undefined ? Number(body.price) : undefined,
      originalPrice: body.originalPrice !== undefined ? (body.originalPrice ? Number(body.originalPrice) : undefined) : undefined,
      maxSeats: body.maxSeats !== undefined ? Number(body.maxSeats) : undefined,
      bookedSeats: body.bookedSeats !== undefined ? Number(body.bookedSeats) : undefined
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'تعذر تعديل الرحلة، لم يتم العثور عليها' }, { status: 404 });
    }

    return NextResponse.json({ success: true, trip: updated });
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
    const success = db.deleteTrip(id);

    if (!success) {
      return NextResponse.json({ success: false, error: 'الرحلة غير موجودة أو تم حذفها مسبقاً' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'تم حذف الرحلة بنجاح' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
