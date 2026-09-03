import {
  Patient,
  Appointment,
  EMRRecord,
  Medicine,
  Prescription,
  Invoice,
  LiveQueueItem,
} from './types';

// ============================================================================
// IN-MEMORY HEALTHCARE ERP DATA STORE (HYBRID SUPABASE READY)
// ============================================================================

// 1. Initial Patients
let patients: Patient[] = [
  {
    id: 'pat-001',
    hn: 'HN-2026-001',
    name: 'U Kyaw Myint',
    gender: 'Male',
    age: 54,
    phone: '09450112233',
    email: 'kyawmyint.ygn@gmail.com',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Sulfa drugs'],
    chronicConditions: ['Hypertension (သွေးတိုး)', 'Mild Hyperlipidemia'],
    emergencyContact: 'Daw San San (Wife) - 09450112234',
    address: 'No. 45, Baho Road, Sanchaung, Yangon',
    createdAt: '2026-08-10T09:00:00Z',
  },
  {
    id: 'pat-002',
    hn: 'HN-2026-002',
    name: 'Daw Mya Sandar',
    gender: 'Female',
    age: 42,
    phone: '09798445566',
    email: 'myasandar@gmail.com',
    bloodType: 'B+',
    allergies: ['None known'],
    chronicConditions: ['Type 2 Diabetes Mellitus (ဆီးချို)'],
    emergencyContact: 'U Tin Win (Husband) - 09798445567',
    address: 'No. 12, Pyay Road, Kamayut, Yangon',
    createdAt: '2026-08-15T10:30:00Z',
  },
  {
    id: 'pat-003',
    hn: 'HN-2026-003',
    name: 'Ko Zaw Lin Oo',
    gender: 'Male',
    age: 29,
    phone: '09971234567',
    email: 'zawlinoo.dev@gmail.com',
    bloodType: 'A+',
    allergies: ['Aspirin'],
    chronicConditions: ['Allergic Rhinitis / Mild Asthma'],
    emergencyContact: 'Daw Hla Hla (Mother) - 09971234568',
    address: 'Room 3B, Insein Road, Hledan, Yangon',
    createdAt: '2026-08-20T14:15:00Z',
  },
  {
    id: 'pat-004',
    hn: 'HN-2026-004',
    name: 'Ma Hnin Wai Phyo',
    gender: 'Female',
    age: 35,
    phone: '09250998877',
    email: 'hninwaiphyo@gmail.com',
    bloodType: 'AB+',
    allergies: ['Ciprofloxacin'],
    chronicConditions: ['Migraine with Aura'],
    emergencyContact: 'Ko Thet Naing (Brother) - 09250998878',
    address: 'No. 88, Upper Pazundaung Road, Yangon',
    createdAt: '2026-08-25T11:00:00Z',
  },
];

// 2. Initial Appointments
const todayIso = new Date().toISOString().split('T')[0];

