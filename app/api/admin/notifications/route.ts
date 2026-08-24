import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

/**
 * GET /api/admin/notifications
 * Protected: Returns notifications and unread badge count.
 */
export async function GET(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get('limit')) || 30;

    const notifications = db.getNotifications(limit);
    const unreadCount = db.getUnreadNotificationsCount();

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/notifications
 * Protected: Mark single notification or all notifications as read.
 */
export async function PATCH(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const body = await req.json();

    if (body.all) {
      db.markAllNotificationsRead();
      return NextResponse.json({ success: true, message: 'تم تعليم جميع الإشعارات كمقروءة.' });
    }

    if (body.id) {
      const ok = db.markNotificationRead(body.id);
      return NextResponse.json({ success: ok });
    }

    return NextResponse.json({ success: false, error: 'معاملات غير صحيحة' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
