import Link from 'next/link';
import { ShieldCheck, HeartPulse, Clock, Award, ArrowRight, UserCheck, Stethoscope, CheckCircle2 } from 'lucide-react';
import { initialDoctors, initialTopics } from '@/lib/types';

export default function HomePage() {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-white to-slate-50 pt-10 pb-16 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-32 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Certified Clinical Excellence & Data Privacy</span>
              </div>
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Modern Healthcare, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
                  Rooted in Trust & Empathy
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect with world-class specialists in cardiology, pediatrics, endocrinology, and orthopedics. Book your visit effortlessly with instant digital confirmation.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  href="/appointments"
                  className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-teal-600/25 transition-all text-sm sm:text-base text-center"
                >
                  <span>Book Appointment Now</span>
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

              {/* Trust Indicators */}
              <div className="pt-6 sm:pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-2 sm:gap-4 text-center lg:text-left">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">15,000+</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Patients Treated</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">99.4%</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Satisfaction</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">100%</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">HIPAA Encrypted</p>
                </div>
              </div>
            </div>

            {/* Quick Consultation Badge Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 p-8 space-y-6 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                      <HeartPulse className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">ApexCare Assurance</h3>
                      <p className="text-xs text-slate-500">Same-Day Urgent Care Slots</p>
                    </div>
                  </div>
                  <span className="inline-flex px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Open Now
                  </span>
                </div>

                <div className="space-y-3.5 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <span>Board-certified physicians with 10+ years specialized experience.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <span>State-of-the-art diagnostic imaging and pathology on site.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <span>Zero data leaks: HIPAA-ready Row Level Security access controls.</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Emergency Desk Line</p>
                    <p className="text-base font-bold text-slate-900">(800) 555-0199</p>
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

      {/* Specialty Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Comprehensive Clinical Disciplines</h2>
          <p className="text-slate-600 text-sm">
            Our medical departments are designed around preventative wellness and advanced diagnostic treatments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Cardiology',
              desc: 'Advanced cardiac screenings, ECG, echocardiography, and vascular health plans.',
              icon: HeartPulse,
            },
            {
              title: 'Pediatrics',
              desc: 'Compassionate pediatric care, wellness milestones, and preventive immunizations.',
              icon: Stethoscope,
            },
            {
              title: 'Internal Medicine',
              desc: 'Holistic endocrinology, diabetes care, metabolic assessments, and thyroid therapies.',
              icon: Award,
            },
            {
              title: 'Orthopedics',
              desc: 'Joint preservation, athletic injury recovery, and non-surgical musculoskeletal healing.',
              icon: Clock,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Doctors Snapshot */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Specialists</h2>
            <p className="text-slate-600 text-sm mt-1">
              Experienced doctors dedicated to patient care and active clinical research.
            </p>
          </div>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:border-teal-300 transition-all flex flex-col"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={doc.avatarUrl}
                alt={doc.name}
                className="w-full h-48 object-cover object-top"
              />
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                    {doc.specialty}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{doc.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{doc.qualification}</p>
                  <p className="text-xs text-slate-600 mt-3 line-clamp-2">{doc.bio}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{doc.experienceYears}+ Years Exp.</span>
                  <Link
                    href={`/appointments?doctor=${encodeURIComponent(doc.id)}`}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-800"
                  >
                    Book Visit →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Health Knowledge Articles */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                Doctor-Curated Insights
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mt-1">Health Knowledge Base</h2>
              <p className="text-slate-600 text-sm mt-1">
                Evidence-based medical advice written directly by our clinic specialists.
              </p>
            </div>
            <Link
              href="/knowledge"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              <span>Explore Knowledge Hub</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {initialTopics.map((topic) => (
              <article
                key={topic.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full font-semibold bg-teal-50 text-teal-700">
                      {topic.category}
                    </span>
                    <span>{topic.createdAt}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug hover:text-teal-600 transition">
                    <Link href="/knowledge">{topic.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {topic.excerpt}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">By {topic.authorName}</span>
                  <Link href="/knowledge" className="font-semibold text-teal-600 hover:underline">
                    Read Article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Booking Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-700 to-teal-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 text-center lg:text-left">
            <h3 className="text-3xl font-extrabold tracking-tight">
              Ready to schedule your appointment?
            </h3>
            <p className="text-teal-100 text-sm max-w-xl">
              Select your preferred doctor, pick an available day, and receive your appointment confirmation in seconds. No waiting queues.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/appointments"
              className="bg-white text-teal-900 hover:bg-slate-100 font-bold px-6 py-3.5 rounded-xl text-sm transition shadow-md"
            >
              Book Appointment Now
            </Link>
            <Link
              href="/contact"
              className="bg-teal-800/80 hover:bg-teal-800 text-white font-semibold px-6 py-3.5 rounded-xl text-sm border border-teal-600 transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
