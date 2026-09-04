'use client';

import { useMemo, useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { initialDoctors } from '@/lib/types';
import {
  Calendar, CheckCircle2, AlertCircle, Clock, User, Mail, Phone,
  ChevronLeft, ChevronRight, Stethoscope, Search, Check, PartyPopper,
  MapPin, ShieldCheck, Sparkles, X, Loader2, CalendarDays,
  Sun, Sunset, Moon,
} from 'lucide-react';

interface TimeSlot {
  time: string;
  period: 'morning' | 'afternoon' | 'evening';
  booked?: boolean;
}

const TIME_SLOTS: TimeSlot[] = [
  // Morning slots (09:00 AM - 12:00 PM)
  { time: '09:00 AM', period: 'morning' },
  { time: '09:30 AM', period: 'morning' },
  { time: '10:30 AM', period: 'morning' },
  { time: '11:15 AM', period: 'morning', booked: true },
  // Afternoon slots (01:00 PM - 05:00 PM)
  { time: '01:00 PM', period: 'afternoon' },
  { time: '02:30 PM', period: 'afternoon' },
  { time: '03:15 PM', period: 'afternoon', booked: true },
  { time: '04:00 PM', period: 'afternoon' },
  // Evening slots (05:30 PM - 07:30 PM)
  { time: '05:30 PM', period: 'evening' },
  { time: '06:15 PM', period: 'evening' },
  { time: '07:00 PM', period: 'evening' },
];

const PERIOD_CONFIG = [
  { id: 'all', label: 'All', icon: Sparkles, timeRange: '09:00 AM - 07:30 PM' },
  { id: 'morning', label: 'Morning', icon: Sun, timeRange: '09:00 AM - 12:00 PM' },
  { id: 'afternoon', label: 'Afternoon', icon: Sunset, timeRange: '01:00 PM - 05:00 PM' },
  { id: 'evening', label: 'Evening', icon: Moon, timeRange: '05:30 PM - 07:30 PM' },
] as const;

type PeriodFilter = (typeof PERIOD_CONFIG)[number]['id'];

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

function fmtDateFull(iso: string) {
  if (!iso) return '';
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
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

interface InteractiveMonthCalendarProps {
  selectedDate: string;
  onSelectDate: (iso: string) => void;
  isDayAvailable: (iso: string) => boolean;
  doctorName?: string;
  availableDays?: string[];
  maxDaysAhead?: number;
}

function InteractiveMonthCalendar({
  selectedDate,
  onSelectDate,
  isDayAvailable,
  maxDaysAhead = 60,
}: InteractiveMonthCalendarProps) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const maxDate = useMemo(() => {
    const m = new Date(today);
    m.setDate(today.getDate() + maxDaysAhead);
    return m;
  }, [today, maxDaysAhead]);

  // View month based on selectedDate or today
  const [viewDate, setViewDate] = useState(() => {
    if (selectedDate) {
      const d = new Date(selectedDate + 'T12:00:00');
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // Sync viewDate when selectedDate prop changes
  const [prevSelectedDate, setPrevSelectedDate] = useState(selectedDate);
  if (selectedDate !== prevSelectedDate) {
    setPrevSelectedDate(selectedDate);
    if (selectedDate) {
      const d = new Date(selectedDate + 'T12:00:00');
      setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const canPrev = viewDate.getFullYear() > today.getFullYear() || viewDate.getMonth() > today.getMonth();
  const canNext =
    (viewDate.getFullYear() - today.getFullYear()) * 12 + (viewDate.getMonth() - today.getMonth()) <
    Math.ceil(maxDaysAhead / 30);

  const prevMonth = () => {
    if (!canPrev) return;
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const nextMonth = () => {
    if (!canNext) return;
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const { firstDayIndex, totalDays } = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1).getDay();
    const total = new Date(viewYear, viewMonth + 1, 0).getDate();
    return { firstDayIndex: first, totalDays: total };
  }, [viewYear, viewMonth]);

  const weekdays = [
    { s: 'Su', full: 'Sunday' },
    { s: 'Mo', full: 'Monday' },
    { s: 'Tu', full: 'Tuesday' },
    { s: 'We', full: 'Wednesday' },
    { s: 'Th', full: 'Thursday' },
    { s: 'Fr', full: 'Friday' },
    { s: 'Sa', full: 'Saturday' },
  ];

  return (
    <div className="w-full select-none">
      {/* Month Navigator Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-slate-900">{monthLabel}</h4>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={!canPrev}
            onClick={prevMonth}
            aria-label="Previous month"
            className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition active:scale-95 shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={!canNext}
            onClick={nextMonth}
            aria-label="Next month"
            className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition active:scale-95 shadow-2xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1" role="row">
        {weekdays.map((w) => (
          <span key={w.s} className="text-[11px] font-bold text-slate-400 py-1" role="columnheader" aria-label={w.full}>
            {w.s}
          </span>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1" role="grid" aria-label={`Calendar for ${monthLabel}`}>
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-9 sm:h-10" />
        ))}
        {Array.from({ length: totalDays }).map((_, idx) => {
          const dayNum = idx + 1;
          const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const cellDate = new Date(viewYear, viewMonth, dayNum);
          cellDate.setHours(0, 0, 0, 0);

          const isPast = cellDate < today;
          const isTooFar = cellDate > maxDate;
          const isDocAvailable = isDayAvailable(iso);
          const isSelectable = !isPast && !isTooFar && isDocAvailable;
          const isSelected = selectedDate === iso;
          const isToday = cellDate.getTime() === today.getTime();

          return (
            <button
              key={iso}
              type="button"
              role="gridcell"
              aria-selected={isSelected}
              aria-disabled={!isSelectable}
              aria-label={`${cellDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}${
                isSelected ? ', selected' : ''
              }${!isSelectable ? ', unavailable' : ', available'}`}
              disabled={!isSelectable}
              onClick={() => onSelectDate(iso)}
              className={`relative h-9 sm:h-10 w-full rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-600/30 scale-105 z-10'
                  : isSelectable
                  ? 'bg-white text-slate-800 hover:bg-teal-50 hover:border-teal-400 border border-slate-200/80 shadow-2xs active:scale-95'
                  : 'bg-slate-50/50 text-slate-300 border border-slate-100 cursor-not-allowed opacity-45'
              } ${isToday && !isSelected ? 'ring-1.5 ring-teal-500/50' : ''}`}
            >
              <span>{dayNum}</span>
              {isSelectable && !isSelected && (
                <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Calendar Legend */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 mt-3 border-t border-slate-200/80">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span>Available</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-teal-600 shrink-0" />
          <span>Selected</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
          <span>Off / Closed</span>
        </span>
      </div>
    </div>
  );
}

function BookingWizard() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get('doctor');

  const [step, setStep] = useState(preselected ? 2 : 1);
  const [doctorId, setDoctorId] = useState(preselected || initialDoctors[0]?.id || '');
  const [query, setQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const activeDateRef = useRef<HTMLButtonElement | null>(null);

  // Scroll to top when moving between wizard steps on mobile
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const doctor = useMemo(() => initialDoctors.find((d) => d.id === doctorId), [doctorId]);

  // Initial date selected
  const [date, setDate] = useState(() => {
    const today = new Date();
    const doc = initialDoctors.find((d) => d.id === (preselected || initialDoctors[0]?.id));
    for (let i = 0; i < 60; i++) {
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

  // Mobile horizontal scroll strip (14 days ahead, dynamically including selected date if further ahead)
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
    // If selected date is beyond the 14 days, dynamically include it in sorted order
    if (date && !out.some((d) => d.iso === date)) {
      const sel = new Date(date + 'T12:00:00');
      out.push({
        iso: date,
        dow: sel.toLocaleDateString('en-US', { weekday: 'short' }),
        num: String(sel.getDate()),
        month: sel.toLocaleDateString('en-US', { month: 'short' }),
        full: sel.toLocaleDateString('en-US', { weekday: 'long' }),
      });
      out.sort((a, b) => a.iso.localeCompare(b.iso));
    }
    return out;
  }, [date]);

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
        const today = new Date();
        for (let i = 0; i < 60; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          const dow = d.toLocaleDateString('en-US', { weekday: 'long' });
          const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          if (selectedDoc.availableDays.includes(dow)) {
            setDate(iso);
            break;
          }
        }
      }
    }
    // Instantly advance to Date & Time step
    setStep(2);
  };

  const canNext1 = !!doctorId;
  const canNext2 = !!date && !!time && isDayAvailable(date);
  const canSubmit = name.trim().length >= 2 && /.+@.+\..+/.test(email) && phone.trim().length >= 7;

  // Grouped time slots based on period filter
  const filteredSlots = useMemo(() => {
    if (periodFilter === 'all') return TIME_SLOTS;
    return TIME_SLOTS.filter((s) => s.period === periodFilter);
  }, [periodFilter]);

  const slotCounts = useMemo(() => {
    return {
      all: TIME_SLOTS.filter((s) => !s.booked).length,
      morning: TIME_SLOTS.filter((s) => s.period === 'morning' && !s.booked).length,
      afternoon: TIME_SLOTS.filter((s) => s.period === 'afternoon' && !s.booked).length,
      evening: TIME_SLOTS.filter((s) => s.period === 'evening' && !s.booked).length,
    };
  }, []);

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
            <p className="text-slate-600 text-xs sm:text-[13px] flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />{fmtDateFull(date)} · {time}</p>
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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-36 sm:pb-12 pt-4 sm:pt-10 min-w-0 flex flex-col flex-1">
      {/* Hero Header */}
      <div className="w-full max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-teal-200/70 text-teal-800 text-xs font-semibold shadow-xs max-w-full">
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-teal-600" />
          <span className="truncate">3 steps · ~1 min · Instant confirmation</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-2 sm:mt-3">Book your visit</h1>
        <p className="text-xs sm:text-[15px] text-slate-500 mt-0.5 sm:mt-1">Choose a doctor, pick a time, add your details.</p>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="w-full mt-4 mb-5" aria-label="Booking progress">
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

      {/* Main Form Area + Desktop Sidebar */}
      <div className={`w-full grid ${step === 2 ? 'xl:grid-cols-[1fr_320px]' : 'lg:grid-cols-[1fr_340px]'} gap-5 items-start min-w-0`}>
        <div className="w-full min-w-0 bg-white rounded-2xl sm:rounded-[28px] border border-slate-200/80 shadow-xl shadow-slate-200/40 p-4 sm:p-7 min-h-0 sm:min-h-[440px] animate-fade-in overflow-hidden" key={step}>
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
                      className={`text-left rounded-2xl p-3 sm:p-3.5 border-2 transition-all flex gap-3 items-center active:scale-[.99] min-h-[82px] relative group min-w-0 ${
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
                          <CalendarDays className="w-3.5 h-3.5 text-teal-600 shrink-0" />
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
                          <ChevronRight className="w-3.5 h-3.5" />
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
            <div className="w-full space-y-6 animate-fade-in min-w-0">
              {/* Desktop lg split layout / Mobile unified stack */}
              <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
                {/* Left Column: Interactive Month Calendar (Desktop lg view) */}
                <div className="hidden lg:block bg-gradient-to-b from-slate-50/90 to-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs lg:sticky lg:top-24">
                  <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-200/70">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" /> Interactive Calendar
                    </h3>
                    <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-200/70 px-2 py-0.5 rounded-md">
                      Next 60 days
                    </span>
                  </div>
                  <InteractiveMonthCalendar
                    selectedDate={date}
                    onSelectDate={(newIso) => setDate(newIso)}
                    isDayAvailable={isDayAvailable}
                    doctorName={doctor.name}
                    availableDays={doctor.availableDays}
                    maxDaysAhead={60}
                  />
                </div>

                {/* Right Column: Doctor summary + Mobile Date strip + Categorized Time Slots */}
                <div className="space-y-5 min-w-0">
                  {/* Selected Doctor Summary Card */}
                  <div className="w-full bg-gradient-to-r from-teal-50/90 via-white to-emerald-50/40 border border-teal-200/90 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-2xs min-w-0">
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

                  {/* Mobile Horizontal Date Strip & Action Button (< lg screens) */}
                  <div className="lg:hidden w-full min-w-0">
                    <div className="w-full flex items-center justify-between mb-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" /> Select Date
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowCalendarModal(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100/80 border border-teal-200/80 px-2.5 py-1.5 rounded-xl transition active:scale-95 shadow-2xs"
                      >
                        <CalendarDays className="w-3.5 h-3.5 text-teal-600" />
                        <span>View full calendar</span>
                      </button>
                    </div>

                    <div className="w-full min-w-0 overflow-hidden">
                      <div
                        className="w-full flex gap-2 overflow-x-auto pb-2 pt-1 snap-x scrollbar-none px-0.5"
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
                  <div className="w-full min-w-0">
                    <div className="w-full flex items-center justify-between mb-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-600" /> Select Time Slot
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200/70 px-2.5 py-0.5 rounded-full">
                        30 min consultation
                      </span>
                    </div>

                    {/* Period Tabs: All, Morning, Afternoon, Evening */}
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl mb-3 overflow-x-auto scrollbar-none" role="tablist" aria-label="Time of day filter">
                      {PERIOD_CONFIG.map((p) => {
                        const Icon = p.icon;
                        const active = periodFilter === p.id;
                        const count = slotCounts[p.id];
                        return (
                          <button
                            key={p.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setPeriodFilter(p.id)}
                            className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap ${
                              active
                                ? 'bg-white text-teal-800 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 ${active ? 'text-teal-600' : 'text-slate-400'}`} />
                            <span>{p.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-teal-100 text-teal-800' : 'bg-slate-200/70 text-slate-500'}`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Time Slots Display */}
                    {periodFilter === 'all' ? (
                      <div className="space-y-3.5">
                        {(['morning', 'afternoon', 'evening'] as const).map((periodKey) => {
                          const slotsInGroup = TIME_SLOTS.filter((s) => s.period === periodKey);
                          const cfg = PERIOD_CONFIG.find((c) => c.id === periodKey)!;
                          const Icon = cfg.icon;

                          return (
                            <div key={periodKey} className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-0.5">
                                <span className="flex items-center gap-1.5 text-slate-700">
                                  <Icon className="w-3.5 h-3.5 text-teal-600" />
                                  <span className="capitalize">{periodKey}</span>
                                </span>
                                <span className="text-[10px] font-medium text-slate-400">{cfg.timeRange}</span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label={`${periodKey} time slots`}>
                                {slotsInGroup.map((slot) => {
                                  const active = time === slot.time;
                                  if (slot.booked) {
                                    return (
                                      <button
                                        key={slot.time}
                                        type="button"
                                        disabled
                                        aria-disabled="true"
                                        title="Slot already booked"
                                        className="w-full py-2.5 sm:py-3 px-1.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200/80 bg-slate-100/90 text-slate-400 line-through opacity-45 cursor-not-allowed flex items-center justify-center min-h-[46px]"
                                      >
                                        {slot.time}
                                      </button>
                                    );
                                  }
                                  return (
                                    <button
                                      key={slot.time}
                                      type="button"
                                      role="radio"
                                      aria-checked={active}
                                      onClick={() => setTime(slot.time)}
                                      className={`w-full py-2.5 sm:py-3 px-1.5 text-xs sm:text-sm font-bold rounded-xl border-2 transition-all min-h-[46px] flex items-center justify-center active:scale-[.98] ${
                                        active
                                          ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/25 ring-2 ring-teal-600/20'
                                          : 'bg-white border-slate-200/90 text-slate-700 hover:border-teal-400 hover:bg-teal-50/40 shadow-2xs'
                                      }`}
                                    >
                                      {slot.time}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Selected time slots">
                        {filteredSlots.map((slot) => {
                          const active = time === slot.time;
                          if (slot.booked) {
                            return (
                              <button
                                key={slot.time}
                                type="button"
                                disabled
                                aria-disabled="true"
                                title="Slot already booked"
                                className="w-full py-2.5 sm:py-3 px-1.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200/80 bg-slate-100/90 text-slate-400 line-through opacity-45 cursor-not-allowed flex items-center justify-center min-h-[46px]"
                              >
                                {slot.time}
                              </button>
                            );
                          }
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              role="radio"
                              aria-checked={active}
                              onClick={() => setTime(slot.time)}
                              className={`w-full py-2.5 sm:py-3 px-1.5 text-xs sm:text-sm font-bold rounded-xl border-2 transition-all min-h-[46px] flex items-center justify-center active:scale-[.98] ${
                                active
                                  ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/25 ring-2 ring-teal-600/20'
                                  : 'bg-white border-slate-200/90 text-slate-700 hover:border-teal-400 hover:bg-teal-50/40 shadow-2xs'
                              }`}
                            >
                              {slot.time}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Live Selected Slot Preview Strip */}
                  <div className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-teal-50/80 to-slate-50 border border-teal-100 flex items-center justify-between text-xs shadow-2xs min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-white border border-teal-200/80 text-teal-700 flex items-center justify-center shrink-0 shadow-2xs">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-500 font-medium">Selected Slot</p>
                        <p className="font-bold text-slate-900 truncate text-xs sm:text-sm">
                          {fmtDateFull(date)} · {time}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-teal-700 bg-white px-2.5 py-1 rounded-lg border border-teal-200/70 shadow-2xs shrink-0">
                      Step 2 of 3
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Patient Details */}
          {step === 3 && (
            <form id="booking-form" onSubmit={submit} className="w-full space-y-4 max-w-xl animate-fade-in min-w-0">
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

          {/* Desktop navigation buttons */}
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
        <aside className={`${step === 2 ? 'hidden xl:block' : 'hidden lg:block'} w-full bg-white rounded-[28px] border border-slate-200/80 shadow-xl shadow-slate-200/40 p-5 sm:p-6 lg:sticky lg:top-24`}>
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
              {date ? fmtDateFull(date) : 'Pick a day'}
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

      {/* Mobile Month Calendar Modal / Bottom Sheet */}
      {showCalendarModal && doctor && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="calendar-modal-title"
          onClick={() => setShowCalendarModal(false)}
        >
          <div
            className="bg-white rounded-t-[28px] sm:rounded-[28px] max-w-md w-full p-5 shadow-2xl border border-slate-200 relative animate-slide-down max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile grab handle */}
            <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-3 sm:hidden" />

            {/* Modal Header */}
            <div className="flex items-start justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 id="calendar-modal-title" className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" /> Select Appointment Date
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Doctor open: <strong className="text-slate-800">{fmtShortDays(doctor.availableDays)}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCalendarModal(false)}
                aria-label="Close calendar"
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Calendar inside modal */}
            <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-200/80">
              <InteractiveMonthCalendar
                selectedDate={date}
                onSelectDate={(newIso) => {
                  setDate(newIso);
                  setShowCalendarModal(false);
                }}
                isDayAvailable={isDayAvailable}
                doctorName={doctor.name}
                availableDays={doctor.availableDays}
                maxDaysAhead={60}
              />
            </div>

            {/* Done Button */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCalendarModal(false)}
                className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/25 transition active:scale-98"
              >
                Done · {fmtDate(date)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky mobile bar — native-feel bottom CTA */}
      {!success && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 w-full z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 pt-2.5 pb-[max(1rem,env(safe-area-inset-bottom))] pb-safe">
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
                <span className="font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-lg text-[11px] shrink-0">
                  {fmtDate(date)} • {time}
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