let appointments: Appointment[] = [
  {
    id: 'appt-101',
    tokenNumber: 'A-01',
    patientName: 'U Kyaw Myint',
    patientEmail: 'kyawmyint.ygn@gmail.com',
    patientPhone: '09450112233',
    doctorId: '11111111-1111-1111-1111-111111111111',
    doctorName: 'Dr. Sarah Jenkins',
    roomNumber: 'Room 101',
    appointmentDate: todayIso,
    appointmentTime: '09:00 AM',
    notes: 'Follow-up on blood pressure regulation and ECG review.',
    status: 'in_consultation',
    createdAt: `${todayIso}T08:30:00Z`,
  },
  {
    id: 'appt-102',
    tokenNumber: 'A-02',
    patientName: 'Daw Mya Sandar',
    patientEmail: 'myasandar@gmail.com',
    patientPhone: '09798445566',
    doctorId: '11111111-1111-1111-1111-111111111111',
    doctorName: 'Dr. Sarah Jenkins',
    roomNumber: 'Room 101',
    appointmentDate: todayIso,
    appointmentTime: '09:30 AM',
    notes: 'Quarterly fasting blood sugar and HbA1c review.',
    status: 'confirmed',
    createdAt: `${todayIso}T08:45:00Z`,
  },
  {
    id: 'appt-103',
    tokenNumber: 'B-01',
    patientName: 'Ko Zaw Lin Oo',
    patientEmail: 'zawlinoo.dev@gmail.com',
    patientPhone: '09971234567',
    doctorId: '22222222-2222-2222-2222-222222222222',
    doctorName: 'Dr. Marcus Vance',
    roomNumber: 'Room 102',
    appointmentDate: todayIso,
    appointmentTime: '10:00 AM',
    notes: 'Seasonal wheezing and persistent nocturnal cough.',
    status: 'in_consultation',
    createdAt: `${todayIso}T09:00:00Z`,
  },
  {
    id: 'appt-104',
    tokenNumber: 'C-01',
    patientName: 'Ma Hnin Wai Phyo',
    patientEmail: 'hninwaiphyo@gmail.com',
    patientPhone: '09250998877',
    doctorId: '33333333-3333-3333-3333-333333333333',
    doctorName: 'Dr. Elena Rostova',
    roomNumber: 'Room 103',
    appointmentDate: todayIso,
    appointmentTime: '10:30 AM',
    notes: 'Thyroid profile check and general fatigue assessment.',
    status: 'pending',
    createdAt: `${todayIso}T09:15:00Z`,
  },
  {
    id: 'appt-105',
    tokenNumber: 'A-03',
    patientName: 'U Tin Aung',
    patientEmail: 'tinaung99@gmail.com',
    patientPhone: '0951239876',
    doctorId: '11111111-1111-1111-1111-111111111111',
    doctorName: 'Dr. Sarah Jenkins',
    roomNumber: 'Room 101',
    appointmentDate: todayIso,
    appointmentTime: '11:00 AM',
    notes: 'Chest discomfort upon heavy exertion.',
    status: 'pending',
    createdAt: `${todayIso}T09:20:00Z`,
  },
  {
    id: 'appt-106',
    tokenNumber: 'D-01',
    patientName: 'Daw Khin Khin',
    patientEmail: 'khinkhin@gmail.com',
    patientPhone: '0942001199',
    doctorId: '44444444-4444-4444-4444-444444444444',
    doctorName: 'Dr. Alexander Patel',
    roomNumber: 'Room 104',
    appointmentDate: todayIso,
    appointmentTime: '08:30 AM',
    notes: 'Bilateral knee osteoarthritic stiffness.',
    status: 'completed',
    createdAt: `${todayIso}T08:00:00Z`,
  },
];

