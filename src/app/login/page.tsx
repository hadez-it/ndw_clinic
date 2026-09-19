'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Stethoscope,
  Building2,
  Calendar,
  Pill,
  CreditCard,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Info,
} from 'lucide-react';
import { ClinicRole, DEMO_CREDENTIALS, ROLE_CONFIG, setStoredSession, getStoredUser } from '@/lib/auth';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect') || '';

  const [role, setRole] = useState<ClinicRole>('owner');
  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('owner2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [existingUser, setExistingUser] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setExistingUser(user.name);
    }
  }, []);

  const handleRoleChange = (selectedRole: ClinicRole) => {
    setRole(selectedRole);
    setError(null);
    setSuccess(null);

    const demo = DEMO_CREDENTIALS.find((d) => d.role === selectedRole);
    if (demo) {
      setIdentifier(demo.identifier);
      setPassword(demo.password);
    }
  };

  const handleQuickDemoSelect = (demo: (typeof DEMO_CREDENTIALS)[number]) => {
    setRole(demo.role);
    setIdentifier(demo.identifier);
    setPassword(demo.password);
    setError(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          identifier,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ? data.details.join(', ') : data.error || 'Authentication failed');
      }

      setSuccess(data.message || `Signed in as ${data.user.name}`);
      setStoredSession(data.user, data.token);

      setTimeout(() => {
        if (redirectParam && redirectParam.startsWith('/')) {
          router.push(redirectParam);
        } else {
          router.push('/admin');
        }
      }, 600);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error completing login.');
      }
    } finally {
      setLoading(false);
    }
  };

  const currentRoleMeta = DEMO_CREDENTIALS.find((d) => d.role === role);

  const rolesList: { role: ClinicRole; label: string; icon: typeof Stethoscope }[] = [
    { role: 'owner', label: 'Clinic Owner', icon: Building2 },
    { role: 'doctor', label: 'Doctor', icon: Stethoscope },
    { role: 'receptionist', label: 'Reception', icon: Calendar },
    { role: 'pharmacist', label: 'Pharmacy', icon: Pill },
    { role: 'cashier', label: 'Cashier', icon: CreditCard },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>Nan Da Wun Clinic Staff Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Clinic ERP and Staff Sign In
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Secure authenticated access for physicians, clinical triage, reception, dispensary, and billing cashiers.
        </p>

        {existingUser && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs mt-2 border border-slate-200">
            <span>Currently signed in as <strong>{existingUser}</strong></span>
            <Link href="/admin" className="text-teal-600 font-semibold hover:underline">
              Go to ERP &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-5">
        {/* Role Selector Grid */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Select Your Clinic Staff Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {rolesList.map((item) => {
              const Icon = item.icon;
              const isSelected = role === item.role;
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleRoleChange(item.role)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition border text-left cursor-pointer ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-teal-600'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Role Access Description */}
        {currentRoleMeta && (
          <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-xl flex items-start gap-2.5 text-xs text-teal-900">
            <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-teal-900">{currentRoleMeta.roleLabel}</p>
              <p className="text-[11px] text-teal-700 mt-0.5 leading-relaxed">
                {currentRoleMeta.permissionsSummary}
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-slide-down">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold">Sign In Failed</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 animate-slide-down">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Authentication Successful</p>
              <p>{success}</p>
              <p className="text-[11px] text-emerald-600 mt-0.5">Redirecting to Clinic ERP command center...</p>
            </div>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span>
                {role === 'doctor'
                  ? 'Doctor Name / Medical ID'
                  : role === 'owner'
                  ? 'Owner Username'
                  : `${ROLE_CONFIG[role]?.shortLabel || 'Staff'} Username`}
              </span>
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={
                role === 'doctor'
                  ? 'e.g. Dr. Sarah Jenkins'
                  : role === 'owner'
                  ? 'admin'
                  : role
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:outline-none text-xs sm:text-sm text-slate-900 bg-slate-50 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-600" />
                <span>{role === 'doctor' ? 'Doctor Secret PIN' : 'Password / Passcode'}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3 h-3" /> Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" /> Show
                  </>
                )}
              </button>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={role === 'doctor' ? 'doctor1234' : '••••••••'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:outline-none text-xs sm:text-sm text-slate-900 bg-slate-50 focus:bg-white transition"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition shadow-xs cursor-pointer"
            >
              <span>{loading ? 'Verifying Credentials...' : `Sign In as ${ROLE_CONFIG[role]?.shortLabel}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* 1-Click Quick Demo Switcher */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Evaluator Accounts</span>
            </span>
            <span className="text-[10px] text-slate-400">Click to autofill</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DEMO_CREDENTIALS.map((demo) => (
              <button
                key={demo.role}
                type="button"
                onClick={() => handleQuickDemoSelect(demo)}
                className={`p-2 rounded-xl border text-left transition text-[11px] cursor-pointer ${
                  role === demo.role
                    ? 'border-teal-400 bg-teal-50/60 text-teal-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold truncate">{demo.roleLabel.split('/')[0]}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                  {demo.identifier}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Return to Public Site */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <Link href="/" className="text-xs text-teal-600 hover:underline">
            &larr; Return to Clinic Public Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto py-24 text-center text-slate-500 text-sm">
          Loading Staff Sign In...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
