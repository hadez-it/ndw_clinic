import Link from 'next/link';
import { Shield, Activity, Phone, Calendar, BookOpen, Users, Mail } from 'lucide-react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased selection:bg-teal-500 selection:text-white">
        {/* Top Emergency & Trust Banner */}
        <div className="bg-slate-900 text-slate-300 text-xs px-4 py-2 flex flex-wrap justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Clinic Hours: Mon - Sat (8:00 AM - 8:00 PM)</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              <span>HIPAA Compliant & End-to-End Encrypted</span>
            </span>
            <a href="tel:+18005550199" className="hover:text-white font-medium flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>(800) 555-0199</span>
            </a>
          </div>
        </div>

        {/* Main Navigation Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Apex<span className="text-teal-600">Health</span>
                </span>
                <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Care & Specialty Clinic
                </span>
              </div>
            </Link>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
              <Link href="/" className="hover:text-teal-600 transition-colors">
                Home
              </Link>
              <Link href="/doctors" className="hover:text-teal-600 transition-colors flex items-center gap-1">
                <Users className="w-4 h-4" /> Doctors
              </Link>
              <Link href="/knowledge" className="hover:text-teal-600 transition-colors flex items-center gap-1">
                <BookOpen className="w-4 h-4" /> Health Knowledge
              </Link>
              <Link href="/contact" className="hover:text-teal-600 transition-colors flex items-center gap-1">
                <Mail className="w-4 h-4" /> Contact Us
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/appointments"
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm shadow-teal-600/30 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1">{children}</main>

        {/* Global Clinic Footer */}
        <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-white">ApexHealth Clinic</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Patient-first multidisciplinary medical care. Combining clinical expertise, preventative medicine, and secure digital records.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-teal-950/60 border border-teal-800/60 text-teal-300 text-xs">
                <Shield className="w-3.5 h-3.5" />
                <span>Secure Vercel + Supabase Stack</span>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Quick Navigation</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li><Link href="/" className="hover:text-white transition">Clinic Home</Link></li>
                <li><Link href="/doctors" className="hover:text-white transition">Our Medical Team</Link></li>
                <li><Link href="/appointments" className="hover:text-white transition">Book Visit</Link></li>
                <li><Link href="/knowledge" className="hover:text-white transition">Doctor Insights & Articles</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Emergency & Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Medical Specialties</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li>Cardiovascular Health & Diagnostics</li>
                <li>Pediatric & Adolescent Care</li>
                <li>Internal Medicine & Endocrinology</li>
                <li>Orthopedics & Joint Rehabilitation</li>
                <li>Preventative Health Screenings</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Clinic Information</h4>
              <div className="space-y-2 text-slate-400 text-xs">
                <p>📍 742 Evergreen Medical Way, Suite 400</p>
                <p>📞 Appointment Hotline: (800) 555-0199</p>
                <p>✉️ Desk: support@apexhealthclinic.com</p>
                <p>⏰ Mon - Fri: 8am - 8pm | Sat: 9am - 4pm</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} ApexHealth Clinic. All rights reserved. Encrypted with Row Level Security and zero-trust perimeter defense.
          </div>
        </footer>
      </body>
    </html>
  );
}