// 3. Initial Medicines Catalog
let medicines: Medicine[] = [
  {
    id: 'med-001',
    code: 'MED-101',
    genericName: 'Amoxicillin Trihydrate',
    brandName: 'Amoxil Capsule',
    category: 'Antibiotics (ပိုးသတ်ဆေး)',
    dosageForm: 'Capsule',
    strength: '500mg',
    currentStock: 240,
    reorderLevel: 50,
    unitPrice: 800, // MMK
    costPrice: 400,
    expiryDate: '2027-12-31',
    batchNumber: 'BX-2026A',
  },
  {
    id: 'med-002',
    code: 'MED-102',
    genericName: 'Paracetamol',
    brandName: 'Biogesic Tablet',
    category: 'Analgesics & Antipyretic (အဖျားအကိုက်ပျောက်ဆေး)',
    dosageForm: 'Tablet',
    strength: '500mg',
    currentStock: 650,
    reorderLevel: 100,
    unitPrice: 300,
    costPrice: 120,
    expiryDate: '2028-06-30',
    batchNumber: 'BX-2026B',
  },
  {
    id: 'med-003',
    code: 'MED-103',
    genericName: 'Amlodipine Besylate',
    brandName: 'Norvasc Tablet',
    category: 'Cardiovascular (သွေးတိုးကျဆေး)',
    dosageForm: 'Tablet',
    strength: '5mg',
    currentStock: 180,
    reorderLevel: 40,
    unitPrice: 1200,
    costPrice: 650,
    expiryDate: '2027-09-15',
    batchNumber: 'BX-2026C',
  },
  {
    id: 'med-004',
    code: 'MED-104',
    genericName: 'Metformin Hydrochloride',
    brandName: 'Glucophage Tablet',
    category: 'Endocrinology (ဆီးချိုထိန်းဆေး)',
    dosageForm: 'Tablet',
    strength: '500mg',
    currentStock: 320,
    reorderLevel: 60,
    unitPrice: 900,
    costPrice: 450,
    expiryDate: '2027-11-20',
    batchNumber: 'BX-2026D',
  },
  {
    id: 'med-005',
    code: 'MED-105',
    genericName: 'Omeprazole',
    brandName: 'Losec Capsule',
    category: 'Gastroenterology (အစာအိမ်လေဆေး)',
    dosageForm: 'Capsule',
    strength: '20mg',
    currentStock: 140,
    reorderLevel: 30,
    unitPrice: 1500,
    costPrice: 800,
    expiryDate: '2028-01-10',
    batchNumber: 'BX-2026E',
  },
  {
    id: 'med-006',
    code: 'MED-106',
    genericName: 'Cetirizine Dihydrochloride',
    brandName: 'Zyrtec Tablet',
    category: 'Antihistamines (အအေးမိ/အလက်ဂျီဆေး)',
    dosageForm: 'Tablet',
    strength: '10mg',
    currentStock: 85,
    reorderLevel: 40,
    unitPrice: 700,
    costPrice: 320,
    expiryDate: '2027-08-25',
    batchNumber: 'BX-2026F',
  },
  {
    id: 'med-007',
    code: 'MED-107',
    genericName: 'Azithromycin',
    brandName: 'Zithromax Tablet',
    category: 'Antibiotics (ပိုးသတ်ဆေး)',
    dosageForm: 'Tablet',
    strength: '250mg',
    currentStock: 22, // Low stock!
    reorderLevel: 30,
    unitPrice: 3500,
    costPrice: 2000,
    expiryDate: '2027-05-18',
    batchNumber: 'BX-2026G',
  },
  {
    id: 'med-008',
    code: 'MED-108',
    genericName: 'Ibuprofen',
    brandName: 'Brufen Tablet',
    category: 'NSAIDs (အရောင်ကျအကိုက်အခဲပျောက်ဆေး)',
    dosageForm: 'Tablet',
    strength: '400mg',
    currentStock: 190,
    reorderLevel: 50,
    unitPrice: 600,
    costPrice: 250,
    expiryDate: '2028-03-30',
    batchNumber: 'BX-2026H',
  },
  {
    id: 'med-009',
    code: 'MED-109',
    genericName: 'Oral Rehydration Salts',
    brandName: 'Royal ORS Sachet',
    category: 'Electrolytes (ဓာတ်ဆားထုတ်)',
    dosageForm: 'Sachet',
    strength: 'Standard Pack',
    currentStock: 420,
    reorderLevel: 80,
    unitPrice: 500,
    costPrice: 200,
    expiryDate: '2028-10-01',
    batchNumber: 'BX-2026I',
  },
  {
    id: 'med-010',
    code: 'MED-110',
    genericName: 'Neurobion (B1+B6+B12)',
    brandName: 'Neurobion Forte Tablet',
    category: 'Vitamins & Minerals (အားဆေး/ဗီတာမင်)',
    dosageForm: 'Tablet',
    strength: 'Forte Formula',
    currentStock: 210,
    reorderLevel: 50,
    unitPrice: 1100,
    costPrice: 600,
    expiryDate: '2028-04-12',
    batchNumber: 'BX-2026J',
  },
];

// 4. Initial EMR Consultation Records
let emrRecords: EMRRecord[] = [
  {
    id: 'emr-001',
    patientId: 'pat-001',
    patientHn: 'HN-2026-001',
    patientName: 'U Kyaw Myint',
    doctorId: '11111111-1111-1111-1111-111111111111',
    doctorName: 'Dr. Sarah Jenkins',
    date: todayIso,
    vitals: {
      bloodPressure: '135/88',
      heartRate: 76,
      temperature: 36.6,
      spO2: 98,
      weight: 68,
      height: 168,
      bmi: 24.1,
    },
    chiefComplaint: 'Occasional morning occipital headache and dizziness for past 2 weeks.',
    diagnosis: 'Primary Essential Hypertension (Grade 1 - Mildly Elevated)',
    clinicalNotes:
      'Patient reports mild morning headaches. S1, S2 audible, no murmurs. Lungs clear to auscultation bilaterally. Advised DASH diet, sodium restriction < 2g/day, and continuation of Amlodipine 5mg OD.',
    prescriptions: [
      {
        medicineId: 'med-003',
        medicineName: 'Amlodipine Besylate (Norvasc) 5mg',
        dosage: '5mg',
        frequency: '1 tablet once daily in morning (OD Mane)',
        duration: '30 days',
        quantity: 30,
        instructions: 'Take after breakfast with water. Monitor morning BP.',
      },
      {
        medicineId: 'med-002',
        medicineName: 'Paracetamol (Biogesic) 500mg',
        dosage: '500mg',
        frequency: '1 tablet every 6 hours as needed for headache (PRN)',
        duration: '5 days',
        quantity: 10,
        instructions: 'Take only when headache occurs. Do not exceed 4 tabs per day.',
      },
    ],
    followUpDate: '2026-10-05',
    createdAt: `${todayIso}T09:15:00Z`,
  },
];

