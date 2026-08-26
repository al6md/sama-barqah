import { NextRequest, NextResponse } from 'next/server';
import { db, Booking } from '@/lib/db';
import { getCurrentCustomer } from '@/lib/userAuth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentCustomer(req);

    if (!user) {
      return NextResponse.json({ success: true, user: null, isLoggedIn: false, bookings: [] });
    }

    const { password: _, ...safeUser } = user;

    // Fetch user bookings based on phone or customer ID
    let bookings: Booking[] = [];
    if (user.phone && !user.phone.startsWith('guest-')) {
      bookings = db.getBookingsByPhone(user.phone);
    }

    return NextResponse.json({
      success: true,
      user: safeUser,
      isLoggedIn: true,
      isGuest: user.role === 'guest',
      bookings
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentCustomer(req);

    if (!user) {
      return NextResponse.json({ success: false, error: 'غير مصرح به' }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, email, password } = body;

    const updates: any = {};
    if (name && name.trim().length > 1) updates.name = name.trim();
    if (phone && phone.trim().length > 7) updates.phone = phone.trim();
    if (email !== undefined) updates.email = email.trim() || undefined;
    if (password && password.trim().length >= 4) {
      updates.password = password.trim();
      // If converting from guest to registered customer:
      if (user.role === 'guest') {
        updates.role = 'customer';
      }
    }

    const updated = db.updateUserProfile(user.id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'تعذر تحديث البيانات' }, { status: 400 });
    }

    const { password: _, ...safeUser } = updated;
    return NextResponse.json({
      success: true,
      message: 'تم تحديث بياناتك بنجاح',
      user: safeUser
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
