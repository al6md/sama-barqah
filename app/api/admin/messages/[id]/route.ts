import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

/**
 * PATCH /api/admin/messages/:id
 * Protected: Update status or read state.
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    if (body.status) {
      db.updateMessageStatus(id, body.status);
    }

    return NextResponse.json({ success: true, message: 'تم تحديث حالة الرسالة.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/messages/:id
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await verifyAdminSession(req);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'غير مصرح بالدخول' }, { status: 401 });
    }

    const { id } = await params;
    const data = (await import('@/lib/db')).getDatabase();
    const index = data.contactMessages.findIndex((m) => m.id === id);

    if (index !== -1) {
      data.contactMessages.splice(index, 1);
      (await import('@/lib/db')).saveDatabase(data);
    }

    return NextResponse.json({ success: true, message: 'تم حذف الرسالة.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
