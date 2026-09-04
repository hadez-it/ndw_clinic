'use client';

import { useMemo, useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { initialDoctors } from '@/lib/types';
import {
  Calendar, CheckCircle2, AlertCircle, Clock, User, Mail, Phone,
  ChevronLeft, ChevronRight, Stethoscope, Search, Check, PartyPopper,
  MapPin, ShieldCheck, Sparkles, X, Loader2, CalendarDays,
} from 'lucide-react';

const TIME_SLOTS = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];
const STEPS = [
  { n: 1, label: 'Doctor', icon: Stethoscope },
  { n: 2, label: 'Date & Time', icon: Calendar },
  { n: 3, label: 'Details', icon: User },
];

function dayName(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' });
}

function fmtDate(iso: string) {
  if (!iso) return '';
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function fmtShortDays(daysArr: string[]) {
  const shortMap: Record<string, string> = {
    Monday: 'Mon',
    Tuesday: 'Tue',
    Wednesday: 'Wed',
    Thursday: 'Thu',
    Friday: 'Fri',
    Saturday: 'Sat',
    Sunday: 'Sun',
  };
  return daysArr.map((d) => shortMap[d] || d.slice(0, 3)).join(', ');
}

function BookingWizard() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get('doctor');

  const [step, setStep] = useState(preselected ? 2 : 1);
  const [doctorId, setDoctorId] = useState(preselected || initialDoctors[0]?.id || '');
  const [query, setQuery] = useState('');
  const activeDateRef = useRef<HTMLButtonElement | null>(null);

  // Scroll to top when moving between wizard steps on mobile
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const doctor = useMemo(() => initialDoctors.find((d) => d.id === doctorId), [doctorId]);

  const days = useMemo(() => {
    const out: { iso: string; dow: string; num: string; month: string; full: string }[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      out.push({
        iso,
        dow: d.toLocaleDateString('en-US', { weekday: 'short' }),
        num: String(d.getDate()),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        full: d.toLocaleDateString('en-US', { weekday: 'long' }),
      });
    }
    return out;
  }, []);

  // Initialize date to first available day for the doctor
  const [date, setDate] = useState(() => {
    const today = new Date();
    const doc = initialDoctors.find((d) => d.id === (preselected || initialDoctors[0]?.id));
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dow = d.toLocaleDateString('en-US', { weekday: 'long' });
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!doc || doc.availableDays.includes(dow)) {
        return iso;
      }
    }
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  // Auto-center active date in horizontal carousel
  useEffect(() => {
    if (step === 2 && activeDateRef.current) {
      activeDateRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [step, date]);

  const [time, setTime] = useState('09:00 AM');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialDoctors;
    return initialDoctors.filter((d) =>
      `${d.name} ${d.specialty} ${d.qualification}`.toLowerCase().includes(q)
    );
  }, [query]);

  const isDayAvailable = (iso: string) => {
    if (!doctor) return true;
    return doctor.availableDays.includes(dayName(iso));
  };

  const handleSelectDoctor = (id: string) => {
    setDoctorId(id);
    const selectedDoc = initialDoctors.find((d) => d.id === id);
    if (selectedDoc) {
      if (!selectedDoc.availableDays.includes(dayName(date))) {
        const nextDay = days.find((d) => selectedDoc.availableDays.includes(dayName(d.iso)));
        if (nextDay) setDate(nextDay.iso);
      }
    }
    // Instantly advance to Date & Time step
    setStep(2);
  };

  const canNext1 = !!doctorId;
  const canNext2 = !!date && !!time && isDayAvailable(date);
  const canSubmit = name.trim().length >= 2 && /.+@.+\..+/.test(email) && phone.trim().length >= 7;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !doctor) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: name, patientEmail: email, patientPhone: phone,
          doctorId, doctorName: doctor.name,
          appointmentDate: date, appointmentTime: time, notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details ? data.details.join(', ') : data.error || 'Booking failed');
      setSuccess(`You're booked with ${doctor.name} on ${fmtDate(date)} at ${time}. Confirmation sent to ${email}.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  if (success && doctor) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 sm:py-14 text-center animate-fade-in">
        <div className="bg-white rounded-2xl sm:rounded-[28px] border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <PartyPopper className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mt-4 sm:mt-5">You&apos;re booked!</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">{success}</p>
          <div className="bg-teal-50/70 rounded-2xl border border-teal-100 p-4 mt-5 text-left text-sm space-y-1.5">
            <p className="font-bold text-slate-900 text-sm sm:text-base">{doctor.name} <span className="font-medium text-teal-700 text-xs sm:text-sm">· {doctor.specialty.split('(')[0]}</span></p>
            <p className="text-slate-600 text-xs sm:text-[13px] flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />{fmtDate(date)} · {time}</p>
            <p className="text-slate-600 text-xs sm:text-[13px] flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-teal-600 shrink-0" />{name} · {phone}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
            <button onClick={() => { setSuccess(null); setStep(1); setNotes(''); }} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 sm:py-3.5 rounded-2xl text-sm transition active:scale-[.98]">
              Book another
            </button>
            <Link href="/queue" className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 sm:py-3.5 rounded-2xl text-sm transition text-center active:scale-[.98] flex items-center justify-center">
              Track live queue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-36 sm:pb-12 pt-4 sm:pt-10">
      {/* Hero Header */}
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-teal-200/70 text-teal-800 text-xs font-semibold shadow-xs max-w-full">
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-teal-600" />
          <span className="truncate">3 steps · ~1 min · Instant confirmation</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-2 sm:mt-3">Book your visit</h1>
        <p className="text-xs sm:text-[15px] text-slate-500 mt-0.5 sm:mt-1">Choose a doctor, pick a time, add your details.</p>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="mt-4 mb-5" aria-label="Booking progress">
        {/* Mobile segmented stepper */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="flex items-center gap-1.5 text-slate-900 font-bold">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[11px]">
                {step}
              </span>
              <span>Step {step} of 3: {STEPS[step - 1].label}</span>
            </span>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="text-teal-700 font-bold inline-flex items-center gap-0.5 active:opacity-70 text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1.5 h-1.5">
            {STEPS.map((s) => {
              const done = step > s.n;
              const active = step === s.n;
              return (
                <button
                  key={s.n}
                  type="button"
                  disabled={!done}
                  onClick={() => done && setStep(s.n)}
                  aria-label={`Step ${s.n}: ${s.label}`}
                  className={`rounded-full h-full transition-all ${
                    done
                      ? 'bg-emerald-500 cursor-pointer'
                      : active
                      ? 'bg-teal-600'
                      : 'bg-slate-200 cursor-not-allowed'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Desktop stepper */}
        <ol className="hidden sm:flex items-center gap-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = step === s.n;
            const done = step > s.n;
            return (
              <li key={s.n} className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!done}
                  onClick={() => done && setStep(s.n)}
                  className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 border text-[13px] font-bold transition text-left ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg cursor-default'
                      : done
                      ? 'bg-white text-emerald-700 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/50 cursor-pointer'
                      : 'bg-white text-slate-400 border-slate-200 cursor-not-allowed opacity-75'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      active ? 'bg-teal-400 text-slate-900' : done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {done ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  </span>
                  <span>{s.n}. {s.label}</span>
                </button>
                {i < 2 && <div className={`w-10 h-1 rounded-full ${step > s.n ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
              </li>
            );
          })}
        </ol>
      </div>

      {error && (
        <div role="alert" className="max-w-2xl mb-5 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-900 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_340px] gap-5 items-start">
        <div className="bg-white rounded-2xl sm:rounded-[24px] border border-slate-200/80 shadow-xl shadow-slate-200/40 p-4 sm:p-7 min-h-0 sm:min-h-[440px] animate-fade-in" key={step}>
          {/* STEP 1: Select Doctor */}
          {step === 1 && (
            <fieldset className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div>
                  <legend className="text-[17px] font-bold text-slate-900">Who would you like to see?</legend>
                  <p className="text-xs text-slate-500 mt-0.5">Select a doctor to view their schedule and pick a time.</p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name or specialty…"
                    aria-label="Search doctors"
                    className="pl-10 pr-9 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-base sm:text-sm w-full sm:w-64 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-3" role="radiogroup" aria-label="Doctors">
                {filtered.map((d) => {
                  const selected = d.id === doctorId;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => handleSelectDoctor(d.id)}
                      className={`text-left rounded-2xl p-3 sm:p-3.5 border-2 transition-all flex gap-3 items-center active:scale-[.99] min-h-[82px] relative group ${
                        selected
                          ? 'border-teal-600 bg-teal-50/70 ring-4 ring-teal-600/10 shadow-xs'
                          : 'border-slate-100 hover:border-teal-300 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="relative shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={d.avatarUrl}
                          alt={d.name}
                          className="w-14 h-14 rounded-2xl object-cover shrink-0 bg-slate-100 border border-slate-200/80"
                          style={{ width: '56px', height: '56px' }}
                        />
                        {selected && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-600 rounded-full border-2 border-white flex items-center justify-center shadow-xs">
                            <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 pr-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-sm font-bold text-slate-900 truncate">{d.name}</p>
                          <span className="text-[10px] text-slate-500 font-medium">· {d.experienceYears}+ yrs</span>
                        </div>
                        <p className="text-xs text-teal-700 font-semibold truncate mt-0.5">{d.specialty.split('(')[0]}</p>
                        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                          <CalendarDays className="w-3 h-3 text-teal-600 shrink-0" />
                          <span className="truncate">{fmtShortDays(d.availableDays)}</span>
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center">
                        <span
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-0.5 ${
                            selected
                              ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                              : 'bg-slate-50 group-hover:bg-teal-50 text-slate-700 group-hover:text-teal-800 border-slate-200 group-hover:border-teal-300'
                          }`}
                        >
                          <span>{selected ? 'Selected' : 'Select'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {filtered.length === 0 && (
                <p className="text-center text-sm text-slate-500 py-10">
                  No match for “{query}”. Try a specialty like “heart” or “child”.
                </p>
              )}
            </fieldset>
          )}

          {/* STEP 2: Choose Date & Time */}
          {step === 2 && doctor && (
            <div className="space-y-5 animate-fade-in">
              {/* Selected Doctor Summary Card on Step 2 */}
              <div className="bg-gradient-to-r from-teal-50/90 via-white to-emerald-50/40 border border-teal-200/90 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-2xs">
                <div className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={doctor.avatarUrl}
                    alt={doctor.name}
                    className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover bg-white border border-teal-200/80 shadow-xs"
                    style={{ width: '52px', height: '52px' }}
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-xs">
                    <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-100/90 px-2 py-0.5 rounded-md">
                      Selected Doctor
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {doctor.experienceYears}+ yrs exp
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm sm:text-base truncate mt-0.5">{doctor.name}</p>
                  <p className="text-xs text-teal-700 font-semibold truncate">{doctor.specialty.split('(')[0]}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-1">
                    <CalendarDays className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Available: <strong className="text-slate-800">{fmtShortDays(doctor.availableDays)}</strong></span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 bg-white hover:bg-teal-50 px-3 py-2 rounded-xl border border-teal-200/90 shadow-xs shrink-0 transition active:scale-95 flex items-center gap-1"
                >
                  <span>Change</span>
                </button>
              </div>

              {/* Date Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" /> Select Date
                  </p>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Available: {fmtShortDays(doctor.availableDays)}
                  </span>
                </div>
                <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
                  <div
                    className="flex gap-2 overflow-x-auto pb-2 pt-1 snap-x scrollbar-none px-0.5"
                    role="radiogroup"
                    aria-label="Appointment dates"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    {days.map((d) => {
                      const ok = isDayAvailable(d.iso);
                      const active = date === d.iso;
                      return (
                        <button
                          key={d.iso}
                          ref={active ? activeDateRef : null}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          aria-label={`${d.full} ${d.num} ${d.month}`}
                          disabled={!ok}
                          onClick={() => setDate(d.iso)}
                          className={`shrink-0 snap-center w-[64px] sm:w-[70px] py-2.5 sm:py-3 rounded-2xl border-2 text-center transition-all min-h-[74px] sm:min-h-[78px] flex flex-col items-center justify-center ${
                            active
                              ? 'border-teal-600 bg-teal-600 text-white shadow-md shadow-teal-600/30 scale-[1.02]'
                              : ok
                              ? 'border-slate-200 bg-white hover:border-teal-400 text-slate-800 shadow-2xs active:scale-95'
                              : 'border-slate-100 bg-slate-50/80 text-slate-400 cursor-not-allowed opacity-45'
                          }`}
                        >
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'text-teal-100' : 'text-slate-400'}`}>
                            {d.dow}
                          </span>
                          <span className="text-lg sm:text-xl font-extrabold leading-tight my-0.5">
                            {d.num}
                          </span>
                          <span className={`text-[10px] font-medium ${active ? 'text-teal-100' : 'text-slate-400'}`}>
                            {d.month}
                          </span>
                          {ok ? (
                            <span className={`w-1.5 h-1.5 rounded-full mt-1 ${active ? 'bg-white' : 'bg-emerald-500'}`} />
                          ) : (
                            <span className="text-[9px] text-slate-400 mt-0.5 font-medium">Off</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {date && !isDayAvailable(date) && (
                  <p className="text-[13px] text-amber-800 bg-amber-50 border border-amber-200 rounded-2xl px-3.5 py-2.5 mt-2">
                    Doctor is not open on {dayName(date)}s — available {fmtShortDays(doctor.availableDays)}.
                  </p>
                )}
              </div>

              {/* Time Slot Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-600" /> Select Time Slot
                  </p>
                  <span className="text-[11px] text-slate-500 font-medium">30 min consultation</span>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5" role="radiogroup" aria-label="Time slots">
                  {TIME_SLOTS.map((t) => {
                    const active = time === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setTime(t)}
                        className={`py-2.5 sm:py-3 px-1.5 text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl border-2 transition-all min-h-[46px] sm:min-h-[50px] flex items-center justify-center active:scale-[.98] ${
                          active
                            ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/25 ring-2 ring-teal-600/20'
                            : 'bg-white border-slate-200/90 text-slate-700 hover:border-teal-400 hover:bg-teal-50/30 shadow-2xs'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Selected Slot Preview Strip */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-50/70 to-slate-50 border border-teal-100 flex items-center justify-between text-xs shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white border border-teal-200/80 text-teal-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-500 font-medium">Selected Slot</p>
                    <p className="font-bold text-slate-900 truncate text-xs sm:text-sm">
                      {fmtDate(date)} · {time}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-teal-700 bg-white px-2.5 py-1 rounded-lg border border-teal-200/70 shadow-2xs shrink-0">
                  Step 2 of 3
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Patient Details */}
          {step === 3 && (
            <form id="booking-form" onSubmit={submit} className="space-y-4 max-w-xl animate-fade-in">
              {/* Mobile booking summary card */}
              <div className="lg:hidden bg-gradient-to-br from-teal-50/80 to-slate-50 border border-teal-100 rounded-2xl p-3.5 text-sm space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">Booking Summary</span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-teal-700 hover:underline"
                  >
                    Change doctor
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={doctor?.avatarUrl} alt="" className="w-11 h-11 rounded-xl object-cover bg-white shadow-xs shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 text-sm truncate">{doctor?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{doctor?.specialty.split('(')[0]}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-teal-100/80 grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate font-medium">{fmtDate(date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate font-medium">{time}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    Nan Da Wun Clinic
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="font-bold text-teal-700 hover:underline"
                  >
                    Change time
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-[17px] font-bold text-slate-900">Your details</h2>
                <p className="text-xs text-slate-500 mt-0.5">Enter your contact information for appointment confirmation.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 sm:gap-3.5">
                <label className="block">
                  <span className="text-[13px] font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                    <User className="w-3.5 h-3.5 text-teal-600" /> Full name
                  </span>
                  <input
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aung Min"
                    className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-base sm:text-[15px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </label>
                <label className="block">
                  <span className="text-[13px] font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                    <Phone className="w-3.5 h-3.5 text-teal-600" /> Phone number
                  </span>
                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09 xxx xxx xxx"
                    className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-base sm:text-[15px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-[13px] font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-600" /> Email for confirmation
                </span>
                <input
                  required
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-base sm:text-[15px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </label>
              <label className="block">
                <span className="text-[13px] font-semibold text-slate-700 mb-1.5 block">
                  Reason <span className="text-slate-400 font-normal">(optional)</span>
                </span>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Symptoms, questions…"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-base sm:text-[15px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </label>

              {!canSubmit && (
                <p className="text-xs text-amber-800 bg-amber-50/80 border border-amber-200/80 rounded-xl px-3.5 py-2.5 text-center">
                  Please fill in your name, valid email and phone number to confirm.
                </p>
              )}

              {/* Desktop submit button */}
              <button
                type="submit"
                disabled={loading || !canSubmit}
                className="hidden sm:flex w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl text-[15px] shadow-lg shadow-teal-600/25 transition items-center justify-center gap-2 active:scale-[.99]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4.5 h-4.5 animate-spin" /> Securing your slot…
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4.5 h-4.5" />
                    Confirm · {doctor?.name.split(' ').slice(0, 2).join(' ')} · {fmtDate(date)} {time}
                  </>
                )}
              </button>
              <div className="hidden sm:flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-slate-500 hover:text-slate-800"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Change date & time
                </button>
              </div>
            </form>
          )}

          {/* Desktop nav */}
          {step < 3 && (
            <div className="hidden sm:flex gap-3 pt-6 mt-6 border-t border-slate-100">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition min-h-[52px]"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={step === 1 ? !canNext1 : !canNext2}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white px-6 py-3.5 rounded-2xl text-sm font-bold transition min-h-[52px]"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Desktop Sidebar Summary */}
        <aside className="hidden lg:block bg-white rounded-[24px] border border-slate-200/80 shadow-xl shadow-slate-200/40 p-5 sm:p-6 lg:sticky lg:top-24">
          <p className="text-[11px] font-bold uppercase tracking-widest text-teal-700">Your booking</p>
          {doctor && (
            <div className="flex gap-3 items-center mt-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={doctor.avatarUrl} alt="" className="w-12 h-12 rounded-2xl object-cover bg-slate-100" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{doctor.name}</p>
                <p className="text-xs text-slate-500 truncate">{doctor.specialty.split('(')[0]}</p>
              </div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="ml-auto text-xs font-bold text-teal-700 hover:underline shrink-0"
                >
                  Change
                </button>
              )}
            </div>
          )}
          <div className="space-y-2.5 text-sm mt-4 pt-4 border-t border-slate-100">
            <p className="flex items-center gap-2.5 text-slate-700 font-medium">
              <span className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-teal-700" />
              </span>
              {date ? fmtDate(date) : 'Pick a day'} {date && dayName(date) ? `· ${dayName(date).slice(0, 3)}` : ''}
            </p>
            <p className="flex items-center gap-2.5 text-slate-700 font-medium">
              <span className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-teal-700" />
              </span>
              {time}
            </p>
            <p className="flex items-center gap-2.5 text-slate-500 text-[13px]">
              <span className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-slate-500" />
              </span>
              Nan Da Wun Clinic
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-xs text-emerald-900 flex gap-2 mt-4">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Free cancellation up to 2h before. Info stays private.</span>
          </div>
        </aside>
      </div>

      {/* Sticky mobile bar — native-feel bottom CTA */}
      {!success && (
        <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 pt-2.5 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!canNext1}
              className="w-full h-[52px] rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-[15px] font-bold active:scale-[.99] flex items-center justify-center gap-2 shadow-lg shadow-teal-600/25"
            >
              <span>Continue to Date & Time</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : step === 2 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] px-1 text-slate-600">
                <span className="truncate">
                  Booking with <strong className="text-slate-900">{doctor?.name.split(' ').slice(0, 2).join(' ')}</strong>
                </span>
                <span className="text-teal-700 font-bold shrink-0">
                  {fmtDate(date)} · {time}
                </span>
              </div>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  aria-label="Back to doctor selection"
                  className="w-[52px] h-[52px] rounded-2xl border border-slate-200 bg-white flex items-center justify-center shrink-0 active:bg-slate-100 shadow-xs"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-700" />
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!canNext2}
                  className="flex-1 h-[52px] rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-[15px] font-bold disabled:opacity-40 active:scale-[.99] flex items-center justify-center gap-1.5 shadow-lg shadow-teal-600/25"
                >
                  <span>Continue to Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setStep(2)}
                aria-label="Back to time selection"
                className="w-[52px] h-[52px] rounded-2xl border border-slate-200 bg-white flex items-center justify-center shrink-0 active:bg-slate-100 shadow-xs"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>
              <button
                form="booking-form"
                type="submit"
                disabled={loading || !canSubmit}
                className="flex-1 h-[52px] rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-[15px] font-bold disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[.99] shadow-lg shadow-teal-600/25"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4.5 h-4.5 animate-spin" /> Securing…
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4.5 h-4.5" />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-20 text-center text-slate-500">Loading booking…</div>}>
      <BookingWizard />
    </Suspense>
  );
}
