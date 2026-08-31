import { NextRequest } from 'next/server';
import { checkRateLimit, sanitizeText, jsonResponse } from '@/lib/security';
import { z } from 'zod';

const loginSchema = z.object({
  role: z.enum(['doctor', 'owner']),
  identifier: z.string().trim().min(2, 'Username or Email is required').max(100),
  password: z.string().min(4, 'Password / PIN is required').max(100),
});

export async function POST(req: NextRequest) {
  // 1. Rate Limiting defense against brute force attacks
  if (!checkRateLimit(req, 6, 60000)) {
    return jsonResponse({ error: 'Too many login attempts. Please wait 1 minute.' }, 429);
  }

  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return jsonResponse({
        error: 'Invalid login details',
        details: parsed.error.issues.map((i) => i.message),
      }, 400);
    }

    const { role, identifier, password } = parsed.data;

    // Owner credentials verification
    if (role === 'owner') {
      const ownerUser = process.env.CLINIC_OWNER_USER || 'admin';
      const ownerPass = process.env.CLINIC_OWNER_PASSWORD || 'owner2026!';

      if (identifier === ownerUser && password === ownerPass) {
        return jsonResponse({
          success: true,
          role: 'owner',
          user: {
            name: 'Clinic Executive Owner',
            role: 'owner',
            username: ownerUser,
          },
          token: `owner-token-${Date.now()}`,
          message: 'Welcome back, Clinic Administrator.',
        });
      }

      return jsonResponse({ error: 'Invalid owner username or administrative password.' }, 401);
    }

    // Doctor credentials verification
    if (role === 'doctor') {
      const doctorPin = process.env.DOCTOR_SECRET_PIN || 'doctor1234';

      if (password === doctorPin) {
        return jsonResponse({
          success: true,
          role: 'doctor',
          user: {
            name: sanitizeText(identifier),
            role: 'doctor',
          },
          token: `doctor-token-${Date.now()}`,
          message: `Welcome Dr. ${sanitizeText(identifier)}. Physician portal unlocked.`,
        });
      }

      return jsonResponse({ error: 'Invalid Doctor credentials or Secret PIN.' }, 401);
    }

    return jsonResponse({ error: 'Invalid role requested.' }, 400);
  } catch (err) {
    console.error('Login error:', err);
    return jsonResponse({ error: 'Internal server error during authentication.' }, 500);
  }
}
