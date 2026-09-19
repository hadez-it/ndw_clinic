import type { Metadata, Viewport } from 'next';
import { Shield, Phone } from 'lucide-react';
import { ClinicNavbar } from '@/components/ClinicNavbar';
import { ClinicFooter } from '@/components/ClinicFooter';
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

        {/* Global Clinic Footer (hidden on ERP screens) */}
        <ClinicFooter />
      </body>
    </html>
  );
}