// 5. Initial Prescriptions
let prescriptions: Prescription[] = [
  {
    id: 'rx-001',
    prescriptionNumber: 'RX-2026-001',
    patientId: 'pat-001',
    patientHn: 'HN-2026-001',
    patientName: 'U Kyaw Myint',
    doctorId: '11111111-1111-1111-1111-111111111111',
    doctorName: 'Dr. Sarah Jenkins',
    date: todayIso,
    status: 'pending_dispense',
    items: [
      {
        medicineId: 'med-003',
        medicineName: 'Amlodipine Besylate (Norvasc) 5mg',
        dosage: '5mg',
        frequency: '1 tab once daily in morning (OD Mane)',
        duration: '30 days',
        quantity: 30,
        instructions: 'Take after breakfast with water.',
      },
      {
        medicineId: 'med-002',
        medicineName: 'Paracetamol (Biogesic) 500mg',
        dosage: '500mg',
        frequency: '1 tab every 6 hrs as needed (PRN)',
        duration: '5 days',
        quantity: 10,
        instructions: 'Take for headache only.',
      },
    ],
    notes: 'Review blood pressure log at next consultation.',
  },
];

// 6. Initial Invoices & Cashier POS
let invoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-001',
    patientId: 'pat-001',
    patientName: 'U Kyaw Myint',
    patientPhone: '09450112233',
    date: todayIso,
    status: 'unpaid',
    items: [
      {
        description: 'Specialist Consultation (Cardiology)',
        category: 'consultation',
        quantity: 1,
        unitPrice: 20000,
        total: 20000,
      },
      {
        description: 'Pharmacy: Amlodipine 5mg (30 tabs) + Paracetamol (10 tabs)',
        category: 'pharmacy',
        quantity: 1,
        unitPrice: 39000,
        total: 39000,
      },
      {
        description: 'Routine 12-Lead Electrocardiogram (ECG)',
        category: 'lab',
        quantity: 1,
        unitPrice: 15000,
        total: 15000,
      },
    ],
    subtotal: 74000,
    discount: 4000,
    tax: 0,
    totalAmount: 70000,
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2026-002',
    patientId: 'pat-004',
    patientName: 'Daw Khin Khin',
    patientPhone: '0942001199',
    date: todayIso,
    status: 'paid',
    items: [
      {
        description: 'Specialist Consultation (Orthopedics)',
        category: 'consultation',
        quantity: 1,
        unitPrice: 20000,
        total: 20000,
      },
      {
        description: 'Bilateral Knee Joint Ultrasound Imaging',
        category: 'procedure',
        quantity: 1,
        unitPrice: 35000,
        total: 35000,
      },
    ],
    subtotal: 55000,
    discount: 5000,
    tax: 0,
    totalAmount: 50000,
    paymentMethod: 'kpay',
    paidAt: `${todayIso}T08:50:00Z`,
    receiptNumber: 'RCP-2026-001',
  },
];

// ============================================================================
// HELPER METHODS
// ============================================================================

// Appointments
export function getAppointmentsStore(): Appointment[] {
  return [...appointments];
}

