import Link from 'next/link';
import {
  ShieldCheck,
  HeartPulse,
  Clock,
  Award,
  ArrowRight,
  UserCheck,
  Stethoscope,
  CheckCircle2,
  Calendar,
  Activity,
  Phone,
} from 'lucide-react';
import { initialDoctors, initialTopics } from '@/lib/types';

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/50 via-white to-slate-50 pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              {/* Eyebrow (1 of max 2 allowed on page) */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-200 text-teal-900 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Certified Clinical Excellence and Data Privacy</span>
              </div>

              {/* Headline (strictly max 2 lines desktop) */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Modern Healthcare, <br />
                <span className="text-teal-700">Rooted in Trust and Empathy</span>
              </h1>

              {/* Subtext (strictly <= 20 words, max 3 lines) */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect with board-certified specialists in cardiology, pediatrics, endocrinology, and orthopedics with immediate digital confirmation.
              </p>

              {/* CTAs (1 primary, 1 secondary) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/appointments"
                  className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-6 py-3.5 rounded-xl font-semibold shadow-xs transition text-sm sm:text-base text-center"
                >
                  <span>Book Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/doctors"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 px-6 py-3.5 rounded-xl font-semibold text-slate-800 shadow-xs transition text-sm sm:text-base text-center"
                >
                  <UserCheck className="w-4 h-4 text-teal-600" />
                  <span>Meet Our Specialists</span>
                </Link>
              </div>
            </div>

            {/* Right Hero Clinical Assurance Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Clinic Care Assurance</h2>
                      <p className="text-xs text-slate-500">Same-Day Consultation Slots Available</p>
                    </div>
                  </div>
                  <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                    Open Today
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>Board-certified physicians with 10+ years specialized hospital practice.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>On-site diagnostic pathology, ECG, and digital health records.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>Zero data leaks: Row Level Security medical database protection.</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-medium text-slate-500">Emergency Desk Line</p>
                    <p className="text-sm sm:text-base font-bold text-slate-900">(800) 555-0199</p>
                  </div>
                  <Link
                    href="/contact"
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs"
                  >
                    Direct Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Metric Strip (Under Hero per taste-skill rules) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="pt-3 sm:pt-0 sm:px-4">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">15,000+</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Patients Treated Safely</p>
          </div>
          <div className="pt-3 sm:pt-0 sm:px-4">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">99.4%</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Patient Satisfaction Rate</p>
          </div>
          <div className="pt-3 sm:pt-0 sm:px-4">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">100%</p>
            <p className="text-xs text-slate-500 font-medium mt-1">HIPAA Encrypted Records</p>
          </div>
        </div>
      </section>

      {/* Medical Specialties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Comprehensive Clinical Disciplines
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Our specialized departments are organized around preventative wellness, clinical precision, and patient recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Cardiology',
              desc: 'Comprehensive cardiac screenings, ECG diagnostics, blood pressure management, and vascular care plans.',
              icon: HeartPulse,
            },
            {
              title: 'Pediatrics',
              desc: 'Compassionate pediatric healthcare, developmental wellness milestones, and routine immunizations.',
              icon: Stethoscope,
            },
            {
              title: 'Internal Medicine',
              desc: 'Endocrinology, diabetes treatment roadmaps, metabolic assessments, and preventative screenings.',
              icon: Award,
            },
            {
              title: 'Orthopedics',
              desc: 'Joint preservation, athletic injury recovery, and non-surgical musculoskeletal healing therapies.',
              icon: Clock,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover-lift flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <Link
                    href={`/doctors`}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
                  >
                    <span>View Specialists</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Clinical Specialists
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Experienced physicians committed to compassionate care, medical precision, and patient safety.
            </p>
          </div>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 whitespace-nowrap"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover-lift flex flex-col group"
            >
              <div className="overflow-hidden h-52 bg-slate-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={doc.avatarUrl}
                  alt={doc.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-md text-[11px] font-bold text-teal-900 border border-slate-200/80">
                  {doc.experienceYears}+ Years Exp.
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                    {doc.specialty}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1 group-hover:text-teal-600 transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{doc.qualification}</p>
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {doc.bio}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {doc.availableDays.length} Days / Wk
                  </span>
                  <Link
                    href={`/appointments?doctor=${encodeURIComponent(doc.id)}`}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-800"
                  >
                    Book Visit &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Doctor-Curated Health Articles */}
      <section className="bg-slate-100/80 py-12 sm:py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Health Knowledge Hub
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                Evidence-based healthcare insights published directly by our medical staff.
              </p>
            </div>
            <Link
              href="/knowledge"
              className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 whitespace-nowrap"
            >
              <span>Explore All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {initialTopics.slice(0, 3).map((topic) => (
              <article
                key={topic.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between hover-lift overflow-hidden group"
              >
                {topic.imageUrl && (
                  <div className="h-44 overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={topic.imageUrl}
                      alt={topic.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                      <span className="px-2.5 py-0.5 rounded-full font-semibold bg-teal-50 text-teal-700 text-[11px]">
                        {topic.category}
                      </span>
                      <span>{topic.createdAt}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-teal-600 transition-colors line-clamp-2">
                      <Link href="/knowledge">{topic.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {topic.excerpt}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{topic.authorName}</span>
                    <Link href="/knowledge" className="font-semibold text-teal-600 hover:underline">
                      Read Article &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Direct Scheduling Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-800 to-teal-950 rounded-2xl p-6 sm:p-10 text-white flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 shadow-sm">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to schedule your clinical consultation?
            </h3>
            <p className="text-teal-100 text-xs sm:text-sm max-w-xl">
              Choose your physician, pick a convenient date, and receive your digital confirmation immediately with live queue updates.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/appointments"
              className="bg-white text-teal-950 hover:bg-slate-100 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition shadow-xs"
            >
              Book Appointment Now
            </Link>
            <Link
              href="/contact"
              className="bg-teal-900/60 hover:bg-teal-900 text-white font-semibold px-5 py-3 rounded-xl text-xs sm:text-sm border border-teal-700 transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
