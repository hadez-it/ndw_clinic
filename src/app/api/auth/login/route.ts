import { NextRequest } from 'next/server';
import { checkRateLimit, sanitizeText, jsonResponse } from '@/lib/security';
import { z } from 'zod';

const loginSchema = z.object({
  role: z.enum(['owner', 'doctor', 'receptionist', 'pharmacist', 'cashier']),
  identifier: z.string().trim().min(2, 'Username or identifier is required').max(100),
  password: z.string().min(4, 'Password / PIN is required').max(100),
});

export async function POST(req: NextRequest) {
  // 1. Anti-brute force rate limiting: 10 attempts per minute per IP
  if (!checkRateLimit(req, 10, 60000)) {
    return jsonResponse({ error: 'Too many login attempts. Please wait 1 minute.' }, 429);
  }

  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return jsonResponse(
        {
          error: 'Invalid login details',
          details: parsed.error.issues.map((i) => i.message),
        },
        400
      );
    }

    const { role, identifier, password } = parsed.data;
    const sanitizedId = sanitizeText(identifier);

    let userPayload = null;

    // 1. Clinic Owner / Executive
    if (role === 'owner') {
      const ownerUser = process.env.CLINIC_OWNER_USER || 'admin';
      const ownerPass = process.env.CLINIC_OWNER_PASSWORD || 'owner2026!';

      if (identifier === ownerUser && password === ownerPass) {
        userPayload = {
          id: 'user-owner-001',
          name: 'Clinic Executive Administrator',
          role: 'owner',
          username: ownerUser,
          department: 'Executive Clinic Administration',
        };
      } else {
        return jsonResponse({ error: 'Invalid owner username or administrative password.' }, 401);
      }
    }

    // 2. Doctor / Consulting Physician
    else if (role === 'doctor') {
      const doctorPin = process.env.DOCTOR_SECRET_PIN || 'doctor1234';

      if (password === doctorPin) {
        userPayload = {
          id: `doc-${Date.now()}`,
          name: sanitizedId.startsWith('Dr.') ? sanitizedId : `Dr. ${sanitizedId}`,
          role: 'doctor',
          specialty: 'Consulting Physician',
          department: 'Outpatient Clinical Department',
        };
      } else {
        return jsonResponse({ error: 'Invalid Doctor credentials or Secret PIN (default: doctor1234).' }, 401);
      }
    }

    // 3. Receptionist / Front Desk
    else if (role === 'receptionist') {
      const receptionPass = process.env.RECEPTION_PASSWORD || 'staff1234';

      if ((identifier.toLowerCase() === 'reception' || identifier.toLowerCase() === 'frontdesk' || identifier.toLowerCase() === 'staff') && password === receptionPass) {
        userPayload = {
          id: 'user-reception-001',
          name: 'Front Desk Receptionist',
          role: 'receptionist',
          username: 'reception',
          department: 'Patient Intake & Queue Desk',
        };
      } else {
        return jsonResponse({ error: 'Invalid receptionist credentials (demo: reception / staff1234).' }, 401);
      }
    }

    // 4. Pharmacist / Dispensary
    else if (role === 'pharmacist') {
      const pharmaPass = process.env.PHARMACIST_PASSWORD || 'pharma1234';

      if ((identifier.toLowerCase() === 'pharmacist' || identifier.toLowerCase() === 'pharma') && password === pharmaPass) {
        userPayload = {
          id: 'user-pharma-001',
          name: 'Chief Pharmacist',
          role: 'pharmacist',
          username: 'pharmacist',
          department: 'Pharmacy & Dispensary Unit',
        };
      } else {
        return jsonResponse({ error: 'Invalid pharmacist credentials (demo: pharmacist / pharma1234).' }, 401);
      }
    }

    // 5. Cashier / Billing Desk
    else if (role === 'cashier') {
      const cashierPass = process.env.CASHIER_PASSWORD || 'cashier1234';

      if ((identifier.toLowerCase() === 'cashier' || identifier.toLowerCase() === 'billing') && password === cashierPass) {
        userPayload = {
          id: 'user-cashier-001',
          name: 'Accounts & Billing Cashier',
          role: 'cashier',
          username: 'cashier',
          department: 'Cashier & Payment Reconciliation',
        };
      } else {
        return jsonResponse({ error: 'Invalid cashier credentials (demo: cashier / cashier1234).' }, 401);
      }
    }

    if (!userPayload) {
      return jsonResponse({ error: 'Unsupported or unauthorized clinic role.' }, 400);
    }

    const token = `clinic-token-${role}-${Date.now()}`;
    const cookieData = encodeURIComponent(JSON.stringify({ ...userPayload, token }));
    const maxAge = 30 * 24 * 60 * 60; // 30 days

    return jsonResponse(
      {
        success: true,
        role,
        user: userPayload,
        token,
        message: `Welcome, ${userPayload.name}. Access granted.`,
      },
      200,
      {
        'Set-Cookie': `clinic_auth=${cookieData}; Path=/; Max-Age=${maxAge}; SameSite=Lax`,
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    return jsonResponse({ error: 'Internal server error during authentication.' }, 500);
  }
}
