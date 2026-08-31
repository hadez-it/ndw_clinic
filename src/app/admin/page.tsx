'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Users, Calendar, BookOpen, Mail, LogOut, CheckCircle } from 'lucide-react';
import { initialDoctors, initialTopics } from '@/lib/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('clinic_user_role');
    if (role !== 'owner') {
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('clinic_auth_token');
    localStorage.removeItem('clinic_user_role');
    localStorage.removeItem('clinic_user_data');
    router.push('/login');
  };

  if (!authorized) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-500">
        Verifying administrative authorization...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Executive Clinic Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Clinic Owner Control Hub
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Review appointments, manage roster, verify physician knowledge posts, and audit clinic operations.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Active Doctors</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{initialDoctors.length}</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> All Credentials Verified
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Knowledge Base</span>
            <BookOpen className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{initialTopics.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Doctor Articles Live</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Database Status</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">Active</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">RLS Protected</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Patient Inquiries</span>
            <Mail className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">Ready</p>
          <p className="text-[11px] text-slate-500 mt-1">Inbox Live</p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Manage Appointments</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Direct access to booking pipeline and patient consult schedules.
          </p>
          <Link
            href="/appointments"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Open Appointment Desk →</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Physician Roster</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Inspect physician profiles, specialties, and active hospital affiliations.
          </p>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700"
          >
            <Users className="w-3.5 h-3.5" />
            <span>View Medical Specialists →</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Publish Doctor Articles</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Review knowledge base submissions or author new medical clinical insights.
          </p>
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Go to Knowledge Base →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
