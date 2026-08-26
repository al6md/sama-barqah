import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createCustomerSession } from '@/lib/userAuth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, password } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'يرجى إدخال الاسم الكريم بشكل صحيح' }, { status: 400 });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().replace(/\D/g, '').length < 8) {
      return NextResponse.json({ success: false, error: 'يرجى إدخال رقم هاتف صحيح للتواصل (مثل 0770xxxxxxx)' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.trim().length < 4) {
      return NextResponse.json({ success: false, error: 'يرجى كتابة كلمة مرور لا تقل عن 4 خانات' }, { status: 400 });
    }

    const result = db.createUser({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || undefined,
      password: password.trim(),
      role: 'customer'
    });

    if (!result.success || !result.user) {
      return NextResponse.json({ success: false, error: result.error || 'تعذر إنشاء الحساب' }, { status: 400 });
    }

    const token = await createCustomerSession(result.user.id);

    // Return sanitized user (exclude password)
    const { password: _, ...safeUser } = result.user;

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء حسابك بنجاح! أهلاً بك في سما البارقة',
      user: safeUser,
      token
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
