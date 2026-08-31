import Link from 'next/link';
import { Shield, Activity, Phone } from 'lucide-react';
import { ClinicNavbar } from '@/components/ClinicNavbar';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased selection:bg-teal-500 selection:text-white">
        {/* Top Emergency & Trust Banner */}
        <div className="bg-teal-950 text-teal-100 text-xs px-3 sm:px-4 py-2 border-b border-teal-900">
          <div className="max-w-7xl mx-auto flex flex-col xs:flex-row items-center justify-between gap-1.5 sm:gap-4 text-center xs:text-left">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>Clinic: Mon - Sat (8am - 8pm)</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
              <span className="hidden sm:flex items-center gap-1 text-teal-300">
                <Shield className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>HIPAA Compliant</span>
              </span>
              <a href="tel:+18005550199" className="hover:text-white font-medium flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>(800) 555-0199</span>
              </a>
            </div>
          </div>
        </div>

        {/* Responsive Navbar */}
        <ClinicNavbar />

        {/* Main Content Area */}
        <main className="flex-1">{children}</main>

        {/* Global Clinic Footer */}
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-white">ApexHealth Clinic</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Patient-first multidisciplinary medical care. Combining clinical expertise, preventative medicine, and secure digital records.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-teal-900/40 border border-teal-700/50 text-teal-300 text-xs">
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
