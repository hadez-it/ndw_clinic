'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  Calendar,
  Menu,
  X,
  Users,
  BookOpen,
  Home,
  Tv,
  FileSearch,
  LayoutDashboard,
  LogIn,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { clearStoredSession, ROLE_CONFIG, useClinicAuth } from '@/lib/auth';

export function ClinicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentUser = useClinicAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearStoredSession();
    router.push('/login');
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/doctors', label: 'Doctors', icon: Users },
    { href: '/queue', label: 'Queue TV', icon: Tv, highlight: true },
    { href: '/patient-portal', label: 'Patient Portal', icon: FileSearch },
    { href: '/knowledge', label: 'Health Topics', icon: BookOpen },
    { href: '/admin', label: 'Clinic ERP', icon: LayoutDashboard },
  ];

  return (
    <header className="w-full max-w-[100vw] sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-[68px] flex items-center justify-between gap-2 min-w-0">
        {/* Clinic Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0 min-w-0" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-600/25 group-hover:bg-teal-700 transition-colors shrink-0">
            <Activity className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 leading-tight truncate">
              Nan Da Wun <span className="text-teal-600">Healthcare</span>
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider hidden sm:block">
              Specialty Clinic & ERP
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-slate-600">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-teal-700 bg-teal-50/80 font-bold'
                    : item.highlight
                    ? 'text-teal-700 bg-teal-50/40 hover:bg-teal-50 hover:text-teal-800'
                    : 'hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0 ml-0.5" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Auth & Primary Action (No overflow on mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2 bg-slate-100/80 border border-slate-200/80 rounded-xl px-2.5 py-1.5 text-xs">
              <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-left pr-1">
                <span className="font-semibold text-slate-800 leading-tight max-w-[110px] truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-teal-700 font-medium">
                  {ROLE_CONFIG[currentUser.role]?.shortLabel || currentUser.role}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Sign Out"
                className="p-1 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-md transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 text-slate-700 hover:text-teal-700 hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold transition"
            >
              <LogIn className="w-3.5 h-3.5 text-teal-600" />
              <span>Staff Sign In</span>
            </Link>
          )}

          <Link
            href="/appointments"
            className="inline-flex items-center gap-1 sm:gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors shrink-0"
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Book Visit</span>
          </Link>

          {/* Hamburger button for mobile / tablet */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 py-4 space-y-2 shadow-lg transition-all animate-slide-down">
          {currentUser && (
            <div className="flex items-center justify-between p-3 bg-teal-50/80 border border-teal-200/80 rounded-xl mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-900">{currentUser.name}</div>
                  <div className="text-[11px] text-teal-700 font-medium">
                    {ROLE_CONFIG[currentUser.role]?.label || currentUser.role}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}

          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live</span>
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {!currentUser && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold text-center"
              >
                <LogIn className="w-4 h-4 text-teal-600" />
                <span>Staff Portal Sign In</span>
              </Link>
            )}

            <Link
              href="/appointments"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold text-center shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Book An Appointment</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
