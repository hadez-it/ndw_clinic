import { NextRequest } from 'next/server';
import { jsonResponse, sanitizeText } from '@/lib/security';
import { getEMRRecordsStore, createEMRRecordStore } from '@/lib/erpStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');

    const records = getEMRRecordsStore(patientId || undefined);
    return jsonResponse({
      success: true,
      count: records.length,
      records,
    });
  } catch (err) {
    console.error('EMR GET error:', err);
    return jsonResponse({ error: 'Failed to fetch EMR records' }, 500);
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
      vitals,
      chiefComplaint,
      diagnosis,
      clinicalNotes,
      prescriptions,
      followUpDate,
    } = body;

    if (!patientId || !doctorName || !diagnosis) {
      return jsonResponse({ error: 'Missing required EMR fields (patient, doctor, diagnosis)' }, 400);
    }

    const weight = Number(vitals?.weight) || 60;
    const height = Number(vitals?.height) || 165;
    const heightInMeters = height / 100;
    const calculatedBmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));

    const sanitizedVitals = {
      bloodPressure: sanitizeText(vitals?.bloodPressure || '120/80'),
      heartRate: Number(vitals?.heartRate) || 72,
      temperature: Number(vitals?.temperature) || 36.6,
      spO2: Number(vitals?.spO2) || 98,
      weight,
      height,
      bmi: calculatedBmi,
    };

    const newRecord = createEMRRecordStore({
      patientId: sanitizeText(patientId),
      patientHn: sanitizeText(patientHn || ''),
      patientName: sanitizeText(patientName || ''),
      doctorId: sanitizeText(doctorId || ''),
      doctorName: sanitizeText(doctorName || 'Attending Physician'),
      date: date || new Date().toISOString().split('T')[0],
      vitals: sanitizedVitals,
      chiefComplaint: sanitizeText(chiefComplaint || ''),
      diagnosis: sanitizeText(diagnosis),
      clinicalNotes: sanitizeText(clinicalNotes || ''),
      prescriptions: Array.isArray(prescriptions) ? prescriptions : [],
      followUpDate: followUpDate ? sanitizeText(followUpDate) : undefined,
    });

    return jsonResponse({
      success: true,
      message: 'Consultation encounter and EMR record saved!',
      record: newRecord,
    }, 201);
  } catch (err) {
    console.error('EMR POST error:', err);
    return jsonResponse({ error: 'Failed to save EMR record' }, 500);
  }
}
