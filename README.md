# Nan Da Wun Healthcare ERP & Clinic Management System

A comprehensive, production-ready Healthcare ERP and Clinic Management platform built with **Next.js (App Router)**, **Tailwind CSS**, and **Supabase (PostgreSQL with RLS)**. Designed for modern outpatient clinics, multidisciplinary medical centers, and doctor practices.

---

## 🚀 Core Features & Operational Modules

### 1. 🏥 Public Patient Portal & Website
- **Clinic Home (`/`)**: Trust hero, department highlights, physician roster, patient testimonials, and emergency advice.
- **Doctor Directory (`/doctors`)**: Specialist profiles, credentials, clinical bios, consultation schedules, and direct booking links.
- **Appointment Booking (`/appointments`)**: Interactive self-service booking with doctor selection, date/time slot validation, and instant queue token allocation.
- **Patient Self-Service Portal (`/patient-portal`)**: Real-time queue tracker by phone or token ID (`A-01`), displaying current status, assigned doctor room, and digital prescription history.
- **Health Knowledge Base (`/knowledge`)**: 10+ comprehensive Burmese and English clinical articles with category filtering and an authorized physician publishing portal.
- **Emergency & Inquiries (`/contact`)**: Emergency desk hotlines, operating hours, interactive map location, and inquiry submission.

### 2. 📺 Waiting Room Live Queue Display (`/queue`)
- **Kiosk / Lobby TV Screen Mode**: High-contrast, dark aesthetic optimized for waiting lobby wall-mounted TV screens.
- **Live Room Calling**: Shows current token numbers being served per consultation room (e.g. `Room 101 - Dr. Sarah Jenkins - Now Calling #A-01`).
- **Next-in-Line Ticker**: Displays upcoming token numbers in the waiting line.
- **Auditory Chime**: Synthesized dual-tone hospital chime using Web Audio API on token calls.
- **Auto-Sync**: 5-second polling interval with fullscreen toggle.

### 3. 💼 Executive Clinic Operations Hub (`/admin`)
- **Dashboard Overview**: Key performance indicators: Today's patient volume, collected revenue (MMK), pending billings, active consultation rooms, and low-stock alerts.
- **Appointment Desk**: Filter appointments by status (`Pending`, `Confirmed`, `In Consultation`, `Completed`, `Cancelled`), date, or doctor. 1-click status transitions, token assignment, room routing, and walk-in booking.
- **Electronic Medical Records (EMR)**:
  - Master patient directory with Hospital Numbers (`HN-2026-xxx`), blood types, allergies, and chronic condition tags.
  - Clinical Consultation Note builder with vitals calculation (Blood Pressure, Heart Rate, Temp, SpO2, Weight, Height, and automatic BMI).
  - Chief complaints, physician impressions, diagnosis, and follow-up scheduler.
- **e-Prescription & Pharmacy Dispensary Counter**:
  - Digital prescription issuer linked directly to clinical consultation notes.
  - 1-click prescription dispensing that automatically deducts stock from medicine inventory.
  - Printable official Rx prescription slip with clinic header, Rx watermark, medication frequency instructions, and doctor signature block.
- **Medicine & Stock Inventory**:
  - Drug catalog (Generic, Brand, Dosage Form, Strength, Unit Price, Cost Price, Batch Number, Expiry Date).
  - Reorder thresholds with automatic low-stock warnings and quick restock actions (`+10`, `+50`).
- **Cashier POS & Invoicing**:
  - Consolidated billing: consultation fee + prescribed medicines + diagnostic/lab fees + procedures.
  - Multi-payment support: Cash, **KBZPay (KPay)**, **WavePay**, and debit/credit cards.
  - Printable patient thermal/A4 receipt with itemized charges, discounts, and cashier timestamp.

---

## 🛡️ Security & Row Level Security (RLS)

- **Database Row Level Security (RLS)**: Enforced via PostgreSQL in [`supabase_schema.sql`](./supabase_schema.sql). Full schemas and access rules for `patients`, `emr_records`, `medicines`, `prescriptions`, `invoices`, and `appointments`.
- **Zero-Trust Fallback**: Complete in-memory/demo store fallback ensures the entire ERP runs smoothly in local preview without requiring external database connections immediately.
- **Server-Side Strict Validation**: Protected with Zod schemas against malformed payloads and prototype pollution.
- **Anti-XSS Sanitization**: Input sanitization prevents Stored and Reflected Cross-Site Scripting.
- **IP Rate Limiting**: Prevents automated spam bots and denial-of-service attempts.

---

## 📦 Getting Started

### 1. Install Dependencies & Run Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Connect Supabase (Optional for Persistent Cloud DB)
1. Run [`supabase_schema.sql`](./supabase_schema.sql) in your Supabase SQL Editor.
2. Add your credentials to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   DOCTOR_SECRET_PIN=doctor1234
   ```

### 3. Production Build
```bash
npm run build
npm start
```
