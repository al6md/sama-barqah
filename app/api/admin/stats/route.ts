import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

/**
 * GET /api/admin/stats
 * Protected: Returns real-time administrative metrics and analytics.
 */
export async function GET(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const bookings = db.getBookings();
    const trips = db.getTrips();
    const analytics = db.getAnalytics();
    const unreadNotifications = db.getUnreadNotificationsCount();

    const totalBookings = bookings.length;
    const newBookings = bookings.filter((b) => b.status === 'جديد').length;
    const inReviewBookings = bookings.filter((b) => b.status === 'قيد المراجعة' || b.status === 'تم التواصل مع العميل').length;
    const confirmedBookings = bookings.filter((b) => b.status === 'مؤكد' || b.status === 'مكتمل').length;
    const canceledBookings = bookings.filter((b) => b.status === 'ملغي').length;

    const totalRevenue = bookings
      .filter((b) => b.status !== 'ملغي')
      .reduce((acc, b) => acc + (b.totalPrice || 0), 0);

    const totalTravelers = bookings
      .filter((b) => b.status !== 'ملغي')
      .reduce((acc, b) => acc + (b.travelerCount || 0), 0);

    // Destination breakdown
    const destinationStats: Record<string, { count: number; revenue: number }> = {};
    bookings.forEach((b) => {
      const dest = b.destination || 'غير محدد';
      if (!destinationStats[dest]) {
        destinationStats[dest] = { count: 0, revenue: 0 };
      }
      destinationStats[dest].count += 1;
      if (b.status !== 'ملغي') {
        destinationStats[dest].revenue += b.totalPrice || 0;
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalBookings,
        newBookings,
        inReviewBookings,
        confirmedBookings,
        canceledBookings,
        totalRevenue,
        totalTravelers,
        unreadNotifications,
        totalTrips: trips.length,
        activeTrips: trips.filter((t) => t.status === 'active').length,
        destinationStats,
        analyticsSummary: {
          totalVisits: analytics.totalVisits,
          pageViews: analytics.pageViews,
          deviceStats: analytics.deviceStats
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
