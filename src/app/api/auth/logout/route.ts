import { jsonResponse } from '@/lib/security';

export async function POST() {
  return jsonResponse(
    { success: true, message: 'Logged out successfully.' },
    200,
    {
      'Set-Cookie': 'clinic_auth=; Path=/; Max-Age=0; SameSite=Lax',
    }
  );
}
