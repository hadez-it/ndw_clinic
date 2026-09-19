'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Users,
  Calendar,
  BookOpen,
  LogOut,
  CheckCircle,
  Clock,
  Search,
  Plus,
  Filter,
  DollarSign,
  Pill,
  FileText,
  Printer,
  AlertTriangle,
  Stethoscope,
  Activity,
  Heart,
  Eye,
  RefreshCw,
  X,
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Building,
  Lock,
  LogIn,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import {
  Appointment,
  Patient,
  EMRRecord,
  Medicine,
  Prescription,
  Invoice,
  initialDoctors,
} from '@/lib/types';
import {
  setStoredSession,
  clearStoredSession,
  ROLE_CONFIG,
  DEMO_CREDENTIALS,
  useClinicAuth,
  createDemoUser,
} from '@/lib/auth';

export default function AdminDashboardPage() {
  const router = useRouter();
  const currentUser = useClinicAuth();
  const [previewMode, setPreviewMode] = useState(false);
  const authorized = !!currentUser || previewMode;
  const [activeTab, setActiveTab] = useState<
    'overview' | 'appointments' | 'patients' | 'pharmacy' | 'billing'
  >('overview');

  // Core Data States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [emrRecords, setEmrRecords] = useState<EMRRecord[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [billingMetrics, setBillingMetrics] = useState({
    totalRevenueMMK: 0,
    pendingRevenueMMK: 0,
    paidCount: 0,
    unpaidCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Filters
  const [apptStatusFilter, setApptStatusFilter] = useState<string>('all');
  const [patientSearch, setPatientSearch] = useState<string>('');
  const [pharmacyFilter, setPharmacyFilter] = useState<string>('All');

  // Selected Items for Modals
  const [selectedPatientForEMR, setSelectedPatientForEMR] = useState<Patient | null>(null);
  const [printPrescription, setPrintPrescription] = useState<Prescription | null>(null);
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);

  // Modal Visibility States
  const [showNewApptModal, setShowNewApptModal] = useState(false);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showNewEMRModal, setShowNewEMRModal] = useState(false);
  const [showNewMedicineModal, setShowNewMedicineModal] = useState(false);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);

  // Form States - New Appointment
  const [newApptPatientName, setNewApptPatientName] = useState('');
  const [newApptPhone, setNewApptPhone] = useState('');
  const [newApptDoctor, setNewApptDoctor] = useState(initialDoctors[0]?.name || '');
  const [newApptDoctorId, setNewApptDoctorId] = useState(initialDoctors[0]?.id || '');
  const [newApptDate, setNewApptDate] = useState(new Date().toISOString().split('T')[0]);
  const [newApptTime, setNewApptTime] = useState('10:00 AM');
  const [newApptNotes, setNewApptNotes] = useState('');

  // Form States - New Patient
  const [newPatName, setNewPatName] = useState('');
  const [newPatGender, setNewPatGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newPatAge, setNewPatAge] = useState('30');
  const [newPatPhone, setNewPatPhone] = useState('');
  const [newPatBlood, setNewPatBlood] = useState('O+');
  const [newPatAllergies, setNewPatAllergies] = useState('');
  const [newPatChronic, setNewPatChronic] = useState('');
  const [newPatEmergency, setNewPatEmergency] = useState('');

  // Form States - New EMR Record
  const [emrBp, setEmrBp] = useState('120/80');
  const [emrHr, setEmrHr] = useState('74');
  const [emrTemp, setEmrTemp] = useState('36.8');
  const [emrSpo2, setEmrSpo2] = useState('98');
  const [emrWeight, setEmrWeight] = useState('65');
  const [emrHeight, setEmrHeight] = useState('168');
  const [emrComplaint, setEmrComplaint] = useState('');
  const [emrDiagnosis, setEmrDiagnosis] = useState('');
  const [emrNotes, setEmrNotes] = useState('');
  const [emrDoctor, setEmrDoctor] = useState('Dr. Sarah Jenkins');
  const [emrRxMedName, setEmrRxMedName] = useState('Amoxicillin Trihydrate (Amoxil)');
  const [emrRxDosage, setEmrRxDosage] = useState('500mg');
  const [emrRxFreq, setEmrRxFreq] = useState('1 tab twice daily after meals (BID PC)');
  const [emrRxDuration, setEmrRxDuration] = useState('5 days');
  const [emrRxQty, setEmrRxQty] = useState(10);
  const [emrRxNotes, setEmrRxNotes] = useState('Complete full antibiotic course.');

  // Form States - New Medicine
  const [medGeneric, setMedGeneric] = useState('');
  const [medBrand, setMedBrand] = useState('');
  const [medCategory, setMedCategory] = useState('Antibiotics');
  const [medDosageForm, setMedDosageForm] = useState<'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment' | 'Drops' | 'Sachet'>('Tablet');
  const [medStrength, setMedStrength] = useState('500mg');
  const [medStock, setMedStock] = useState('100');
  const [medReorder, setMedReorder] = useState('30');
  const [medPrice, setMedPrice] = useState('1000');
  const [medCost, setMedCost] = useState('600');

  // Form States - New Invoice
  const [invPatientName, setInvPatientName] = useState('');
  const [invPhone, setInvPhone] = useState('');
  const [invConsultFee, setInvConsultFee] = useState('20000');
  const [invPharmacyFee, setInvPharmacyFee] = useState('15000');
  const [invLabFee, setInvLabFee] = useState('0');
  const [invDiscount, setInvDiscount] = useState('0');

  // Fetch all ERP data from endpoints
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [apptsRes, patsRes, emrRes, medRes, rxRes, billRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/patients'),
        fetch('/api/emr'),
        fetch('/api/pharmacy'),
        fetch('/api/prescriptions'),
        fetch('/api/billing'),
      ]);

      if (apptsRes.ok) {
        const d = await apptsRes.json();
        if (d.appointments) setAppointments(d.appointments);
      }
      if (patsRes.ok) {
        const d = await patsRes.json();
        if (d.patients) setPatients(d.patients);
      }
      if (emrRes.ok) {
        const d = await emrRes.json();
        if (d.records) setEmrRecords(d.records);
      }
      if (medRes.ok) {
        const d = await medRes.json();
        if (d.medicines) setMedicines(d.medicines);
      }
      if (rxRes.ok) {
        const d = await rxRes.json();
        if (d.prescriptions) setPrescriptions(d.prescriptions);
      }
      if (billRes.ok) {
        const d = await billRes.json();
        if (d.invoices) setInvoices(d.invoices);
        if (d.metrics) setBillingMetrics(d.metrics);
      }
    } catch (err) {
      console.error('Failed to load ERP datasets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (currentUser) {
      const config = ROLE_CONFIG[currentUser.role];
      if (config) {
        setActiveTab(config.defaultTab);
      }
    }
  }, [currentUser]);

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleLogout = () => {
    clearStoredSession();
    setPreviewMode(false);
    router.push('/login');
  };

  const handleDirectDemoLogin = (demo: (typeof DEMO_CREDENTIALS)[number]) => {
    const mockUser = createDemoUser(demo);
    setStoredSession(mockUser, `demo-token-${demo.role}`);
    const config = ROLE_CONFIG[demo.role];
    if (config) {
      setActiveTab(config.defaultTab);
    }
    showNotification(`Signed in as ${mockUser.name} (${config?.label || demo.role})`);
  };

  // Appointment Status Updates
  const updateAppointmentStatus = async (
    id: string,
    status: 'pending' | 'confirmed' | 'in_consultation' | 'completed' | 'cancelled'
  ) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        showNotification(`Appointment status changed to ${status}`);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Walk-in Appointment
  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: newApptPatientName,
          patientEmail: 'walkin@nandawun.local',
          patientPhone: newApptPhone,
          doctorId: newApptDoctorId,
          doctorName: newApptDoctor,
          appointmentDate: newApptDate,
          appointmentTime: newApptTime,
          notes: newApptNotes,
        }),
      });
      if (res.ok) {
        showNotification('Walk-in appointment booked & token generated!');
        setShowNewApptModal(false);
        setNewApptPatientName('');
        setNewApptPhone('');
        setNewApptNotes('');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Patient
  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPatName,
          gender: newPatGender,
          age: Number(newPatAge),
          phone: newPatPhone,
          bloodType: newPatBlood,
          allergies: newPatAllergies ? newPatAllergies.split(',').map((s) => s.trim()) : [],
          chronicConditions: newPatChronic ? newPatChronic.split(',').map((s) => s.trim()) : [],
          emergencyContact: newPatEmergency,
        }),
      });
      if (res.ok) {
        showNotification('New patient file registered successfully!');
        setShowNewPatientModal(false);
        setNewPatName('');
        setNewPatPhone('');
        setNewPatAllergies('');
        setNewPatChronic('');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create EMR Record & Prescription
  const handleCreateEMR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientForEMR) return;

    try {
      const res = await fetch('/api/emr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatientForEMR.id,
          patientHn: selectedPatientForEMR.hn,
          patientName: selectedPatientForEMR.name,
          doctorId: initialDoctors[0]?.id || 'doc-1',
          doctorName: emrDoctor,
          date: new Date().toISOString().split('T')[0],
          vitals: {
            bloodPressure: emrBp,
            heartRate: Number(emrHr),
            temperature: Number(emrTemp),
            spO2: Number(emrSpo2),
            weight: Number(emrWeight),
            height: Number(emrHeight),
          },
          chiefComplaint: emrComplaint,
          diagnosis: emrDiagnosis,
          clinicalNotes: emrNotes,
          prescriptions: [
            {
              medicineId: 'med-auto',
              medicineName: emrRxMedName,
              dosage: emrRxDosage,
              frequency: emrRxFreq,
              duration: emrRxDuration,
              quantity: Number(emrRxQty),
              instructions: emrRxNotes,
            },
          ],
        }),
      });

      if (res.ok) {
        showNotification('EMR consultation saved & e-prescription generated!');
        setShowNewEMRModal(false);
        setEmrComplaint('');
        setEmrDiagnosis('');
        setEmrNotes('');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Restock Medicine
  const handleStockUpdate = async (id: string, delta: number) => {
    try {
      const res = await fetch('/api/pharmacy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, delta }),
      });
      if (res.ok) {
        showNotification(`Stock adjusted (${delta > 0 ? '+' : ''}${delta} units)`);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create New Medicine
  const handleCreateMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/pharmacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genericName: medGeneric,
          brandName: medBrand,
          category: medCategory,
          dosageForm: medDosageForm,
          strength: medStrength,
          currentStock: Number(medStock),
          reorderLevel: Number(medReorder),
          unitPrice: Number(medPrice),
          costPrice: Number(medCost),
        }),
      });
      if (res.ok) {
        showNotification('New medication added to drug catalog!');
        setShowNewMedicineModal(false);
        setMedGeneric('');
        setMedBrand('');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Dispense Prescription
  const handleDispenseRx = async (id: string) => {
    try {
      const res = await fetch('/api/prescriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'dispense' }),
      });
      if (res.ok) {
        const d = await res.json();
        showNotification('Prescription dispensed & inventory stock deducted!');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Invoice
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const items = [
        {
          description: 'Physician Specialist Consultation',
          category: 'consultation',
          quantity: 1,
          unitPrice: Number(invConsultFee),
        },
      ];
      if (Number(invPharmacyFee) > 0) {
        items.push({
          description: 'Clinic Pharmacy & Prescriptions',
          category: 'pharmacy',
          quantity: 1,
          unitPrice: Number(invPharmacyFee),
        });
      }
      if (Number(invLabFee) > 0) {
        items.push({
          description: 'Diagnostic Tests & Clinical Procedures',
          category: 'lab',
          quantity: 1,
          unitPrice: Number(invLabFee),
        });
      }

      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: invPatientName,
          patientPhone: invPhone,
          items,
          discount: Number(invDiscount),
        }),
      });

      if (res.ok) {
        showNotification('Invoice generated for patient!');
        setShowNewInvoiceModal(false);
        setInvPatientName('');
        setInvPhone('');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Pay Invoice
  const handlePayInvoice = async (method: 'cash' | 'kpay' | 'wave' | 'card') => {
    if (!payingInvoice) return;
    try {
      const res = await fetch('/api/billing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: payingInvoice.id, paymentMethod: method }),
      });
      if (res.ok) {
        const d = await res.json();
        showNotification(`Payment of ${payingInvoice.totalAmount.toLocaleString()} MMK received via ${method.toUpperCase()}!`);
        setPayingInvoice(null);
        setPrintInvoice(d.invoice);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!authorized) {
    return (
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-16 min-w-0 overflow-x-hidden">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-4 sm:p-10 text-center space-y-5 sm:space-y-6 min-w-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-50 border border-teal-200 text-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-teal-600" />
          </div>

          <div className="space-y-2 px-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold max-w-full">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">Clinic Staff Authentication Required</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight break-words">
              Nan Da Wun Clinic ERP Command Center
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              This administrative portal controls patient electronic health records (EMR), live consultation queues, pharmacy inventory, and cashier accounts. Please authenticate with your staff account to continue.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
            <Link
              href="/login?redirect=/admin"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition shadow-sm active:scale-98"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Staff Portal</span>
            </Link>
            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl text-xs sm:text-sm transition cursor-pointer active:scale-98"
            >
              <span>Continue in Preview Mode</span>
            </button>
          </div>

          {/* 1-Click Evaluation Sign-in */}
          <div className="pt-5 sm:pt-6 border-t border-slate-100 text-left space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>1-Click Instant Demo Access:</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Tap any role to test</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {DEMO_CREDENTIALS.map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleDirectDemoLogin(demo)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 text-left transition group cursor-pointer active:scale-98 min-w-0"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-teal-800 truncate">
                      {demo.roleLabel.split('/')[0]}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium capitalize shrink-0">
                      {demo.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {demo.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link href="/" className="text-xs text-teal-600 hover:underline">
              ← Return to Clinic Public Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered appointments
  const filteredAppointments = appointments.filter((a) => {
    if (apptStatusFilter !== 'all' && a.status !== apptStatusFilter) return false;
    return true;
  });

  // Filtered medicines
  const filteredMedicines = medicines.filter((m) => {
    if (pharmacyFilter !== 'All' && !m.category.includes(pharmacyFilter)) return false;
    return true;
  });

  const lowStockMedicines = medicines.filter((m) => m.currentStock <= m.reorderLevel);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-10 space-y-4 sm:space-y-8 font-sans min-w-0 overflow-x-hidden">
      {/* Toast Feedback Notification */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-3 sm:right-6 left-3 sm:left-auto z-50 bg-slate-900 text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slide-down">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{feedbackMessage}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-slate-200 min-w-0">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-1.5 max-w-full">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="truncate">Nan Da Wun Healthcare ERP Command Center</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight break-words">
            Clinic Operations & Practice Management
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
            Complete management of patient appointments, waiting queues, EMR clinical notes, pharmacy stock, and cashier billing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 min-w-0">
          {currentUser && (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs min-w-0">
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left min-w-0">
                <div className="font-bold text-slate-900 leading-tight truncate max-w-[110px] sm:max-w-[140px]">
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-[10px] text-teal-700 font-semibold uppercase tracking-wider truncate">
                    {ROLE_CONFIG[currentUser.role]?.shortLabel || currentUser.role}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Link
            href="/patient-portal"
            target="_blank"
            className="inline-flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold transition shrink-0"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600 shrink-0" />
            <span>Patient Portal</span>
          </Link>

          <button
            onClick={fetchAllData}
            title="Refresh ERP Datasets"
            aria-label="Refresh ERP Datasets"
            className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-600' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-transparent text-slate-700 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none text-xs sm:text-sm font-semibold w-full min-w-0">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition shrink-0 cursor-pointer active:scale-95 ${
            activeTab === 'overview'
              ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Activity className="w-4 h-4 shrink-0" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition shrink-0 cursor-pointer active:scale-95 ${
            activeTab === 'appointments'
              ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span>Appointments</span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
            {appointments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('patients')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition shrink-0 cursor-pointer active:scale-95 ${
            activeTab === 'patients'
              ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Stethoscope className="w-4 h-4 shrink-0" />
          <span>Patients & EMR</span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
            {patients.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pharmacy')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition shrink-0 cursor-pointer active:scale-95 ${
            activeTab === 'pharmacy'
              ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Pill className="w-4 h-4 shrink-0" />
          <span>Pharmacy & Rx</span>
          {lowStockMedicines.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
              {lowStockMedicines.length} Low
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition shrink-0 cursor-pointer active:scale-95 ${
            activeTab === 'billing'
              ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4 shrink-0" />
          <span>Cashier & Accounts</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            {invoices.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & KPIS */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 sm:space-y-8 animate-fade-in min-w-0">
          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 min-w-0">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs hover-lift min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Today&apos;s Appointments
                </span>
                <Calendar className="w-5 h-5 text-teal-600 shrink-0" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 sm:mt-3 truncate">{appointments.length}</p>
              <p className="text-[11px] sm:text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Active in Consultation Desk
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs hover-lift min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Total Revenue (MMK)
                </span>
                <DollarSign className="w-5 h-5 text-emerald-600 shrink-0" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 sm:mt-3 truncate">
                {billingMetrics.totalRevenueMMK.toLocaleString()} <span className="text-sm font-semibold text-slate-500">Ks</span>
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1 truncate">
                Pending: {billingMetrics.pendingRevenueMMK.toLocaleString()} Ks
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs hover-lift min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Registered Patients
                </span>
                <Users className="w-5 h-5 text-teal-600 shrink-0" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 sm:mt-3 truncate">{patients.length}</p>
              <p className="text-[11px] sm:text-xs text-teal-700 font-medium mt-1">Master EMR Indexed</p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs hover-lift min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Pharmacy Stock Alert
                </span>
                <Pill className="w-5 h-5 text-amber-600 shrink-0" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 sm:mt-3 truncate">
                {lowStockMedicines.length}
              </p>
              <p className="text-[11px] sm:text-xs text-amber-700 font-medium mt-1 truncate">
                {lowStockMedicines.length > 0 ? 'Need Reorder Attention' : 'Healthy Inventory'}
              </p>
            </div>
          </div>

          {/* Quick Action Hub */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 min-w-0">
            <button
              onClick={() => setShowNewApptModal(true)}
              className="p-4 sm:p-5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 hover:bg-teal-100 transition text-left space-y-1.5 flex flex-col justify-between active:scale-98 cursor-pointer min-w-0"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm">Book Walk-In</span>
                <Plus className="w-4 h-4 text-teal-700 shrink-0" />
              </div>
              <p className="text-xs text-teal-700">Assign token and room immediately.</p>
            </button>

            <button
              onClick={() => setShowNewPatientModal(true)}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 hover:bg-slate-100 transition text-left space-y-1.5 flex flex-col justify-between active:scale-98 cursor-pointer min-w-0"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm">Register Patient</span>
                <Users className="w-4 h-4 text-slate-700 shrink-0" />
              </div>
              <p className="text-xs text-slate-500">Create new HN and medical file.</p>
            </button>

            <button
              onClick={() => setShowNewMedicineModal(true)}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 hover:bg-slate-100 transition text-left space-y-1.5 flex flex-col justify-between active:scale-98 cursor-pointer min-w-0"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm">Add Drug Catalog</span>
                <Pill className="w-4 h-4 text-slate-700 shrink-0" />
              </div>
              <p className="text-xs text-slate-500">Register new medicine or batch.</p>
            </button>

            <button
              onClick={() => setShowNewInvoiceModal(true)}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 hover:bg-slate-100 transition text-left space-y-1.5 flex flex-col justify-between active:scale-98 cursor-pointer min-w-0"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm">Cashier Invoice</span>
                <CreditCard className="w-4 h-4 text-slate-700 shrink-0" />
              </div>
              <p className="text-xs text-slate-500">Generate bill & collect fee.</p>
            </button>
          </div>

          {/* Consultation Rooms Status */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-xs min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Live Clinic Rooms & Doctors Status
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time occupancy across clinical consultation wings.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0">
              {initialDoctors.map((doc, idx) => {
                const roomName = `Room 10${idx + 1}`;
                const activeAppt = appointments.find(
                  (a) => a.doctorName.includes(doc.name) && a.status === 'in_consultation'
                );
                return (
                  <div
                    key={doc.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition min-w-0 ${
                      activeAppt
                        ? 'bg-teal-50/50 border-teal-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-teal-800 uppercase">{roomName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          activeAppt
                            ? 'bg-teal-100 text-teal-800 animate-pulse'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {activeAppt ? 'Consulting' : 'Ready'}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm truncate">{doc.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{doc.specialty}</div>

                    <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 text-xs">
                      {activeAppt ? (
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">
                            Serving Token
                          </span>
                          <p className="font-mono font-bold text-teal-700 truncate">
                            {activeAppt.tokenNumber} ({activeAppt.patientName})
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Waiting room idle</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: APPOINTMENT DESK & QUEUE MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'appointments' && (
        <div className="space-y-4 sm:space-y-6 animate-fade-in min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                Reception Appointment Desk & Queue
              </h2>
              <p className="text-xs text-slate-500">
                Monitor incoming patient slots, assign consultation tokens, and call patients.
              </p>
            </div>

            <button
              onClick={() => setShowNewApptModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-4 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition shrink-0 active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>New Walk-in Booking</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs w-full min-w-0">
            {['all', 'pending', 'confirmed', 'in_consultation', 'completed', 'cancelled'].map(
              (st) => {
                const count =
                  st === 'all'
                    ? appointments.length
                    : appointments.filter((a) => a.status === st).length;
                return (
                  <button
                    key={st}
                    onClick={() => setApptStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition capitalize flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 ${
                      apptStatusFilter === st
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{st.replace('_', ' ')}</span>
                    <span className="text-[10px] opacity-70">({count})</span>
                  </button>
                );
              }
            )}
          </div>

          {/* Appointments Table on Desktop, Cards on Mobile */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs min-w-0">
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Token #</th>
                    <th className="py-3.5 px-4">Patient Details</th>
                    <th className="py-3.5 px-4">Doctor & Room</th>
                    <th className="py-3.5 px-4">Time Slot</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Workflow Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        No appointments found matching current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-sm text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                            {appt.tokenNumber || '---'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm">{appt.patientName}</div>
                          <div className="text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>📞 {appt.patientPhone}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{appt.doctorName}</div>
                          <div className="text-[11px] text-teal-700 font-semibold">
                            {appt.roomNumber || 'Room 101'}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          <div>{appt.appointmentDate}</div>
                          <div className="font-medium text-slate-800">{appt.appointmentTime}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          {appt.status === 'in_consultation' && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 animate-pulse inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                              In Consult
                            </span>
                          )}
                          {appt.status === 'confirmed' && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 inline-flex items-center gap-1">
                              Waiting
                            </span>
                          )}
                          {appt.status === 'pending' && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                              Pending
                            </span>
                          )}
                          {appt.status === 'completed' && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                              Completed
                            </span>
                          )}
                          {appt.status === 'cancelled' && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500">
                              Cancelled
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {appt.status === 'pending' && (
                              <button
                                onClick={() => updateAppointmentStatus(appt.id, 'confirmed')}
                                className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[11px] font-semibold transition"
                              >
                                Confirm
                              </button>
                            )}
                            {appt.status === 'confirmed' && (
                              <button
                                onClick={() => updateAppointmentStatus(appt.id, 'in_consultation')}
                                className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-[11px] font-semibold transition"
                              >
                                Call Into Room
                              </button>
                            )}
                            {appt.status === 'in_consultation' && (
                              <button
                                onClick={() => updateAppointmentStatus(appt.id, 'completed')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition"
                              >
                                Finish Visit
                              </button>
                            )}
                            {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                              <button
                                onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                                className="px-2 py-1 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg text-[11px] transition"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="sm:hidden divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No appointments found matching current filter.
                </div>
              ) : (
                filteredAppointments.map((appt) => (
                  <div key={appt.id} className="p-4 space-y-3 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-mono font-bold text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 inline-block">
                          Token: {appt.tokenNumber || '---'}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm mt-1 truncate">{appt.patientName}</h3>
                        {appt.patientPhone && (
                          <a href={`tel:${appt.patientPhone}`} className="text-xs text-teal-700 font-medium flex items-center gap-1 mt-0.5">
                            <span>📞 {appt.patientPhone}</span>
                          </a>
                        )}
                      </div>

                      <div className="shrink-0">
                        {appt.status === 'in_consultation' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 animate-pulse inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                            In Consult
                          </span>
                        )}
                        {appt.status === 'confirmed' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                            Waiting
                          </span>
                        )}
                        {appt.status === 'pending' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Pending
                          </span>
                        )}
                        {appt.status === 'completed' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Completed
                          </span>
                        )}
                        {appt.status === 'cancelled' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-xl p-2.5 text-xs text-slate-600">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">Doctor & Room</span>
                        <span className="font-medium text-slate-800 truncate block">{appt.doctorName}</span>
                        <span className="text-[11px] text-teal-700 font-bold block">{appt.roomNumber || 'Room 101'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">Schedule</span>
                        <span className="text-slate-700 block truncate">{appt.appointmentDate}</span>
                        <span className="font-semibold text-slate-900 block">{appt.appointmentTime}</span>
                      </div>
                    </div>

                    {/* Mobile Workflow Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      {appt.status === 'pending' && (
                        <button
                          onClick={() => updateAppointmentStatus(appt.id, 'confirmed')}
                          className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs transition active:scale-98 text-center"
                        >
                          Confirm
                        </button>
                      )}
                      {appt.status === 'confirmed' && (
                        <button
                          onClick={() => updateAppointmentStatus(appt.id, 'in_consultation')}
                          className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white rounded-xl text-xs font-semibold shadow-xs transition active:scale-98 text-center"
                        >
                          Call Into Room
                        </button>
                      )}
                      {appt.status === 'in_consultation' && (
                        <button
                          onClick={() => updateAppointmentStatus(appt.id, 'completed')}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition active:scale-98 text-center"
                        >
                          Finish Visit
                        </button>
                      )}
                      {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                        <button
                          onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                          className="px-3 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-medium transition active:scale-98"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PATIENTS & EMR CONSULTATION */}
      {/* ========================================================================= */}
      {activeTab === 'patients' && (
        <div className="space-y-4 sm:space-y-6 animate-fade-in min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                Electronic Medical Records (EMR) & Patient Files
              </h2>
              <p className="text-xs text-slate-500">
                Search master patient database, view allergies, and record physician clinical encounters.
              </p>
            </div>

            <button
              onClick={() => setShowNewPatientModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-4 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition shrink-0 active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Register New Patient</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:max-w-md min-w-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              placeholder="Search by HN, patient name, or phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          {/* Patient Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 min-w-0">
            {patients
              .filter(
                (p) =>
                  !patientSearch ||
                  p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
                  p.hn.toLowerCase().includes(patientSearch.toLowerCase()) ||
                  p.phone.includes(patientSearch)
              )
              .map((pat) => (
                <div
                  key={pat.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-3.5 hover:border-teal-300 transition min-w-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 shrink-0">
                          {pat.hn}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {pat.gender}, {pat.age} yrs
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 truncate">{pat.name}</h3>
                      <a href={`tel:${pat.phone}`} className="text-xs text-slate-500 hover:text-teal-700 transition flex items-center gap-1 mt-0.5">
                        <span>📞 {pat.phone}</span>
                      </a>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPatientForEMR(pat);
                        setShowNewEMRModal(true);
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs transition shrink-0 active:scale-98"
                    >
                      <Stethoscope className="w-3.5 h-3.5 shrink-0" />
                      <span>New Consult Note</span>
                    </button>
                  </div>

                  {/* Medical Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs min-w-0">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                        Blood Group
                      </span>
                      <span className="font-bold text-rose-700">{pat.bloodType}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                        Known Drug Allergies
                      </span>
                      <span className="font-medium text-slate-800 break-words">
                        {pat.allergies.join(', ') || 'No known drug allergies'}
                      </span>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                        Chronic Conditions
                      </span>
                      <span className="text-slate-700 break-words">
                        {pat.chronicConditions.join(', ') || 'None recorded'}
                      </span>
                    </div>
                  </div>

                  {/* Past Visits / EMR History */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Clinical Visit History
                    </span>
                    {emrRecords.filter((e) => e.patientId === pat.id || e.patientHn === pat.hn)
                      .length === 0 ? (
                      <p className="text-xs text-slate-400">No previous clinical notes recorded.</p>
                    ) : (
                      <div className="space-y-2">
                        {emrRecords
                          .filter((e) => e.patientId === pat.id || e.patientHn === pat.hn)
                          .map((rec) => (
                            <div
                              key={rec.id}
                              className="p-3 bg-teal-50/40 rounded-xl border border-teal-100 text-xs space-y-1 min-w-0"
                            >
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-teal-900">{rec.date}</span>
                                <span className="text-slate-500 truncate ml-2">{rec.doctorName}</span>
                              </div>
                              <p className="font-semibold text-slate-900 truncate">{rec.diagnosis}</p>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600">
                                <span>BP: {rec.vitals.bloodPressure}</span>
                                <span>HR: {rec.vitals.heartRate} bpm</span>
                                <span>BMI: {rec.vitals.bmi}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PHARMACY & DIGITAL PRESCRIPTIONS */}
      {/* ========================================================================= */}
      {activeTab === 'pharmacy' && (
        <div className="space-y-6 sm:space-y-8 animate-fade-in min-w-0">
          {/* Section 1: Prescription Dispensing Counter */}
          <div className="space-y-3 sm:space-y-4 min-w-0">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Doctor Prescriptions & Dispensary Desk
              </h2>
              <p className="text-xs text-slate-500">
                Dispense electronic prescriptions to patients and auto-deduct pharmacy stock.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 min-w-0">
              {prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3.5 shadow-xs min-w-0"
                >
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="min-w-0">
                      <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block">
                        {rx.prescriptionNumber}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1 truncate">{rx.patientName}</h3>
                      <p className="text-xs text-slate-500 truncate">
                        Prescribed by {rx.doctorName} on {rx.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setPrintPrescription(rx)}
                        className="p-2 sm:p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                        title="Print Official Rx Slip"
                        aria-label="Print Rx Slip"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      {rx.status === 'dispensed' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          Dispensed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDispenseRx(rx.id)}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-98"
                        >
                          Dispense
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Medications in Rx */}
                  <div className="divide-y divide-slate-100 text-xs">
                    {rx.items.map((it, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between gap-2 min-w-0">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{it.medicineName}</p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {it.frequency} • {it.duration}
                          </p>
                        </div>
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                          Qty: {it.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Medicine Inventory Catalog */}
          <div className="space-y-4 pt-6 border-t border-slate-200 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  Pharmacy Drug Catalog & Inventory Stock
                </h3>
                <p className="text-xs text-slate-500">
                  Manage medicine prices, monitor stock quantities, and restock units.
                </p>
              </div>

              <button
                onClick={() => setShowNewMedicineModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white px-4 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition shrink-0 active:scale-98"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Add New Medicine</span>
              </button>
            </div>

            {/* Low Stock Banner */}
            {lowStockMedicines.length > 0 && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="leading-normal">
                    <strong>Warning:</strong> {lowStockMedicines.length} medicine(s) have reached reorder threshold (e.g. {lowStockMedicines[0]?.brandName}).
                  </span>
                </div>
                <button
                  onClick={() => handleStockUpdate(lowStockMedicines[0]?.id || '', 50)}
                  className="w-full sm:w-auto text-center px-3 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-xl font-bold text-xs shrink-0 transition"
                >
                  Quick Restock +50
                </button>
              </div>
            )}

            {/* Medicine Inventory Table on Desktop, Cards on Mobile */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs min-w-0">
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Brand / Generic Name</th>
                      <th className="py-3 px-4">Dosage / Form</th>
                      <th className="py-3 px-4">Stock Level</th>
                      <th className="py-3 px-4">Unit Price (MMK)</th>
                      <th className="py-3 px-4">Expiry Date</th>
                      <th className="py-3 px-4 text-right">Stock Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMedicines.map((med) => {
                      const isLow = med.currentStock <= med.reorderLevel;
                      return (
                        <tr key={med.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-4 font-mono font-bold text-slate-700">
                            {med.code}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 text-sm">{med.brandName}</div>
                            <div className="text-slate-500 text-[11px]">{med.genericName}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {med.strength} ({med.dosageForm})
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                                isLow
                                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                  : 'bg-emerald-50 text-emerald-800'
                              }`}
                            >
                              {med.currentStock} units
                            </span>
                            {isLow && (
                              <span className="block text-[10px] text-rose-600 font-semibold mt-0.5">
                                Reorder alert!
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            {med.unitPrice.toLocaleString()} Ks
                          </td>
                          <td className="py-3 px-4 text-slate-500">{med.expiryDate}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => handleStockUpdate(med.id, 10)}
                                className="px-2 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 rounded text-[11px] font-bold transition"
                              >
                                +10
                              </button>
                              <button
                                onClick={() => handleStockUpdate(med.id, 50)}
                                className="px-2 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 rounded text-[11px] font-bold transition"
                              >
                                +50
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Drug Cards */}
              <div className="sm:hidden divide-y divide-slate-100">
                {filteredMedicines.map((med) => {
                  const isLow = med.currentStock <= med.reorderLevel;
                  return (
                    <div key={med.id} className="p-4 space-y-2.5 min-w-0">
                      <div className="flex items-start justify-between gap-2 min-w-0">
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {med.code}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm mt-0.5 truncate">{med.brandName}</h4>
                          <p className="text-xs text-slate-500 truncate">{med.genericName} • {med.strength}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`font-mono font-bold text-xs px-2 py-0.5 rounded block ${
                              isLow
                                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-800'
                            }`}
                          >
                            {med.currentStock} units
                          </span>
                          <span className="font-mono font-bold text-xs text-slate-900 mt-1 block">
                            {med.unitPrice.toLocaleString()} Ks
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-xs">
                        <span className="text-[11px] text-slate-400">Exp: {med.expiryDate}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-500 mr-1">Restock:</span>
                          <button
                            onClick={() => handleStockUpdate(med.id, 10)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 active:bg-teal-100 text-slate-700 font-bold rounded-lg text-xs transition"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleStockUpdate(med.id, 50)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 active:bg-teal-100 text-slate-700 font-bold rounded-lg text-xs transition"
                          >
                            +50
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: BILLING, INVOICING & CASHIER POS */}
      {/* ========================================================================= */}
      {activeTab === 'billing' && (
        <div className="space-y-4 sm:space-y-6 animate-fade-in min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                Clinic Cashier Point of Sale (POS) & Invoicing
              </h2>
              <p className="text-xs text-slate-500">
                Generate itemized bills, process cash / mobile payments (KBZPay, Wave), and print receipts.
              </p>
            </div>

            <button
              onClick={() => setShowNewInvoiceModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-4 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition shrink-0 active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Create New Invoice / Bill</span>
            </button>
          </div>

          {/* Daily Cashier Financial Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 min-w-0">
            <div className="bg-emerald-50 border border-emerald-200 p-4 sm:p-5 rounded-2xl min-w-0">
              <span className="text-[11px] sm:text-xs font-bold uppercase text-emerald-800 tracking-wider block">
                Collected Revenue (Paid)
              </span>
              <p className="text-xl sm:text-2xl font-black text-emerald-950 mt-1 truncate">
                {billingMetrics.totalRevenueMMK.toLocaleString()} MMK
              </p>
              <p className="text-[11px] text-emerald-700 mt-1">
                {billingMetrics.paidCount} settled transactions
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 sm:p-5 rounded-2xl min-w-0">
              <span className="text-[11px] sm:text-xs font-bold uppercase text-amber-800 tracking-wider block">
                Outstanding (Pending Collection)
              </span>
              <p className="text-xl sm:text-2xl font-black text-amber-950 mt-1 truncate">
                {billingMetrics.pendingRevenueMMK.toLocaleString()} MMK
              </p>
              <p className="text-[11px] text-amber-700 mt-1">
                {billingMetrics.unpaidCount} unpaid patient bills
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl min-w-0">
              <span className="text-[11px] sm:text-xs font-bold uppercase text-slate-700 tracking-wider block">
                Supported Pay Methods
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1.5 flex items-center gap-1.5 flex-wrap">
                <span>Cash</span> • <span className="text-blue-600">KBZPay</span> •{' '}
                <span className="text-amber-600">WavePay</span> • <span>Cards</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Cash drawer reconciled</p>
            </div>
          </div>

          {/* Invoices Table on Desktop, Cards on Mobile */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs min-w-0">
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Invoice #</th>
                    <th className="py-3.5 px-4">Patient Name</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Bill Items Breakdown</th>
                    <th className="py-3.5 px-4">Total (MMK)</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Cashier Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {inv.invoiceNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{inv.patientName}</div>
                        {inv.patientPhone && (
                          <div className="text-[11px] text-slate-500">📞 {inv.patientPhone}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">{inv.date}</td>

                      <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                        {inv.items.map((it, idx) => (
                          <div key={idx} className="truncate">
                            • {it.description} ({it.total.toLocaleString()} Ks)
                          </div>
                        ))}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-sm text-slate-900">
                        {inv.totalAmount.toLocaleString()} Ks
                      </td>

                      <td className="py-3.5 px-4">
                        {inv.status === 'paid' ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            Paid ({inv.paymentMethod?.toUpperCase()})
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            Unpaid
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setPrintInvoice(inv)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs cursor-pointer"
                            title="Print Patient Receipt"
                            aria-label="Print Patient Receipt"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {inv.status === 'unpaid' ? (
                            <button
                              onClick={() => setPayingInvoice(inv)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                            >
                              Collect Payment
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-semibold">
                              Receipt #{inv.receiptNumber}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Invoices Cards */}
            <div className="sm:hidden divide-y divide-slate-100">
              {invoices.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No billing invoices recorded yet.
                </div>
              ) : (
                invoices.map((inv) => (
                  <div key={inv.id} className="p-4 space-y-3 min-w-0">
                    <div className="flex items-start justify-between gap-2 min-w-0">
                      <div className="min-w-0">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md inline-block">
                          {inv.invoiceNumber}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm mt-1 truncate">{inv.patientName}</h3>
                        {inv.patientPhone && (
                          <a href={`tel:${inv.patientPhone}`} className="text-xs text-teal-700 font-medium flex items-center gap-1 mt-0.5">
                            <span>📞 {inv.patientPhone}</span>
                          </a>
                        )}
                      </div>

                      <div className="shrink-0">
                        {inv.status === 'paid' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0 inline-block">
                            Paid ({inv.paymentMethod?.toUpperCase() || 'CASH'})
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 shrink-0 inline-block">
                            Unpaid
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-600 space-y-1">
                      <div className="text-[10px] uppercase font-semibold text-slate-400 mb-0.5">Itemized Breakdown:</div>
                      {inv.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] gap-2">
                          <span className="truncate">• {it.description}</span>
                          <span className="font-mono font-medium shrink-0">{it.total.toLocaleString()} Ks</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Amount</span>
                        <span className="font-mono font-black text-base text-slate-900">
                          {inv.totalAmount.toLocaleString()} Ks
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPrintInvoice(inv)}
                          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 transition cursor-pointer"
                          title="Print Patient Receipt"
                          aria-label="Print Patient Receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {inv.status === 'unpaid' ? (
                          <button
                            onClick={() => setPayingInvoice(inv)}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-98 cursor-pointer"
                          >
                            Collect Payment
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-semibold px-2 py-1 bg-emerald-50 rounded-lg">
                            #{inv.receiptNumber || 'REC'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: NEW WALK-IN APPOINTMENT */}
      {/* ========================================================================= */}
      {showNewApptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-8 space-y-4 sm:space-y-5 shadow-2xl animate-fade-in my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Book Walk-in / Phone Visit</h3>
              <button
                onClick={() => setShowNewApptModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={newApptPatientName}
                  onChange={(e) => setNewApptPatientName(e.target.value)}
                  placeholder="e.g. U Kyaw Myint"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 text-base sm:text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newApptPhone}
                    onChange={(e) => setNewApptPhone(e.target.value)}
                    placeholder="09..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 text-base sm:text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Select Doctor</label>
                  <select
                    value={newApptDoctor}
                    onChange={(e) => {
                      const doc = initialDoctors.find((d) => d.name === e.target.value);
                      setNewApptDoctor(e.target.value);
                      if (doc) setNewApptDoctorId(doc.id);
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 text-base sm:text-xs"
                  >
                    {initialDoctors.map((doc) => (
                      <option key={doc.id} value={doc.name}>
                        {doc.name} ({doc.specialty})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={newApptDate}
                    onChange={(e) => setNewApptDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 text-base sm:text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Time Slot</label>
                  <select
                    value={newApptTime}
                    onChange={(e) => setNewApptTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 text-base sm:text-xs"
                  >
                    <option>09:00 AM</option>
                    <option>09:30 AM</option>
                    <option>10:00 AM</option>
                    <option>10:30 AM</option>
                    <option>11:00 AM</option>
                    <option>02:00 PM</option>
                    <option>03:00 PM</option>
                    <option>04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notes / Chief Complaint</label>
                <textarea
                  rows={2}
                  value={newApptNotes}
                  onChange={(e) => setNewApptNotes(e.target.value)}
                  placeholder="Patient symptoms or notes..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 text-base sm:text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer min-h-[44px]"
              >
                Confirm & Issue Queue Token
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: REGISTER NEW PATIENT */}
      {/* ========================================================================= */}
      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-8 space-y-4 sm:space-y-5 shadow-2xl animate-fade-in my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Register Master Patient Record</h3>
              <button
                onClick={() => setShowNewPatientModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newPatName}
                  onChange={(e) => setNewPatName(e.target.value)}
                  placeholder="e.g. Daw Mya Sandar"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 text-base sm:text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={newPatGender}
                    onChange={(e) => setNewPatGender(e.target.value as 'Male' | 'Female')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 text-base sm:text-xs"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={newPatAge}
                    onChange={(e) => setNewPatAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 text-base sm:text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Blood Type</label>
                  <select
                    value={newPatBlood}
                    onChange={(e) => setNewPatBlood(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 text-base sm:text-xs"
                  >
                    <option>O+</option>
                    <option>A+</option>
                    <option>B+</option>
                    <option>AB+</option>
                    <option>O-</option>
                    <option>Unknown</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newPatPhone}
                    onChange={(e) => setNewPatPhone(e.target.value)}
                    placeholder="09..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 text-base sm:text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    value={newPatEmergency}
                    onChange={(e) => setNewPatEmergency(e.target.value)}
                    placeholder="Relation & Phone"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 text-base sm:text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Drug Allergies (Comma separated)
                </label>
                <input
                  type="text"
                  value={newPatAllergies}
                  onChange={(e) => setNewPatAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Aspirin"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 text-base sm:text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Chronic Illnesses / Conditions
                </label>
                <input
                  type="text"
                  value={newPatChronic}
                  onChange={(e) => setNewPatChronic(e.target.value)}
                  placeholder="e.g. Hypertension, Type 2 Diabetes"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 text-base sm:text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer min-h-[44px]"
              >
                Register & Generate HN Number
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: RECORD CLINICAL CONSULTATION ENCOUNTER (EMR) */}
      {/* ========================================================================= */}
      {showNewEMRModal && selectedPatientForEMR && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90dvh] overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-5 shadow-2xl my-auto animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Doctor Consultation Note & E-Prescription
                </h3>
                <p className="text-xs text-slate-500">
                  Patient: <strong className="text-teal-800">{selectedPatientForEMR.name}</strong> ({selectedPatientForEMR.hn})
                </p>
              </div>
              <button
                onClick={() => setShowNewEMRModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEMR} className="space-y-4 text-xs">
              {/* Vitals Grid */}
              <div className="p-3.5 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Patient Vitals (ဇီဝကမ္မအချက်အလက်များ)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5">
                  <div>
                    <label className="text-slate-500 block mb-0.5 text-[10px] sm:text-xs">BP (mmHg)</label>
                    <input
                      type="text"
                      value={emrBp}
                      onChange={(e) => setEmrBp(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-center text-sm sm:text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-0.5 text-[10px] sm:text-xs">Heart Rate</label>
                    <input
                      type="number"
                      value={emrHr}
                      onChange={(e) => setEmrHr(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-center text-sm sm:text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-0.5 text-[10px] sm:text-xs">Temp (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={emrTemp}
                      onChange={(e) => setEmrTemp(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-center text-sm sm:text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-0.5 text-[10px] sm:text-xs">SpO2 (%)</label>
                    <input
                      type="number"
                      value={emrSpo2}
                      onChange={(e) => setEmrSpo2(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-center text-sm sm:text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-0.5 text-[10px] sm:text-xs">Weight (kg)</label>
                    <input
                      type="number"
                      value={emrWeight}
                      onChange={(e) => setEmrWeight(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-center text-sm sm:text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-0.5 text-[10px] sm:text-xs">Height (cm)</label>
                    <input
                      type="number"
                      value={emrHeight}
                      onChange={(e) => setEmrHeight(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-center text-sm sm:text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Attending Physician</label>
                  <select
                    value={emrDoctor}
                    onChange={(e) => setEmrDoctor(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs"
                  >
                    {initialDoctors.map((doc) => (
                      <option key={doc.id} value={doc.name}>
                        {doc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Clinical Diagnosis</label>
                  <input
                    type="text"
                    required
                    value={emrDiagnosis}
                    onChange={(e) => setEmrDiagnosis(e.target.value)}
                    placeholder="e.g. Essential Hypertension Grade 1"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-base sm:text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Chief Complaint & Symptoms</label>
                <input
                  type="text"
                  value={emrComplaint}
                  onChange={(e) => setEmrComplaint(e.target.value)}
                  placeholder="Patient stated: Occasional headache, dizziness on exertion..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Physician Clinical Notes & Lifestyle Advice</label>
                <textarea
                  rows={2}
                  value={emrNotes}
                  onChange={(e) => setEmrNotes(e.target.value)}
                  placeholder="Examination findings, dietary modifications, follow-up guidelines..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs"
                />
              </div>

              {/* Prescription Builder */}
              <div className="p-3.5 sm:p-4 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-3">
                <span className="font-bold text-teal-900 uppercase tracking-wider text-[11px] block">
                  Prescribe Medication (ဆေးညွှန်းစာ ထုတ်ပေးခြင်း)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-slate-600 block mb-0.5">Medicine Name</label>
                    <select
                      value={emrRxMedName}
                      onChange={(e) => setEmrRxMedName(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-base sm:text-xs"
                    >
                      {medicines.map((m) => (
                        <option key={m.id} value={`${m.genericName} (${m.brandName})`}>
                          {m.brandName} - {m.strength}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-0.5">Frequency & Timing</label>
                    <select
                      value={emrRxFreq}
                      onChange={(e) => setEmrRxFreq(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-base sm:text-xs"
                    >
                      <option>1 tab once daily in morning (OD Mane)</option>
                      <option>1 tab twice daily after meals (BID PC)</option>
                      <option>1 tab 3 times daily after meals (TID PC)</option>
                      <option>1 tab at bedtime (ON Noct)</option>
                      <option>1 tab as needed for pain (PRN)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-slate-600 block mb-0.5">Dosage</label>
                    <input
                      type="text"
                      value={emrRxDosage}
                      onChange={(e) => setEmrRxDosage(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-base sm:text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-0.5">Duration</label>
                    <input
                      type="text"
                      value={emrRxDuration}
                      onChange={(e) => setEmrRxDuration(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-base sm:text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-0.5">Quantity (Units)</label>
                    <input
                      type="number"
                      value={emrRxQty}
                      onChange={(e) => setEmrRxQty(Number(e.target.value))}
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-base sm:text-xs"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer min-h-[44px]"
              >
                Save EMR & Forward to Pharmacy Counter
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD NEW MEDICINE */}
      {/* ========================================================================= */}
      {showNewMedicineModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-8 space-y-4 sm:space-y-5 shadow-2xl animate-fade-in my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Add Medicine to Catalog</h3>
              <button
                onClick={() => setShowNewMedicineModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMedicine} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Generic Name</label>
                  <input
                    type="text"
                    required
                    value={medGeneric}
                    onChange={(e) => setMedGeneric(e.target.value)}
                    placeholder="e.g. Paracetamol"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={medBrand}
                    onChange={(e) => setMedBrand(e.target.value)}
                    placeholder="e.g. Biogesic"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <input
                    type="text"
                    value={medCategory}
                    onChange={(e) => setMedCategory(e.target.value)}
                    placeholder="e.g. Analgesic"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Form</label>
                  <select
                    value={medDosageForm}
                    onChange={(e) => setMedDosageForm(e.target.value as 'Tablet' | 'Capsule' | 'Syrup')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs"
                  >
                    <option>Tablet</option>
                    <option>Capsule</option>
                    <option>Syrup</option>
                    <option>Injection</option>
                    <option>Ointment</option>
                    <option>Sachet</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Strength</label>
                  <input
                    type="text"
                    value={medStrength}
                    onChange={(e) => setMedStrength(e.target.value)}
                    placeholder="500mg"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={medStock}
                    onChange={(e) => setMedStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Reorder Alert Level</label>
                  <input
                    type="number"
                    value={medReorder}
                    onChange={(e) => setMedReorder(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Selling Price (MMK)</label>
                  <input
                    type="number"
                    required
                    value={medPrice}
                    onChange={(e) => setMedPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-base sm:text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Cost Price (MMK)</label>
                  <input
                    type="number"
                    value={medCost}
                    onChange={(e) => setMedCost(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition cursor-pointer min-h-[44px]"
              >
                Add Medicine to Inventory
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: NEW CASHIER INVOICE */}
      {/* ========================================================================= */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-8 space-y-4 sm:space-y-5 shadow-2xl animate-fade-in my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Generate Cashier Invoice</h3>
              <button
                onClick={() => setShowNewInvoiceModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={invPatientName}
                  onChange={(e) => setInvPatientName(e.target.value)}
                  placeholder="e.g. U Kyaw Myint"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-base sm:text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={invPhone}
                  onChange={(e) => setInvPhone(e.target.value)}
                  placeholder="09..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Consultation Fee (MMK)</label>
                  <input
                    type="number"
                    value={invConsultFee}
                    onChange={(e) => setInvConsultFee(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pharmacy Medication (MMK)</label>
                  <input
                    type="number"
                    value={invPharmacyFee}
                    onChange={(e) => setInvPharmacyFee(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lab / Procedure Fee (MMK)</label>
                  <input
                    type="number"
                    value={invLabFee}
                    onChange={(e) => setInvLabFee(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Discount Amount (MMK)</label>
                  <input
                    type="number"
                    value={invDiscount}
                    onChange={(e) => setInvDiscount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between font-bold">
                <span className="text-teal-900 text-xs sm:text-sm">Total Net Amount:</span>
                <span className="text-teal-950 font-mono text-base sm:text-lg">
                  {(
                    Number(invConsultFee || 0) +
                    Number(invPharmacyFee || 0) +
                    Number(invLabFee || 0) -
                    Number(invDiscount || 0)
                  ).toLocaleString()}{' '}
                  MMK
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer min-h-[44px]"
              >
                Create Invoice
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: COLLECT PAYMENT */}
      {/* ========================================================================= */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-8 space-y-4 sm:space-y-5 shadow-2xl animate-fade-in my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">Process Patient Payment</h3>
                <p className="text-xs text-slate-500">
                  {payingInvoice.invoiceNumber} • {payingInvoice.patientName}
                </p>
              </div>
              <button
                onClick={() => setPayingInvoice(null)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-xs font-semibold uppercase text-emerald-800 tracking-wider">
                Amount Due
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-950 mt-1">
                {payingInvoice.totalAmount.toLocaleString()} MMK
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Payment Mode (ငွေပေးချေမှုပုံစံ)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <button
                  onClick={() => handlePayInvoice('cash')}
                  className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50 text-left transition space-y-1 cursor-pointer min-h-[64px]"
                >
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">Cash Desk</div>
                  <div className="text-[10px] text-slate-500">Instant Cash Drawer</div>
                </button>

                <button
                  onClick={() => handlePayInvoice('kpay')}
                  className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-left transition space-y-1 cursor-pointer min-h-[64px]"
                >
                  <QrCode className="w-5 h-5 text-blue-600" />
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">KBZPay (KPay)</div>
                  <div className="text-[10px] text-slate-500">Scan QR Code</div>
                </button>

                <button
                  onClick={() => handlePayInvoice('wave')}
                  className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50 text-left transition space-y-1 cursor-pointer min-h-[64px]"
                >
                  <Activity className="w-5 h-5 text-amber-600" />
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">WavePay / AYA</div>
                  <div className="text-[10px] text-slate-500">Mobile Wallet</div>
                </button>

                <button
                  onClick={() => handlePayInvoice('card')}
                  className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-left transition space-y-1 cursor-pointer min-h-[64px]"
                >
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">Debit / Credit Card</div>
                  <div className="text-[10px] text-slate-500">MPU / Visa / Master</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: PRINT PRESCRIPTION SLIP */}
      {/* ========================================================================= */}
      {printPrescription && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl animate-fade-in border border-slate-200 my-auto">
            {/* Prescription Header */}
            <div className="flex items-center justify-between border-b-2 border-teal-600 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  NAN DA WUN HEALTHCARE
                </h3>
                <p className="text-[10px] font-semibold uppercase text-teal-700 tracking-widest">
                  Specialty Clinic & Primary Care Center
                </p>
                <p className="text-[10px] text-slate-500">742 Evergreen Medical Way, Yangon • Tel: (800) 555-0199</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-serif font-black text-teal-700">℞</div>
                <span className="font-mono text-xs font-bold text-slate-700">
                  {printPrescription.prescriptionNumber}
                </span>
              </div>
            </div>

            {/* Patient Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Patient Name</span>
                <span className="font-bold text-slate-900 text-sm sm:text-xs">{printPrescription.patientName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Date & Doctor</span>
                <span className="font-medium text-slate-800">
                  {printPrescription.date} • {printPrescription.doctorName}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-slate-200 text-xs">
              {printPrescription.items.map((it, idx) => (
                <div key={idx} className="py-2.5 space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
                    <span>{idx + 1}. {it.medicineName} ({it.dosage})</span>
                    <span className="font-mono text-teal-800 shrink-0 ml-2">Qty: {it.quantity}</span>
                  </div>
                  <div className="text-teal-700 font-semibold">{it.frequency}</div>
                  <div className="text-slate-500 text-[11px]">{it.instructions}</div>
                </div>
              ))}
            </div>

            {/* Doctor Signature */}
            <div className="pt-5 border-t border-slate-200 flex items-end justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Clinic Stamp</span>
                <div className="w-20 sm:w-24 h-10 sm:h-12 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                  SEAL
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="font-serif italic text-base text-slate-700 border-b border-slate-300 pb-1 w-32 sm:w-40 text-right">
                  {printPrescription.doctorName}
                </div>
                <span className="text-[10px] text-slate-400 uppercase block">Licensed Physician Signature</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setPrintPrescription(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold text-center cursor-pointer min-h-[44px]"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer min-h-[44px]"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 8: PRINT RECEIPT */}
      {/* ========================================================================= */}
      {printInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-8 space-y-4 sm:space-y-5 shadow-2xl animate-fade-in border border-slate-200 my-auto">
            {/* Header */}
            <div className="text-center border-b border-slate-200 pb-4 space-y-1">
              <h3 className="font-black text-slate-900 text-lg tracking-tight">NAN DA WUN CLINIC</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                OFFICIAL PATIENT PAYMENT RECEIPT
              </p>
              <p className="text-xs font-mono font-bold text-teal-700 mt-1">
                {printInvoice.receiptNumber || printInvoice.invoiceNumber}
              </p>
            </div>

            {/* Patient & Date */}
            <div className="text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-900">{printInvoice.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="text-slate-700">{printInvoice.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-bold text-emerald-700 uppercase">
                  {printInvoice.paymentMethod || 'Cash'}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-slate-100 text-xs border-y border-slate-200 py-2">
              {printInvoice.items.map((it, idx) => (
                <div key={idx} className="py-1.5 flex justify-between gap-2">
                  <span className="text-slate-700 truncate">{it.description}</span>
                  <span className="font-mono font-bold text-slate-900 shrink-0">
                    {it.total.toLocaleString()} Ks
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-base text-slate-900 pt-1">
                <span>Total Paid:</span>
                <span className="font-mono text-teal-800">
                  {printInvoice.totalAmount.toLocaleString()} MMK
                </span>
              </div>
              {printInvoice.discount > 0 && (
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Discount Applied:</span>
                  <span>-{printInvoice.discount.toLocaleString()} Ks</span>
                </div>
              )}
            </div>

            <div className="text-center text-[10px] text-slate-400 pt-3 border-t border-slate-100 leading-relaxed">
              Thank you for trusting Nan Da Wun Healthcare. Wishing you swift recovery!
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setPrintInvoice(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold text-center cursor-pointer min-h-[44px]"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer min-h-[44px]"
              >
                <Printer className="w-4 h-4" />
                <span>Print Thermal Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
