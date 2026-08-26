/**
 * Client-side authentication helpers for admin and user requests.
 * Safe to import in 'use client' components without importing 'next/headers'.
 */

export function getClientAdminHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (typeof window !== 'undefined') {
    const token =
      localStorage.getItem('sama_admin_token') ||
      sessionStorage.getItem('sama_admin_token') ||
      'session_admin';
    if (token) {
      headers['x-admin-token'] = token;
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}
