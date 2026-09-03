import { NextRequest } from 'next/server';
import { jsonResponse, sanitizeText } from '@/lib/security';
import { getPatientsStore, createPatientStore, getPatientByIdStore } from '@/lib/erpStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const search = searchParams.get('q');

    if (id) {
      const patient = getPatientByIdStore(id);
      if (!patient) return jsonResponse({ error: 'Patient not found' }, 404);
      return jsonResponse({ success: true, patient });
    }

    const patients = getPatientsStore(search || undefined);
    return jsonResponse(
      { success: true, count: patients.length, patients },
      200,
      {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=20',
      }
    );
  } catch (err) {
    console.error('Patients GET error:', err);
    return jsonResponse({ error: 'Failed to fetch patients' }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      gender,
      age,
      phone,
      email,
      bloodType,
      allergies,
      chronicConditions,
      emergencyContact,
      address,
    } = body;

    if (!name || !phone || !gender || !age) {
      return jsonResponse({ error: 'Missing required patient fields: name, phone, gender, age' }, 400);
    }

    const newPatient = createPatientStore({
      name: sanitizeText(name),
      gender: gender as 'Male' | 'Female' | 'Other',
      age: Number(age),
      phone: sanitizeText(phone),
      email: email ? sanitizeText(email).toLowerCase() : undefined,
      bloodType: (bloodType || 'Unknown') as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown',
      allergies: Array.isArray(allergies) ? allergies.map(sanitizeText) : [],
      chronicConditions: Array.isArray(chronicConditions) ? chronicConditions.map(sanitizeText) : [],
      emergencyContact: emergencyContact ? sanitizeText(emergencyContact) : '',
      address: address ? sanitizeText(address) : '',
    });

    return jsonResponse({
      success: true,
      message: 'Patient registered successfully!',
      patient: newPatient,
    }, 201);
  } catch (err) {
    console.error('Patient POST error:', err);
    return jsonResponse({ error: 'Failed to register patient' }, 500);
  }
}
