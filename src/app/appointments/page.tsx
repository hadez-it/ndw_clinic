'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { initialDoctors, Doctor } from '@/lib/types';
import { Calendar, CheckCircle2, AlertCircle, Shield, Clock, User, Mail, Phone, FileText } from 'lucide-react';

function AppointmentFormContent() {
  const searchParams = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctor');

  const [doctors] = useState<Doctor[]>(initialDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState<string>(
    preselectedDoctorId || initialDoctors[0]?.id || ''
  );
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('09:00 AM');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Set min date to today
  const [todayStr, setTodayStr] = useState('');
  useEffect(() => {
    const d = new Date();
    const iso = d.toISOString().split('T')[0];
    setTodayStr(iso);
    setAppointmentDate(iso);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const docObj = doctors.find((d) => d.id === selectedDoctor);
    const doctorName = docObj ? docObj.name : 'Attending Physician';

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          patientEmail,
          patientPhone,
          doctorId: selectedDoctor,
          doctorName,
          appointmentDate,
          appointmentTime,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details ? data.details.join(', ') : data.error || 'Booking failed');
      }

      setSuccessMessage(`Appointment booked successfully with ${doctorName} on ${appointmentDate} at ${appointmentTime}. We sent a confirmation notice to ${patientEmail}.`);
      setNotes('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <Shield className="w-4 h-4 text-teal-600" />
          <span>Confidential & End-to-End Secure Booking</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Schedule Your Clinical Appointment
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Reserve your consultation with our specialist physicians. Verified slots with zero double-booking and instant database persistence.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10">
        {successMessage && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="font-bold">Appointment Confirmed!</p>
              <p className="text-xs text-emerald-800">{successMessage}</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-900">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="font-bold">Unable to Book</p>
              <p className="text-xs text-rose-700">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Doctor Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Physician / Specialist
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc.id)}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-center gap-3.5 ${
                    selectedDoctor === doc.id
                      ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                    <p className="text-xs text-teal-700 font-medium">{doc.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Patient Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            {/* Patient Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="patient@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            {/* Patient Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span>Phone Number</span>
              </label>
              <input
                type="tel"
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="+1 (555) 012-3456"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>Preferred Date</span>
              </label>
              <input
                type="date"
                required
                min={todayStr}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>Available Consultation Time Slot</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                '09:00 AM',
                '10:30 AM',
                '01:00 PM',
                '02:30 PM',
                '04:00 PM',
                '05:30 PM',
              ].map((time) => (
                <button
                  type="button"
                  key={time}
                  onClick={() => setAppointmentTime(time)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    appointmentTime === time
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Medical Notes / Symptoms */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              <span>Reason for Visit or Symptoms (Optional)</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Briefly state symptoms, existing conditions, or relevant questions for the physician..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-teal-600/20 text-sm transition"
            >
              {loading ? 'Securing Your Booking...' : 'Confirm Appointment'}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              🔒 Protected by Row Level Security. We do not share your medical information with third parties.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-20 text-center text-slate-500">Loading appointment portal...</div>}>
      <AppointmentFormContent />
    </Suspense>
  );
}
