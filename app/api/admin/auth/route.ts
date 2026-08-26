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
    const admin = db.getAdminCredentials();
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        username: admin.username || 'admin',
        name: admin.name || 'مدير عام سما البارقة',
        email: admin.email || 'admin@samabarqah.iq',
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

      const admin = db.getAdminCredentials();
      const sessionUsername = username?.trim() || admin.username || 'admin';
      const token = await createAdminSession(sessionUsername);

      return NextResponse.json({
        success: true,
        token,
        message: 'تم تسجيل الدخول بنجاح',
        user: {
          username: admin.username || sessionUsername,
          name: admin.name || 'مدير عام سما البارقة',
          email: admin.email || 'admin@samabarqah.iq'
        }
      });
    }

    if (action === 'logout') {
      await destroyAdminSession();
      return NextResponse.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
    }

    if (action === 'change_username' || action === 'update_profile' || action === 'change-username') {
      const isAdmin = await verifyAdminSession(req);
      if (!isAdmin) {
        return NextResponse.json({ success: false, error: 'غير مصرح لك بإجراء هذه العملية' }, { status: 401 });
      }

      const { newUsername, name, email } = body;
      if (!newUsername || newUsername.trim().length < 3) {
        return NextResponse.json({ success: false, error: 'اسم المستخدم يجب أن يتكون من 3 أحرف على الأقل' }, { status: 400 });
      }

      const updated = db.updateAdminProfile({
        username: newUsername.trim(),
        name: name?.trim(),
        email: email?.trim()
      });

      return NextResponse.json({
        success: true,
        message: 'تم تحديث اسم المستخدم والبيانات الشخصية للمدير بنجاح',
        user: updated
      });
    }

    if (action === 'change-password' || action === 'change_password') {
      const isAdmin = await verifyAdminSession(req);
      if (!isAdmin) {
        return NextResponse.json({ success: false, error: 'غير مصرح لك بإجراء هذه العملية' }, { status: 401 });
      }

      const { currentPassword, newPassword } = body;
      if (!currentPassword) {
        return NextResponse.json({ success: false, error: 'يرجى إدخال كلمة المرور الحالية' }, { status: 400 });
      }
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ success: false, error: 'كلمة المرور الجديدة يجب أن تكون 6 خانات على الأقل' }, { status: 400 });
      }

      const success = db.updateAdminPassword(currentPassword, newPassword);
      if (!success) {
        return NextResponse.json({ success: false, error: 'كلمة المرور الحالية غير صحيحة، يرجى التأكد منها' }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: 'تم تحديث كلمة المرور بنجاح' });
    }

    return NextResponse.json({ success: false, error: 'إجراء غير معروف' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

