import { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/security';

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('clinic_auth');

  if (!cookie || !cookie.value) {
    return jsonResponse({ authenticated: false, user: null }, 200);
  }

  try {
    const sessionData = JSON.parse(decodeURIComponent(cookie.value));
    return jsonResponse({
      authenticated: true,
      user: sessionData,
    });
  } catch {
    return jsonResponse({ authenticated: false, user: null }, 200);
  }
}
