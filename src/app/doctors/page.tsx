'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { initialDoctors } from '@/lib/types';
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
} from 'lucide-react';

export default function DoctorsPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const specialties = useMemo(() => {
    const list = Array.from(new Set(initialDoctors.map((d) => d.specialty)));
    return ['All', ...list];
  }, []);

  const filteredDoctors = useMemo(() => {
    return initialDoctors.filter((doc) => {
      const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
      const matchesQuery =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.bio.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSpecialty && matchesQuery;
    });
  }, [selectedSpecialty, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>Board Certified Clinical Specialists</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Meet Our Dedicated Medical Specialists
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          Our clinic unites experienced physicians committed to compassionate care, evidence-based diagnoses, and individualized preventative roadmaps.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Specialty Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {specialties.map((spec) => (
            <button
              key={spec}
              type="button"
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedSpecialty === spec
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Doctor Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search doctor or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition"
          />
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Stethoscope className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No physicians found matching your search.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedSpecialty('All');
              setSearchQuery('');
            }}
            className="text-xs font-semibold text-teal-600 hover:text-teal-800"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover-lift flex flex-col sm:flex-row group"
            >
              {/* Doctor Avatar */}
              <div className="sm:w-2/5 relative bg-slate-100 min-h-[200px] sm:min-h-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-teal-900 border border-slate-200/80 shadow-xs">
                  {doctor.experienceYears}+ Yrs Practice
                </div>
              </div>

              {/* Doctor Details */}
              <div className="sm:w-3/5 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                    {doctor.specialty}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{doctor.name}</h2>
                  <p className="text-xs text-slate-500 font-medium">{doctor.qualification}</p>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-3">
                    {doctor.bio}
                  </p>

                  {/* Available Consultation Days */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>Clinic Days:</span>
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {doctor.availableDays.map((day) => (
                        <span
                          key={day}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href={`/appointments?doctor=${encodeURIComponent(doctor.id)}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Consultation</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clinic Ethics and Clinical Credentials Standard */}
      <div className="bg-slate-100/90 rounded-2xl p-6 sm:p-8 border border-slate-200/90 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-white rounded-xl text-teal-600 shadow-xs shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Double-Board Certified</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Every staff clinician holds active certifications in their clinical discipline and completes ongoing medical education.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-white rounded-xl text-teal-600 shadow-xs shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Multidisciplinary Review</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Complex cases are reviewed by our cross-functional physician board to ensure no diagnostic detail is overlooked.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-white rounded-xl text-teal-600 shadow-xs shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Patient-Centered Outcomes</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              We emphasize preventative intervention, minimal unnecessary pharmacology, and sustainable lifestyle recovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
