import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const messages = db.getMessages();
    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.phone || !body.message) {
      return NextResponse.json({ success: false, error: 'يرجى إدخال الاسم ورقم الهاتف والرسالة بشكل كامل.' }, { status: 400 });
    }

    const message = db.createMessage({
      name: body.name,
      phone: body.phone,
      email: body.email,
      subject: body.subject || 'استفسار من الموقع',
      message: body.message
    });

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رسالتكم بنجاح! سيتواصل معكم فريق سما البارقة قريباً.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ success: false, error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    const success = db.updateMessageStatus(body.id, body.status);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
