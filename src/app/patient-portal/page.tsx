'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Calendar,
  Clock,
  User,
  Phone,
  ShieldCheck,
  FileText,
  Printer,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Pill,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { Appointment, EMRRecord, Prescription } from '@/lib/types';

export default function PatientPortalPage() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [emr, setEmr] = useState<EMRRecord | null>(null);
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    setSearched(true);
    setAppointment(null);
    setEmr(null);
    setPrescription(null);

    try {
      // 1. Search appointments by phone or token or name
      const apptRes = await fetch(`/api/appointments?query=${encodeURIComponent(query.trim())}`);
      const apptData = await apptRes.json();

      if (apptData.appointments && apptData.appointments.length > 0) {
        const found = apptData.appointments[0];
        setAppointment(found);

        // 2. Fetch EMR records
        const emrRes = await fetch('/api/emr');
        const emrData = await emrRes.json();
        if (emrData.records) {
          const matchingEmr = emrData.records.find(
            (r: EMRRecord) =>
              r.patientName.toLowerCase() === found.patientName.toLowerCase() ||
              found.patientName.toLowerCase().includes(r.patientName.toLowerCase())
          );
          if (matchingEmr) {
            setEmr(matchingEmr);
          }
        }

        // 3. Fetch prescriptions
        const rxRes = await fetch('/api/prescriptions');
        const rxData = await rxRes.json();
        if (rxData.prescriptions) {
          const matchingRx = rxData.prescriptions.find(
            (p: Prescription) =>
              p.patientName.toLowerCase() === found.patientName.toLowerCase() ||
              found.patientName.toLowerCase().includes(p.patientName.toLowerCase())
          );
          if (matchingRx) {
            setPrescription(matchingRx);
          }
        }
      } else {
        setErrorMessage('No clinical appointment found for this phone number or token ID.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error fetching appointment information.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintPrescription = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>Patient Self-Service and Digital Records</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Patient Appointment and Rx Records
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Track your real-time waiting queue status, view consultation details, and access your digital medical prescription.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs max-w-2xl mx-auto no-print">
        <form onSubmit={handleSearch} className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Enter Phone Number or Token / Booking ID
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. 09450112233 or A-01 or U Kyaw Myint"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:bg-white transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-xs shrink-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Searching...' : 'Find Record'}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Demo quick test: try phone{' '}
            <button
              type="button"
              className="font-mono text-teal-700 font-semibold hover:underline cursor-pointer"
              onClick={() => setQuery('09450112233')}
            >
              09450112233
            </button>
            , or token{' '}
            <button
              type="button"
              className="font-mono text-teal-700 font-semibold hover:underline cursor-pointer"
              onClick={() => setQuery('A-01')}
            >
              A-01
            </button>
            , or name{' '}
            <button
              type="button"
              className="font-mono text-teal-700 font-semibold hover:underline cursor-pointer"
              onClick={() => setQuery('Kyaw')}
            >
              Kyaw
            </button>
            .
          </p>
        </form>
      </div>

      {/* Error Feedback */}
      {errorMessage && searched && (
        <div className="max-w-2xl mx-auto p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Search Results Display */}
      {appointment && (
        <div className="space-y-6 animate-fade-in">
          {/* Appointment Status Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-5 sm:p-7 bg-gradient-to-r from-teal-50/60 via-slate-50 to-transparent border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 mb-1.5">
                  Live Clinic Status
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {appointment.patientName}
                </h2>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-600 mt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>{appointment.patientPhone}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>{appointment.appointmentDate} at {appointment.appointmentTime}</span>
                  </span>
                </div>
              </div>

              {/* Big Token Badge */}
              <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-teal-200 text-center shadow-xs min-w-[130px]">
                <div className="text-[10px] uppercase font-bold text-slate-400">Queue Token</div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-teal-700">
                  {appointment.tokenNumber || 'A-01'}
                </div>
                <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                  {appointment.roomNumber || 'Room 101'}
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Attending Doctor</span>
                <p className="font-bold text-slate-900 text-sm sm:text-base">{appointment.doctorName}</p>
                <p className="text-xs text-slate-500">Cardiology / Internal Medicine</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Consultation Room</span>
                <p className="font-bold text-slate-900 text-sm sm:text-base">{appointment.roomNumber || 'Room 101'}</p>
                <p className="text-xs text-teal-600 font-medium">Please proceed when token is called</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Queue Stage</span>
                <div className="pt-1">
                  {appointment.status === 'in_consultation' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                      <Stethoscope className="w-3.5 h-3.5" /> In Consultation
                    </span>
                  ) : appointment.status === 'confirmed' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Waiting in Reception
                    </span>
                  ) : appointment.status === 'completed' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Visit Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                      Pending Verification
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="px-5 sm:px-7 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">
                Track live consultation progress on our real-time board:
              </span>
              <Link
                href="/queue"
                className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
              >
                <span>View Waiting Room TV Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Digital Prescription & Medical Summary */}
          {prescription && (
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs p-5 sm:p-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      Digital Doctor Prescription ({prescription.prescriptionNumber})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Prescribed by {prescription.doctorName} on {prescription.date}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePrintPrescription}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Prescription</span>
                </button>
              </div>

              {/* Medication Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-y border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Rx Medication</th>
                      <th className="py-2.5 px-3">Dosage & Strength</th>
                      <th className="py-2.5 px-3">Frequency</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3">Qty</th>
                      <th className="py-2.5 px-3">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {prescription.items.map((it, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {it.medicineName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{it.dosage}</td>
                        <td className="py-2.5 px-3 text-teal-700 font-medium">{it.frequency}</td>
                        <td className="py-2.5 px-3 text-slate-600">{it.duration}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{it.quantity}</td>
                        <td className="py-2.5 px-3 text-slate-600">{it.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200/80 text-teal-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold">Pharmacy Dispensing Status: </span>
                  {prescription.status === 'dispensed' ? (
                    <span className="text-emerald-700 font-semibold">Fulfilled at Clinic Dispensary</span>
                  ) : (
                    <span className="text-amber-800 font-semibold">Ready for Dispensing Counter</span>
                  )}
                </div>
                <span className="text-[11px] text-teal-700">Nan Da Wun Clinic Pharmacy Counter</span>
              </div>
            </div>
          )}

          {/* Clinical Encounter Summary (If exists) */}
          {emr && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 space-y-4 shadow-xs">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <FileText className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Clinical Visit Impression</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Blood Pressure</span>
                  <span className="font-bold text-slate-900">{emr.vitals.bloodPressure} mmHg</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Heart Rate</span>
                  <span className="font-bold text-slate-900">{emr.vitals.heartRate} bpm</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Temperature</span>
                  <span className="font-bold text-slate-900">{emr.vitals.temperature} °C</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Body Mass Index (BMI)</span>
                  <span className="font-bold text-teal-700">{emr.vitals.bmi}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p>
                  <strong className="text-slate-800">Primary Diagnosis:</strong>{' '}
                  <span className="text-slate-700">{emr.diagnosis}</span>
                </p>
                <p>
                  <strong className="text-slate-800">Doctor Advice and Instructions:</strong>{' '}
                  <span className="text-slate-600 leading-relaxed">{emr.clinicalNotes}</span>
                </p>
                {emr.followUpDate && (
                  <p className="text-teal-700 font-semibold pt-1">
                    Recommended Follow-up: {emr.followUpDate}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Booking CTA */}
      <div className="bg-teal-800 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs no-print">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold">Need to book a new appointment?</h3>
          <p className="text-teal-100 text-xs sm:text-sm">
            Reserve a consultation with our verified physician specialists in minutes.
          </p>
        </div>
        <Link
          href="/appointments"
          className="bg-white hover:bg-slate-50 text-teal-900 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition shrink-0 flex items-center gap-2 shadow-xs"
        >
          <span>Book New Visit</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