export function createAppointmentStore(
  data: Omit<Appointment, 'id' | 'createdAt' | 'tokenNumber'> & { tokenNumber?: string }
): Appointment {
  const doctorPrefix = data.doctorName.includes('Jenkins')
    ? 'A'
    : data.doctorName.includes('Vance')
    ? 'B'
    : data.doctorName.includes('Rostova')
    ? 'C'
    : 'D';

  const currentDoctorCount = appointments.filter(
    (a) => a.doctorName === data.doctorName && a.appointmentDate === data.appointmentDate
  ).length;

  const generatedToken = `${doctorPrefix}-${String(currentDoctorCount + 1).padStart(2, '0')}`;

  const defaultRoom =
    doctorPrefix === 'A'
      ? 'Room 101'
      : doctorPrefix === 'B'
      ? 'Room 102'
      : doctorPrefix === 'C'
      ? 'Room 103'
      : 'Room 104';

  const newAppt: Appointment = {
    id: `appt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    tokenNumber: data.tokenNumber || generatedToken,
    patientName: data.patientName,
    patientEmail: data.patientEmail,
    patientPhone: data.patientPhone,
    doctorId: data.doctorId,
    doctorName: data.doctorName,
    roomNumber: data.roomNumber || defaultRoom,
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,
    notes: data.notes || '',
    status: data.status || 'pending',
    createdAt: new Date().toISOString(),
  };

  appointments.unshift(newAppt);
  return newAppt;
}

export function updateAppointmentStore(
  id: string,
  updates: Partial<Appointment>
): Appointment | null {
  const idx = appointments.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  appointments[idx] = { ...appointments[idx], ...updates };
  return appointments[idx];
}

export function deleteAppointmentStore(id: string): boolean {
  const initialLen = appointments.length;
  appointments = appointments.filter((a) => a.id !== id);
  return appointments.length < initialLen;
}

// Patients
export function getPatientsStore(search?: string): Patient[] {
  if (!search) return [...patients];
  const q = search.toLowerCase().trim();
  return patients.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.hn.toLowerCase().includes(q) ||
      p.phone.includes(q)
  );
}

export function getPatientByIdStore(id: string): Patient | null {
  return patients.find((p) => p.id === id || p.hn === id) || null;
}

export function createPatientStore(data: Omit<Patient, 'id' | 'hn' | 'createdAt'>): Patient {
  const count = patients.length + 1;
  const hn = `HN-2026-${String(count).padStart(3, '0')}`;
  const newPatient: Patient = {
    id: `pat-${Date.now()}`,
    hn,
    ...data,
    createdAt: new Date().toISOString(),
  };
  patients.unshift(newPatient);
  return newPatient;
}

// EMR Records
export function getEMRRecordsStore(patientId?: string): EMRRecord[] {
  if (patientId) {
    return emrRecords.filter((e) => e.patientId === patientId || e.patientHn === patientId);
  }
  return [...emrRecords];
}

export function createEMRRecordStore(data: Omit<EMRRecord, 'id' | 'createdAt'>): EMRRecord {
  const newEMR: EMRRecord = {
    id: `emr-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
  };
  emrRecords.unshift(newEMR);

  // If there are prescriptions attached, create an e-prescription automatically
  if (data.prescriptions && data.prescriptions.length > 0) {
    createPrescriptionStore({
      patientId: data.patientId,
      patientHn: data.patientHn,
      patientName: data.patientName,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      date: data.date,
      status: 'pending_dispense',
      items: data.prescriptions,
      notes: `Generated from EMR record on ${data.date}`,
    });
  }

  return newEMR;
}

// Pharmacy & Medicines
export function getMedicinesStore(category?: string): Medicine[] {
  if (!category || category === 'All') return [...medicines];
  return medicines.filter((m) => m.category.includes(category));
}

export function createMedicineStore(data: Omit<Medicine, 'id' | 'code'>): Medicine {
  const code = `MED-${100 + medicines.length + 1}`;
  const newMed: Medicine = {
    id: `med-${Date.now()}`,
    code,
    ...data,
  };
  medicines.push(newMed);
  return newMed;
}

export function updateMedicineStockStore(id: string, delta: number): Medicine | null {
  const med = medicines.find((m) => m.id === id || m.code === id);
  if (!med) return null;
  med.currentStock = Math.max(0, med.currentStock + delta);
  return med;
}

// Prescriptions
export function getPrescriptionsStore(): Prescription[] {
  return [...prescriptions];
}

export function createPrescriptionStore(
  data: Omit<Prescription, 'id' | 'prescriptionNumber'>
): Prescription {
  const num = `RX-2026-${String(prescriptions.length + 1).padStart(3, '0')}`;
  const newRx: Prescription = {
    id: `rx-${Date.now()}`,
    prescriptionNumber: num,
    ...data,
  };
  prescriptions.unshift(newRx);
  return newRx;
}

