import { NextRequest } from 'next/server';
import { appointmentSchema } from '@/lib/types';
import { checkRateLimit, sanitizeText, jsonResponse } from '@/lib/security';
import { getAdminSupabase } from '@/lib/supabase';

// In-memory fallback appointment repository
const mockAppointments: Array<Record<string, unknown>> = [];

export async function POST(req: NextRequest) {
  // 1. Rate limiting defense against spam / denial-of-service
  if (!checkRateLimit(req, 5, 60000)) {
    return jsonResponse({ error: 'Too many requests. Please try again in 1 minute.' }, 429);
  }

  try {
    const rawBody = await req.json();

    // 2. Strict Zod Schema validation
    const parseResult = appointmentSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return jsonResponse({
        error: 'Validation failed',
        details: parseResult.error.issues.map((i) => i.message),
      }, 400);
    }

    const data = parseResult.data;

    // 3. Sanitization
    const sanitizedAppointment = {
      patient_name: sanitizeText(data.patientName),
      patient_email: data.patientEmail.toLowerCase(),
      patient_phone: sanitizeText(data.patientPhone),
      doctor_id: data.doctorId.length > 20 ? data.doctorId : null,
      doctor_name: sanitizeText(data.doctorName),
      appointment_date: data.appointmentDate,
      appointment_time: sanitizeText(data.appointmentTime),
      notes: sanitizeText(data.notes || ''),
      status: 'pending',
    };

    // 4. Save to Supabase if connected
    const supabase = getAdminSupabase();
    if (supabase) {
      const { data: inserted, error: dbError } = await supabase
        .from('appointments')
        .insert([sanitizedAppointment])
        .select()
        .single();

      if (dbError) {
        console.error('Supabase appointment insert error:', dbError);
        return jsonResponse({ error: 'Database error saving appointment.' }, 500);
      }

      return jsonResponse({
        success: true,
        message: 'Appointment booked successfully!',
        appointment: { id: inserted.id, status: inserted.status },
      }, 201);
    }

    // Fallback store
    const localId = `appt-${Date.now()}`;
    mockAppointments.push({ id: localId, ...sanitizedAppointment });

    return jsonResponse({
      success: true,
      message: 'Appointment booked successfully (local demo mode).',
      appointment: { id: localId, status: 'pending' },
    }, 201);
  } catch (err) {
    console.error('Appointment endpoint error:', err);
    return jsonResponse({ error: 'Internal server error processing appointment.' }, 500);
  }
}
