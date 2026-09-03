import { NextRequest } from 'next/server';
import { jsonResponse, sanitizeText } from '@/lib/security';
import {
  getPrescriptionsStore,
  createPrescriptionStore,
  dispensePrescriptionStore,
} from '@/lib/erpStore';

export async function GET() {
  try {
    const list = getPrescriptionsStore();
    return jsonResponse({
      success: true,
      count: list.length,
      prescriptions: list,
    });
  } catch (err) {
    console.error('Prescriptions GET error:', err);
    return jsonResponse({ error: 'Failed to fetch prescriptions' }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      patientId,
      patientHn,
      patientName,
      doctorId,
      doctorName,
      date,
      items,
      notes,
    } = body;

    if (!patientId || !doctorName || !items || !items.length) {
      return jsonResponse({ error: 'Missing required prescription fields' }, 400);
    }

    const newRx = createPrescriptionStore({
      patientId: sanitizeText(patientId),
      patientHn: sanitizeText(patientHn || ''),
      patientName: sanitizeText(patientName || ''),
      doctorId: sanitizeText(doctorId || ''),
      doctorName: sanitizeText(doctorName),
      date: date || new Date().toISOString().split('T')[0],
      status: 'pending_dispense',
      items,
      notes: notes ? sanitizeText(notes) : undefined,
    });

    return jsonResponse({
      success: true,
      message: 'Prescription issued successfully!',
      prescription: newRx,
    }, 201);
  } catch (err) {
    console.error('Prescription POST error:', err);
    return jsonResponse({ error: 'Failed to create prescription' }, 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action, dispensedBy } = body;

    if (!id || action !== 'dispense') {
      return jsonResponse({ error: 'Valid prescription ID and action="dispense" required' }, 400);
    }

    const result = dispensePrescriptionStore(id, dispensedBy || 'Pharmacy Dispensary Desk');
    if (!result.prescription) {
      return jsonResponse({ error: 'Prescription not found' }, 404);
    }

    return jsonResponse({
      success: true,
      message: 'Prescription fulfilled and pharmacy inventory deducted!',
      prescription: result.prescription,
      stockUpdates: result.stockUpdates,
    });
  } catch (err) {
    console.error('Prescription PATCH error:', err);
    return jsonResponse({ error: 'Failed to dispense prescription' }, 500);
  }
}
