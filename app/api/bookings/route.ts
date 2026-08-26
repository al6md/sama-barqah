import { NextRequest, NextResponse } from 'next/server';
import { db, BookingStatus } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

// In-memory rate limiting map for booking spam prevention
const rateLimitMap = new Map<string, number>();

export async function GET(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as BookingStatus | 'الكل' | null;

    const bookings = db.getBookings(status || undefined);
    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anon';
    const now = Date.now();
    const lastRequest = rateLimitMap.get(ip);

    // Prevent rapid multiple form submissions within 3 seconds
    if (lastRequest && now - lastRequest < 3000) {
      return NextResponse.json(
        { success: false, error: 'يرجى الانتظار قليلاً قبل إعادة إرسال طلب الحجز مرة أخرى.' },
        { status: 429 }
      );
    }
    rateLimitMap.set(ip, now);

    const body = await req.json();

    // 1. Validation
    if (!body.customerName || typeof body.customerName !== 'string' || body.customerName.trim().length < 3) {
      return NextResponse.json({ success: false, error: 'يرجى إدخال الاسم الكامل الثلاثي بشكل صحيح.' }, { status: 400 });
    }

    if (!body.customerPhone || typeof body.customerPhone !== 'string' || body.customerPhone.trim().length < 9) {
      return NextResponse.json({ success: false, error: 'يرجى إدخال رقم هاتف صحيح للتواصل (مثل 0770xxxxxxx).' }, { status: 400 });
    }

    if (body.customerPhone.startsWith('guest-')) {
      return NextResponse.json({
        success: false,
        error: 'وضع التصفح كزائر مخصص للاستعراض فقط. يرجى تسجيل حساب برقم هاتف حقيقي لإتمام الحجز وتثبيت المقاعد.'
      }, { status: 400 });
    }

    const travelerCount = Number(body.travelerCount);
    if (isNaN(travelerCount) || travelerCount < 1 || travelerCount > 50) {
      return NextResponse.json({ success: false, error: 'يرجى تحديد عدد مسافرين صحيح (بين 1 و 50 شخص).' }, { status: 400 });
    }

    if (!body.tripId) {
      return NextResponse.json({ success: false, error: 'يرجى اختيار الرحلة المراد حجزها.' }, { status: 400 });
    }

    // 2. Perform DB Insertion with capacity check
    const result = db.createBooking({
      tripId: body.tripId,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      travelerCount,
      preferredContactMethod: body.preferredContactMethod === 'phone' ? 'phone' : (body.preferredContactMethod === 'email' ? 'email' : 'whatsapp'),
      notes: body.notes
    });

    if (!result.success || !result.booking) {
      return NextResponse.json({ success: false, error: result.error || 'تعذر إتمام الحجز' }, { status: 400 });
    }

    const settings = db.getSettings();
    const cleanPhone = settings.whatsapp.replace(/\D/g, '');
    const encodedText = encodeURIComponent(
      `مرحباً شركة ${settings.companyName}، قمت بحجز رحلة (${result.booking.tripTitle}) عبر الموقع برقم حجز [${result.booking.id}]، الاسم: ${result.booking.customerName}، عدد الأشخاص: ${result.booking.travelerCount}، الإجمالي: ${result.booking.totalPrice.toLocaleString()} ${result.booking.currency}. أرجو تأكيد الحجز.`
    );
    const whatsappRedirectUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

    return NextResponse.json({
      success: true,
      booking: result.booking,
      whatsappRedirectUrl,
      message: 'تم إرسال طلب الحجز بنجاح! سنتواصل معك قريباً لتأكيد الحجز.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
