import { useSyncExternalStore } from 'react';

export type ClinicRole = 'owner' | 'doctor' | 'receptionist' | 'pharmacist' | 'cashier';

export interface ClinicUser {
  id: string;
  name: string;
  role: ClinicRole;
  username?: string;
  doctorId?: string;
  specialty?: string;
  email?: string;
  department?: string;
}

export interface DemoCredential {
  role: ClinicRole;
  roleLabel: string;
  badgeColor: string;
  identifier: string;
  password: string;
  description: string;
  permissionsSummary: string;
}

export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    role: 'owner',
    roleLabel: 'Clinic Owner / Executive',
    badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-200',
    identifier: 'admin',
    password: 'owner2026!',
    description: 'Executive overview, clinic financial metrics, audit control, and all module access.',
    permissionsSummary: 'Full administrative access: EMR, Appointments, Pharmacy, Cashier Billing, Financial reports.',
  },
  {
    role: 'doctor',
    roleLabel: 'Consulting Physician / Doctor',
    badgeColor: 'bg-teal-500/10 text-teal-700 border-teal-200',
    identifier: 'Dr. Sarah Jenkins',
    password: 'doctor1234',
    description: 'Patient consultations, vital signs calculation, EMR notes, Rx e-prescribing, queue calling.',
    permissionsSummary: 'Doctor clinical desk: Patient EMR, consultation records, prescription issuing, live queue caller.',
  },
  {
    role: 'receptionist',
    roleLabel: 'Receptionist / Front Desk',
    badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-200',
    identifier: 'reception',
    password: 'staff1234',
    description: 'Patient check-in, walk-in appointments, waiting queue token generation, patient registration.',
    permissionsSummary: 'Front desk operations: Appointment desk, patient intake directory, queue token issuance.',
  },
  {
    role: 'pharmacist',
    roleLabel: 'Chief Pharmacist / Dispensary',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    identifier: 'pharmacist',
    password: 'pharma1234',
    description: 'Pharmacy dispensary, prescription fulfillment, drug inventory, low stock alert monitoring.',
    permissionsSummary: 'Dispensary counter: Prescription dispensing, drug stock inventory, restock logs.',
  },
  {
    role: 'cashier',
    roleLabel: 'Cashier / Billing Desk',
    badgeColor: 'bg-purple-500/10 text-purple-700 border-purple-200',
    identifier: 'cashier',
    password: 'cashier1234',
    description: 'Patient billing POS, itemized invoice creation, multi-payment processing (Cash, KPay, WavePay).',
    permissionsSummary: 'Cashier counter: Invoice settlement, receipt printing, payment reconciliation.',
  },
];

export const ROLE_CONFIG: Record<
  ClinicRole,
  {
    label: string;
    shortLabel: string;
    badgeClass: string;
    defaultTab: 'overview' | 'appointments' | 'patients' | 'pharmacy' | 'billing';
    allowedTabs: Array<'overview' | 'appointments' | 'patients' | 'pharmacy' | 'billing'>;
  }
> = {
  owner: {
    label: 'Clinic Owner & Executive',
    shortLabel: 'Owner / Admin',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    defaultTab: 'overview',
    allowedTabs: ['overview', 'appointments', 'patients', 'pharmacy', 'billing'],
  },
  doctor: {
    label: 'Consulting Physician',
    shortLabel: 'Doctor',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
    defaultTab: 'patients',
    allowedTabs: ['overview', 'appointments', 'patients', 'pharmacy'],
  },
  receptionist: {
    label: 'Front Desk & Reception',
    shortLabel: 'Reception',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    defaultTab: 'appointments',
    allowedTabs: ['overview', 'appointments', 'patients'],
  },
  pharmacist: {
    label: 'Pharmacy Dispensary',
    shortLabel: 'Pharmacist',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    defaultTab: 'pharmacy',
    allowedTabs: ['overview', 'pharmacy', 'patients'],
  },
  cashier: {
    label: 'Cashier & Billing Desk',
    shortLabel: 'Cashier',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    defaultTab: 'billing',
    allowedTabs: ['overview', 'billing', 'appointments'],
  },
};

const AUTH_TOKEN_KEY = 'clinic_auth_token';
const AUTH_ROLE_KEY = 'clinic_user_role';
const AUTH_USER_KEY = 'clinic_user_data';
const AUTH_CHANGE_EVENT = 'clinic-auth-change';

let cachedUserSnapshot: ClinicUser | null = null;
let snapshotInitialized = false;

function loadUserSnapshot(): ClinicUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ClinicUser;
  } catch {
    return null;
  }
}

export function getStoredUser(): ClinicUser | null {
  if (!snapshotInitialized) {
    cachedUserSnapshot = loadUserSnapshot();
    snapshotInitialized = true;
  }
  return cachedUserSnapshot;
}

export function getStoredRole(): ClinicRole | null {
  if (typeof window === 'undefined') return null;
  return (localStorage.getItem(AUTH_ROLE_KEY) as ClinicRole) || null;
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredSession(user: ClinicUser, token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_ROLE_KEY, user.role);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

    cachedUserSnapshot = user;
    snapshotInitialized = true;

    // Set cookie for server-side / proxy verification (30-day expiration)
    const maxAge = 30 * 24 * 60 * 60;
    const cookiePayload = encodeURIComponent(
      JSON.stringify({
        id: user.id,
        role: user.role,
        name: user.name,
        token,
      })
    );
    document.cookie = `clinic_auth=${cookiePayload}; path=/; max-age=${maxAge}; SameSite=Lax`;

    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: user }));
  } catch (err) {
    console.error('Failed to set stored auth session:', err);
  }
}

export function clearStoredSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_ROLE_KEY);
    localStorage.removeItem(AUTH_USER_KEY);

    cachedUserSnapshot = null;
    snapshotInitialized = true;

    // Expire the cookie
    document.cookie = 'clinic_auth=; path=/; max-age=0; SameSite=Lax';

    // Optional call to server logout
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});

    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: null }));
  } catch (err) {
    console.error('Failed to clear auth session:', err);
  }
}

export function subscribeAuthChange(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = () => {
    cachedUserSnapshot = loadUserSnapshot();
    callback();
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === AUTH_USER_KEY || e.key === AUTH_ROLE_KEY || e.key === null) {
      cachedUserSnapshot = loadUserSnapshot();
      callback();
    }
  };

  window.addEventListener(AUTH_CHANGE_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorage);
  };
}

export function useClinicAuth(): ClinicUser | null {
  return useSyncExternalStore(
    subscribeAuthChange,
    getStoredUser,
    () => null
  );
}

export function createDemoUser(demo: DemoCredential): ClinicUser {
  return {
    id: `user-${demo.role}-demo`,
    name: demo.role === 'doctor' ? demo.identifier : demo.roleLabel,
    role: demo.role,
    username: demo.identifier,
    department: demo.roleLabel,
  };
}
