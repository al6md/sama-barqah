import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { db, UserAccount } from '@/lib/db';

export const CUSTOMER_SESSION_COOKIE = 'sama_customer_session';
export const USER_SALT = 'sama_customer_auth_salt_2026';

export async function createCustomerSession(userId: string): Promise<string> {
  const token = `usr_${Buffer.from(`${userId}:${Date.now()}:${USER_SALT}`).toString('base64')}`;
  try {
    const cookieStore = await cookies();
    cookieStore.set(CUSTOMER_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
  } catch (e) {
    // Contexts where cookies are write-restricted
  }
  return token;
}

export async function destroyCustomerSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(CUSTOMER_SESSION_COOKIE);
  } catch (e) {}
}

export function parseCustomerToken(token?: string | null): string | null {
  if (!token) return null;
  const clean = token.trim();
  if (!clean.startsWith('usr_')) return null;

  try {
    const raw = Buffer.from(clean.replace('usr_', ''), 'base64').toString('utf-8');
    const [userId, timestamp, salt] = raw.split(':');
    if (userId && (salt === USER_SALT || salt) && Number(timestamp) > 0) {
      return userId;
    }
  } catch (e) {
    return null;
  }
  return null;
}

export async function getCurrentCustomer(req?: NextRequest | Request | null): Promise<UserAccount | null> {
  let userId: string | null = null;

  // 1. Check Request Headers
  if (req && 'headers' in req) {
    try {
      const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
      if (authHeader) {
        const token = authHeader.replace(/^Bearer\s+/i, '').trim();
        userId = parseCustomerToken(token);
      }
      if (!userId) {
        const customHeader = req.headers.get('x-customer-token');
        if (customHeader) {
          userId = parseCustomerToken(customHeader);
        }
      }
    } catch (e) {}
  }

  // 2. Check Cookie Store
  if (!userId) {
    try {
      const cookieStore = await cookies();
      const cookieToken = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
      if (cookieToken) {
        userId = parseCustomerToken(cookieToken);
      }
    } catch (e) {}
  }

  if (!userId) return null;

  const user = db.getUserById(userId);
  return user || null;
}
