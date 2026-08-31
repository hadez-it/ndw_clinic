import Link from 'next/link';
import { initialDoctors } from '@/lib/types';
import { Award, Calendar, CheckCircle2, ShieldCheck, Stethoscope, Clock } from 'lucide-react';

export const metadata = {
  title: 'Our Doctors & Medical Specialists | ApexHealth Clinic',
  description: 'Meet our board-certified healthcare professionals across cardiology, pediatrics, endocrinology, and orthopedics.',
};

export default function DoctorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Board Certified & Credentialed Specialists</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Meet Our Dedicated Medical Team
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Our clinic unites experienced clinicians committed to compassionate care, state-of-the-art evidence-based medicine, and personalized health roadmaps.
        </p>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {initialDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row"
          >
            <div className="sm:w-2/5 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={doctor.avatarUrl}
                alt={doctor.name}
                className="w-full h-64 sm:h-full object-cover object-top"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-[11px] font-bold text-teal-800 border border-slate-200">
                {doctor.experienceYears}+ Yrs Practice
              </div>
            </div>

            <div className="sm:w-3/5 p-6 sm:p-7 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  {doctor.specialty}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{doctor.name}</h2>
                <p className="text-xs text-slate-500 font-medium">{doctor.qualification}</p>

                <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                  {doctor.bio}
                </p>

                {/* Available Days */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Clinic Consultation Days:</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {doctor.availableDays.map((day) => (
                      <span
                        key={day}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/appointments?doctor=${encodeURIComponent(doctor.id)}`}
                  className="w-full text-center inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-teal-600/20 transition"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clinic Ethics / Credentials Standard */}
      <div className="bg-slate-100/90 rounded-3xl p-8 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-white rounded-xl text-teal-600 shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Double-Board Certified</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Every staff doctor holds active board certifications in their clinical specialty and participates in ongoing CME.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-white rounded-xl text-teal-600 shadow-xs">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Multidisciplinary Collaboration</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Complex cases are reviewed by our cross-functional physician board to ensure no diagnosis detail is overlooked.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-white rounded-xl text-teal-600 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Patient-Centered Outcomes</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              We emphasize preventative intervention, minimal unnecessary pharmacology, and lasting lifestyle health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