export function dispensePrescriptionStore(
  id: string,
  dispensedBy: string = 'Pharmacist Desk'
): { prescription: Prescription | null; stockUpdates: string[] } {
  const rx = prescriptions.find((p) => p.id === id || p.prescriptionNumber === id);
  if (!rx) return { prescription: null, stockUpdates: [] };

  if (rx.status === 'dispensed') {
    return { prescription: rx, stockUpdates: ['Already dispensed'] };
  }

  rx.status = 'dispensed';
  rx.dispensedAt = new Date().toISOString();
  rx.dispensedBy = dispensedBy;

  const stockUpdates: string[] = [];
  // Automatically deduct inventory stock
  for (const item of rx.items) {
    const med = medicines.find(
      (m) =>
        m.id === item.medicineId ||
        m.genericName.toLowerCase().includes(item.medicineName.toLowerCase()) ||
        item.medicineName.toLowerCase().includes(m.brandName.toLowerCase())
    );
    if (med) {
      const deduction = item.quantity || 1;
      med.currentStock = Math.max(0, med.currentStock - deduction);
      stockUpdates.push(`${med.brandName}: -${deduction} units (remaining: ${med.currentStock})`);
    }
  }

  return { prescription: rx, stockUpdates };
}

// Invoices & Billing
export function getInvoicesStore(): Invoice[] {
  return [...invoices];
}

export function createInvoiceStore(
  data: Omit<Invoice, 'id' | 'invoiceNumber'>
): Invoice {
  const invNum = `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`;
  const newInv: Invoice = {
    id: `inv-${Date.now()}`,
    invoiceNumber: invNum,
    ...data,
  };
  invoices.unshift(newInv);
  return newInv;
}

export function payInvoiceStore(
  id: string,
  paymentMethod: 'cash' | 'kpay' | 'wave' | 'card'
): Invoice | null {
  const inv = invoices.find((i) => i.id === id || i.invoiceNumber === id);
  if (!inv) return null;
  inv.status = 'paid';
  inv.paymentMethod = paymentMethod;
  inv.paidAt = new Date().toISOString();
  inv.receiptNumber = `RCP-2026-${String(invoices.filter((i) => i.status === 'paid').length).padStart(3, '0')}`;
  return inv;
}

// Live Queue Status
export function getLiveQueueStore(): LiveQueueItem[] {
  const rooms = [
    { room: 'Room 101', docName: 'Dr. Sarah Jenkins', spec: 'Cardiology' },
    { room: 'Room 102', docName: 'Dr. Marcus Vance', spec: 'Pediatrics' },
    { room: 'Room 103', docName: 'Dr. Elena Rostova', spec: 'Endocrinology' },
    { room: 'Room 104', docName: 'Dr. Alexander Patel', spec: 'Orthopedics' },
  ];

  return rooms.map((r) => {
    const docAppts = appointments.filter(
      (a) =>
        a.doctorName.toLowerCase().includes(r.docName.split(' ')[1].toLowerCase()) &&
        a.appointmentDate === todayIso
    );

    const consultingAppt = docAppts.find((a) => a.status === 'in_consultation');
    const waitingAppts = docAppts.filter((a) => a.status === 'confirmed' || a.status === 'pending');

    const maskName = (name: string) => {
      const parts = name.split(' ');
      if (parts.length <= 1) return name;
      return `${parts[0]} ${parts[1].slice(0, 1)}***`;
    };

    return {
      roomNumber: r.room,
      doctorName: r.docName,
      specialty: r.spec,
      currentToken: consultingAppt?.tokenNumber || (waitingAppts[0]?.tokenNumber ?? '---'),
      patientNameMasked: consultingAppt
        ? maskName(consultingAppt.patientName)
        : waitingAppts[0]
        ? maskName(waitingAppts[0].patientName)
        : 'Available',
      status: consultingAppt ? 'consulting' : waitingAppts.length > 0 ? 'ready' : 'idle',
      nextTokens: waitingAppts.slice(consultingAppt ? 0 : 1, 4).map((a) => a.tokenNumber || '---'),
    };
  });
}
