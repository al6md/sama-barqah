import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createCustomerSession } from '@/lib/userAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, phoneOrEmail, password } = body;
    const loginIdentifier = (identifier || phoneOrEmail || '').trim();

    if (!loginIdentifier) {
      return NextResponse.json({ success: false, error: 'يرجى إدخال رقم الهاتف أو البريد الإلكتروني' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ success: false, error: 'يرجى إدخال كلمة المرور' }, { status: 400 });
    }

    // Try finding by phone first, then email
    let user = db.getUserByPhone(loginIdentifier);
    if (!user && loginIdentifier.includes('@')) {
      user = db.getUserByEmail(loginIdentifier);
    }

    if (!user) {
      return NextResponse.json({ success: false, error: 'لم يتم العثور على حساب مسجل بهذه البيانات' }, { status: 404 });
    }

    if (user.password && user.password !== password.trim()) {
      return NextResponse.json({ success: false, error: 'كلمة المرور غير صحيحة، يرجى المحاولة مجدداً' }, { status: 401 });
    }

    const token = await createCustomerSession(user.id);
    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      message: `مرحباً بك مجدداً ${user.name}!`,
      user: safeUser,
      token
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
