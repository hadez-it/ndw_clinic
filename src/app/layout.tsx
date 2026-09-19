import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Shield, Activity, Phone, Clock, MapPin, Mail, ArrowUpRight } from 'lucide-react';
import { ClinicNavbar } from '@/components/ClinicNavbar';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Nan Da Wun Healthcare | Specialty Clinic & Clinical ERP',
  description: 'Patient-first multidisciplinary medical care, verified doctor appointments, live waiting queue, and HIPAA-ready digital health records.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full overflow-x-hidden">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="flex min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden flex-col bg-slate-50 text-slate-900 antialiased selection:bg-teal-600 selection:text-white">
        {/* Top Emergency & Clinical Hours Banner */}
        <div className="w-full bg-slate-950 text-slate-200 text-xs px-3 sm:px-4 py-1.5 sm:py-2 border-b border-slate-800">
          <div className="w-full max-w-7xl mx-auto flex flex-row items-center justify-between gap-2 text-left">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="font-medium text-slate-300 text-[11px] sm:text-xs truncate">
                Mon to Sat: 8:00 AM to 8:00 PM
              </span>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs shrink-0">
              <span className="hidden sm:flex items-center gap-1.5 text-teal-300 font-medium">
                <Shield className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>HIPAA-Ready Certified</span>
              </span>
              <a
                href="tel:+18005550199"
                className="text-teal-300 hover:text-teal-200 font-semibold flex items-center gap-1 transition-colors"
                title="Immediate Clinic Desk Telephone"
              >
                <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-400 shrink-0" />
                <span>(800) 555-0199</span>
              </a>
            </div>
          </div>
        </div>

        {/* Global Navigation Bar */}
        <ClinicNavbar />

        {/* Main Application Content */}
        <main className="flex-1 w-full max-w-[100vw] min-h-0 overflow-x-hidden flex flex-col">{children}</main>

        {/* Global Clinic Footer */}
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
                  <Link href="/queue" className="hover:text-teal-300 transition-colors flex items-center gap-1">
                    <span>Waiting Room Queue TV</span>
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
      </body>
    </html>
  );
}
