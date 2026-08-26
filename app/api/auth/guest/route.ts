import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createCustomerSession } from '@/lib/userAuth';

export async function POST(req: NextRequest) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }

    const { name, phone } = body as { name?: string; phone?: string };

    const guestName = (name && name.trim().length > 1) ? name.trim() : 'زائر سما البارقة';
    const guestPhone = (phone && phone.trim().length > 5) ? phone.trim() : '';

    const result = db.createUser({
      name: guestName,
      phone: guestPhone || `guest-${Date.now().toString().slice(-6)}`,
      role: 'guest'
    });

    if (!result.success || !result.user) {
      return NextResponse.json({ success: false, error: 'تعذر بدء جلسة الزائر' }, { status: 500 });
    }

    const token = await createCustomerSession(result.user.id);
    const { password: _, ...safeUser } = result.user;

    return NextResponse.json({
      success: true,
      message: 'تم تفعيل وضع الزائر بنجاح، نتمنى لك تجربة ممتعة!',
      user: safeUser,
      isGuest: true,
      token
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
