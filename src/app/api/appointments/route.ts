import { NextRequest } from 'next/server';
import { appointmentSchema } from '@/lib/types';
import { checkRateLimit, sanitizeText, jsonResponse } from '@/lib/security';
import {
  getAppointmentsStore,
  createAppointmentStore,
  updateAppointmentStore,
  deleteAppointmentStore,
} from '@/lib/erpStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const doctorId = searchParams.get('doctorId');
    const status = searchParams.get('status');
    const query = searchParams.get('query')?.toLowerCase().trim();

    let list = getAppointmentsStore();

    if (date) {
      list = list.filter((a) => a.appointmentDate === date);
    }
    if (doctorId && doctorId !== 'all') {
      list = list.filter((a) => a.doctorId === doctorId || a.doctorName.toLowerCase().includes(doctorId.toLowerCase()));
    }
    if (status && status !== 'all') {
      list = list.filter((a) => a.status === status);
    }
    if (query) {
      list = list.filter(
        (a) =>
          a.patientName.toLowerCase().includes(query) ||
          a.patientPhone.includes(query) ||
          (a.tokenNumber && a.tokenNumber.toLowerCase().includes(query))
      );
    }

    return jsonResponse(
      {
        success: true,
        count: list.length,
        appointments: list,
      },
      200,
      {
        'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10',
      }
    );
  } catch (err) {
    console.error('Appointments GET error:', err);
    return jsonResponse({ error: 'Internal server error fetching appointments.' }, 500);
  }
}

export async function POST(req: NextRequest) {
  // Rate limiting defense against spam / denial-of-service
  if (!checkRateLimit(req, 10, 60000)) {
    return jsonResponse({ error: 'Too many requests. Please try again in 1 minute.' }, 429);
  }

  try {
    const rawBody = await req.json();

    // Strict Zod Schema validation
    const parseResult = appointmentSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return jsonResponse({
        error: 'Validation failed',
        details: parseResult.error.issues.map((i) => i.message),
      }, 400);
    }

    const data = parseResult.data;

    const newAppt = createAppointmentStore({
      patientName: sanitizeText(data.patientName),
      patientEmail: data.patientEmail.toLowerCase(),
      patientPhone: sanitizeText(data.patientPhone),
      doctorId: data.doctorId,
      doctorName: sanitizeText(data.doctorName),
      appointmentDate: data.appointmentDate,
      appointmentTime: sanitizeText(data.appointmentTime),
      notes: sanitizeText(data.notes || ''),
      status: 'pending',
    });

    return jsonResponse({
      success: true,
      message: 'Appointment booked successfully!',
      appointment: newAppt,
    }, 201);
  } catch (err) {
    console.error('Appointment endpoint error:', err);
    return jsonResponse({ error: 'Internal server error processing appointment.' }, 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, roomNumber, notes } = body;

    if (!id) {
      return jsonResponse({ error: 'Appointment ID is required' }, 400);
    }

    const updated = updateAppointmentStore(id, {
      ...(status ? { status } : {}),
      ...(roomNumber ? { roomNumber: sanitizeText(roomNumber) } : {}),
      ...(notes !== undefined ? { notes: sanitizeText(notes) } : {}),
    });

    if (!updated) {
      return jsonResponse({ error: 'Appointment not found' }, 404);
    }

    return jsonResponse({
      success: true,
      message: `Appointment updated to ${status || 'new status'}`,
      appointment: updated,
    });
  } catch (err) {
    console.error('Appointment PATCH error:', err);
    return jsonResponse({ error: 'Failed to update appointment' }, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return jsonResponse({ error: 'Appointment ID required' }, 400);
    }

    const deleted = deleteAppointmentStore(id);
    if (!deleted) {
      return jsonResponse({ error: 'Appointment not found or already removed' }, 404);
    }

    return jsonResponse({ success: true, message: 'Appointment removed' });
  } catch (err) {
    console.error('Appointment DELETE error:', err);
    return jsonResponse({ error: 'Failed to delete appointment' }, 500);
  }
}
