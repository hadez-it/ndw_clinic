'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { initialDoctors, Doctor } from '@/lib/types';
import {
  Award,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
  Clock,
  Search,
  ArrowRight,
  Filter,
  X,
  Sparkles,
  Phone,
} from 'lucide-react';

const SPECIALTY_OPTIONS = [
  { id: 'All', label: 'All Doctors', shortLabel: 'All' },
  { id: 'Cardiologist', label: 'Cardiology (နှလုံး)', shortLabel: 'Cardiology' },
  { id: 'Pediatrician', label: 'Pediatrics (ကလေး)', shortLabel: 'Pediatrics' },
  { id: 'Endocrinology', label: 'Internal Med (ဆီးချို)', shortLabel: 'Internal Med' },
  { id: 'Orthopedic', label: 'Orthopedics (အရိုးအကြော)', shortLabel: 'Orthopedics' },
];

export default function DoctorsPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const todayDayName = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  }, []);

  const filteredDoctors = useMemo(() => {
    return initialDoctors.filter((doc) => {
      const matchesSpecialty =
        selectedSpecialty === 'All' ||
        doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
      const matchesQuery =
        !searchQuery.trim() ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.qualification.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSpecialty && matchesQuery;
    });
  }, [selectedSpecialty, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10 space-y-5 sm:space-y-8 min-w-0 overflow-x-hidden">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto space-y-2 px-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>Board Certified Clinical Specialists</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight break-words">
          Meet Our Dedicated Medical Specialists
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Compassionate healthcare providers, multi-specialty clinical precision, and patient-centered treatment roadmaps.
        </p>
      </div>

      {/* Filter and Search Bar (Mobile-first layout with zero overflow) */}
      <div className="w-full min-w-0 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4 overflow-hidden">
        {/* Specialty Filter Pills (Smooth Touch Carousel with safe bounds) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto min-w-0">
          {SPECIALTY_OPTIONS.map((spec) => {
            const isSelected = selectedSpecialty === spec.id;
            const count =
              spec.id === 'All'
                ? initialDoctors.length
                : initialDoctors.filter((d) =>
                    d.specialty.toLowerCase().includes(spec.id.toLowerCase())
                  ).length;

            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => setSelectedSpecialty(spec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                <span>{spec.shortLabel}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                    isSelected ? 'bg-teal-700 text-white' : 'bg-slate-200/70 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Doctor Search (Font size 16px on mobile to prevent iOS Safari auto-zoom) */}
        <div className="relative w-full sm:w-72 shrink-0 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search doctor or condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-base sm:text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Results Header on Mobile */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-0.5">
        <span>
          Showing <strong className="text-slate-900">{filteredDoctors.length}</strong> specialist{filteredDoctors.length === 1 ? '' : 's'}
        </span>
        {(selectedSpecialty !== 'All' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedSpecialty('All');
              setSearchQuery('');
            }}
            className="text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Doctors Grid (Mobile-Optimized Cards) */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-3">
          <Stethoscope className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-800">No physicians found matching your criteria.</p>
          <p className="text-xs text-slate-500">Try searching for a different condition or reset your filters.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedSpecialty('All');
              setSearchQuery('');
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-800 pt-1 cursor-pointer"
          >
            <span>Show All Specialists</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full min-w-0">
          {filteredDoctors.map((doctor) => {
            const isAvailableToday = doctor.availableDays.includes(todayDayName);

            return (
              <div
                key={doctor.id}
                className="w-full min-w-0 bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover-lift flex flex-col sm:flex-row group"
              >
                {/* Doctor Portrait Header (Strict fixed height to prevent mobile Safari collapse) */}
                <div className="w-full sm:w-2/5 relative bg-slate-100 h-52 sm:h-auto sm:min-h-[240px] shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={doctor.avatarUrl}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Experience Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-teal-900 border border-slate-200/80 shadow-xs">
                    {doctor.experienceYears}+ Yrs Practice
                  </div>

                  {/* Today Available Badge */}
                  {isAvailableToday && (
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>Available Today</span>
                    </div>
                  )}
                </div>

                {/* Doctor Details Body */}
                <div className="w-full sm:w-3/5 p-4 sm:p-5 flex flex-col justify-between space-y-3 min-w-0">
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
                      {doctor.specialty}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-snug group-hover:text-teal-600 transition-colors truncate">
                      {doctor.name}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                      {doctor.qualification}
                    </p>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                      {doctor.bio}
                    </p>

                    {/* Clinic Consultation Days */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>Consultation Days:</span>
                        </span>
                        <span className="text-[10px] text-teal-700 font-semibold shrink-0">
                          {doctor.availableDays.length} Days / Wk
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {doctor.availableDays.map((day) => {
                          const isToday = day === todayDayName;
                          return (
                            <span
                              key={day}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition ${
                                isToday
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {day.slice(0, 3)}
                              {isToday ? ' (Today)' : ''}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Primary CTA (Fits cleanly on all screens without overflowing) */}
                  <div className="pt-3 border-t border-slate-100">
                    <Link
                      href={`/appointments?doctor=${encodeURIComponent(doctor.id)}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-4 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition active:scale-98 text-center"
                    >
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>Book Consultation</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Mobile Assistance Strip */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-teal-50/80 border border-teal-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs w-full min-w-0">
        <div className="flex items-center gap-2.5 text-teal-950 text-center sm:text-left min-w-0">
          <Phone className="w-4 h-4 text-teal-600 shrink-0" />
          <span className="leading-normal">
            Need help selecting the right physician or urgent consultation? Call our reception desk at{' '}
            <a href="tel:+18005550199" className="font-bold text-teal-800 underline">
              (800) 555-0199
            </a>
          </span>
        </div>
        <Link
          href="/appointments"
          className="w-full sm:w-auto text-center bg-teal-700 hover:bg-teal-800 text-white font-semibold px-4 py-2.5 sm:py-2 rounded-xl shrink-0 transition"
        >
          General Appointment &rarr;
        </Link>
      </div>

      {/* Clinic Ethics and Clinical Credentials Standard (Compact responsive grid) */}
      <div className="w-full min-w-0 bg-slate-100/90 rounded-2xl p-4 sm:p-8 border border-slate-200/90 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2.5 bg-white rounded-xl text-teal-600 shadow-xs shrink-0">
            <Award className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">Double-Board Certified</h3>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Every clinician holds active clinical certifications in their discipline and participates in continuous medical research.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2.5 bg-white rounded-xl text-teal-600 shadow-xs shrink-0">
            <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">Multidisciplinary Review</h3>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Cross-functional physician boards review complex cases to guarantee complete diagnostic accuracy.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2.5 bg-white rounded-xl text-teal-600 shadow-xs shrink-0">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">Patient-Centered Outcomes</h3>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              We prioritize preventative intervention, clear treatment plans, and compassionate long-term health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
