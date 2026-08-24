import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createAdminSession, destroyAdminSession, verifyAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminSession(req);
    if (!isAuthenticated) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }

    const settings = db.getSettings();
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        username: 'admin',
        name: 'مدير عام سما البارقة',
        role: 'Super Admin'
      },
      settings
    });
  } catch (error: any) {
    return NextResponse.json({ isAuthenticated: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'login';

    if (action === 'login') {
      const { username, password } = body;
      if (!password) {
        return NextResponse.json({ success: false, error: 'يرجى إدخال كلمة المرور' }, { status: 400 });
      }

      const isValid = db.verifyAdmin(password, username);
      if (!isValid) {
        return NextResponse.json({ success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' }, { status: 401 });
      }

      const token = await createAdminSession();
      return NextResponse.json({
        success: true,
        token,
        message: 'تم تسجيل الدخول بنجاح',
        user: {
          username: username || 'admin',
          name: 'مدير عام سما البارقة'
        }
      });
    }

    if (action === 'logout') {
      await destroyAdminSession();
      return NextResponse.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
    }

    if (action === 'change-password' || action === 'change_password') {
      const isAdmin = await verifyAdminSession(req);
      if (!isAdmin) {
        return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
      }

      const { currentPassword, newPassword } = body;
      if (!currentPassword || !newPassword || newPassword.length < 6) {
        return NextResponse.json({ success: false, error: 'كلمة المرور الجديدة يجب أن تكون 6 خانات على الأقل' }, { status: 400 });
      }

      const success = db.updateAdminPassword(currentPassword, newPassword);
      if (!success) {
        return NextResponse.json({ success: false, error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: 'تم تحديث كلمة المرور بنجاح' });
    }

    return NextResponse.json({ success: false, error: 'إجراء غير معروف' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

