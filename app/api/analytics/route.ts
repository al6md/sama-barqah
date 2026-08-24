import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const analytics = db.getAnalytics();
    const trips = db.getTrips();
    const bookings = db.getBookings();

    const today = new Date().toISOString().split('T')[0];
    const todayVisitors = analytics.dailyVisits[today] || 0;

    // Calculate last 7 days visitors and bookings
    const last7Days: Array<{ date: string; dayName: string; visitors: number; bookings: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const dayName = dayNames[d.getDay()];

      const dayBookings = bookings.filter(b => b.createdAt.startsWith(dateStr)).length;
      const dayVisits = analytics.dailyVisits[dateStr] || 0;

      last7Days.push({
        date: dateStr,
        dayName,
        visitors: dayVisits,
        bookings: dayBookings
      });
    }

    // Top Trips by bookings and views
    const topTrips = trips.map(t => {
      const tripBookings = bookings.filter(b => b.tripId === t.id).length;
      const views = analytics.tripViews[t.id] || 0;
      return {
        id: t.id,
        title: t.title,
        destination: t.destination,
        price: t.price,
        bookingsCount: tripBookings,
        viewsCount: views,
        bookedSeats: t.bookedSeats,
        maxSeats: t.maxSeats
      };
    }).sort((a, b) => b.bookingsCount - a.bookingsCount || b.viewsCount - a.viewsCount);

    return NextResponse.json({
      success: true,
      analytics: {
        ...analytics,
        todayVisitors,
        last7Days,
        topTrips
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const page = body.page || '/';
    const tripSlug = body.tripSlug;
    const referrer = body.referrer;
    const userAgent = req.headers.get('user-agent') || '';

    let device: 'mobile' | 'desktop' | 'tablet' = 'desktop';
    if (/iPad|Tablet/i.test(userAgent)) {
      device = 'tablet';
    } else if (/Mobile|Android|iPhone/i.test(userAgent)) {
      device = 'mobile';
    }

    db.recordPageView({
      page,
      tripSlug,
      referrer,
      device
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
