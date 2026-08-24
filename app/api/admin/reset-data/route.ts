import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }

    const body = await req.json();
    const mode = body.mode; // 'reset_seed' or 'clear_seed'

    if (mode === 'reset_seed') {
      db.resetTripsToSeed();
      return NextResponse.json({ success: true, message: 'تم استعادة الرحلات التجريبية بنجاح' });
    }

    if (mode === 'clear_seed') {
      const trips = db.getTrips();
      const nonSeed = trips.filter(t => !t.isSeed);
      for (const t of trips) {
        if (t.isSeed) {
          db.deleteTrip(t.id);
        }
      }
      return NextResponse.json({ success: true, message: 'تم إزالة الرحلات التجريبية بنجاح' });
    }

    return NextResponse.json({ success: false, error: 'خيار غير صحيح' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
