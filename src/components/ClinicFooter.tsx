'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Activity, Phone, Clock, MapPin, Mail } from 'lucide-react';

// Hidden on ERP screens (/admin, /patient-portal) — landing + public pages keep it.
const HIDDEN_PREFIXES = ['/admin', '/patient-portal'];

export function ClinicFooter() {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  return (
    <footer className="w-full max-w-[100vw] bg-slate-950 text-slate-300 border-t border-slate-800/80 mt-16 sm:mt-24 no-print overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 text-sm">
        {/* Brand Column */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-500/20">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Nan Da Wun Healthcare</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Patient-first multidisciplinary medical clinic. Uniting specialized clinical expertise, proactive preventative care, and secure digital records for every family.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-teal-300 text-xs font-medium">
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            <span>Row Level Security Protected</span>
          </div>
        </div>

        {/* Quick Portal Navigation */}
        <div>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Patient Portal</h3>
          <ul className="space-y-2.5 text-slate-400 text-xs font-medium">
            <li>
              <Link href="/" className="hover:text-teal-300 transition-colors flex items-center gap-1">
                <span>Clinic Home</span>
              </Link>
            </li>
            <li>
              <Link href="/doctors" className="hover:text-teal-300 transition-colors flex items-center gap-1">
                <span>Specialist Physicians</span>
              </Link>
            </li>
            <li>
              <Link href="/appointments" className="hover:text-teal-300 transition-colors flex items-center gap-1">
                <span>Book Clinical Appointment</span>
              </Link>
            </li>
            <li>
              <Link href="/patient-portal" className="hover:text-teal-300 transition-colors flex items-center gap-1">
                <span>My Health Records & Rx</span>
              </Link>
            </li>
            <li>
              <Link href="/knowledge" className="hover:text-teal-300 transition-colors flex items-center gap-1">
                <span>Doctor Health Articles</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Specialties & Clinical Departments */}
        <div>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Clinical Services</h3>
          <ul className="space-y-2.5 text-slate-400 text-xs">
            <li>Cardiovascular Health & Diagnostics</li>
            <li>Pediatric & Adolescent Medicine</li>
            <li>Internal Medicine & Endocrinology</li>
            <li>Orthopedics & Joint Rehabilitation</li>
            <li>On-Site Pharmacy & Prescriptions</li>
            <li>Emergency Triage Support</li>
          </ul>
        </div>

        {/* Contact & Hours */}
        <div>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Contact & Location</h3>
          <div className="space-y-3 text-slate-400 text-xs">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>742 Evergreen Medical Way, Suite 400</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-400 shrink-0" />
              <a href="tel:+18005550199" className="hover:text-teal-300 transition-colors font-medium">
                (800) 555-0199
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-400 shrink-0" />
              <span>care@nandawunhealthcare.com</span>
            </p>
            <p className="flex items-start gap-2 pt-1">
              <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>Mon to Fri: 8:00 AM to 8:00 PM<br />Saturday: 9:00 AM to 4:00 PM</span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Nan Da Wun Healthcare Specialty Clinic. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/contact" className="hover:text-slate-400 transition-colors">Emergency Desk</Link>
            <span>&bull;</span>
            <Link href="/login" className="hover:text-slate-400 transition-colors">Staff ERP Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
