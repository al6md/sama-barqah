import { NextResponse } from 'next/server';
import { destroyCustomerSession } from '@/lib/userAuth';

export async function POST() {
  try {
    await destroyCustomerSession();
    return NextResponse.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
