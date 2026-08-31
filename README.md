# ApexHealth Clinic Web Application

Production-ready healthcare web application built with **Next.js (App Router)**, **Tailwind CSS**, and **Supabase**. Ready for 1-click deployment on **Vercel**.

---

## 🚀 Features & Pages

1. **Landing Page (`/`)**: High-trust hero, clinical departments, doctor spotlights, patient metrics, and direct booking CTA.
2. **About Doctors Page (`/doctors`)**: Comprehensive board-certified physician profiles, qualifications, clinical bios, and consultation schedules.
3. **Customer Appointments (`/appointments`)**: Interactive booking form with doctor picker, date/time slot selection, and confirmation.
4. **Health Knowledge Base (`/knowledge`)**: Medical insights and preventative health articles with filter by category.
   - **Doctor Publishing Portal**: Doctors can publish new health topics with PIN verification directly from the UI.
5. **Contact Us (`/contact`)**: Emergency advisory, clinic hours, phone numbers, map address, and inquiry submission.

---

## 🛡️ Hack-Proof & Security Hardening

- **Database Row Level Security (RLS)**: Enforced via PostgreSQL in [`supabase_schema.sql`](file:///home/phyo_thiha1001/healthcare_erp/supabase_schema.sql). Public users can only insert appointments and view published health topics; private records cannot be harvested.
- **Server-Side Strict Validation**: All forms protected with `zod` schemas against malformed payloads and prototype pollution.
- **Anti-XSS Sanitization**: Input sanitization prevents Stored and Reflected Cross-Site Scripting.
- **IP Rate Limiting**: Prevents automated spam bots and denial-of-service attempts on appointments and inquiry forms.
- **Zero-Trust Privileged Operations**: Sensitive database actions only run on the server using isolated environment variables.
- **HTTP Security Headers**: Automated HSTS (`max-age=63072000`), `X-Frame-Options: DENY` (anti-clickjacking), `X-Content-Type-Options: nosniff`, and strict `Permissions-Policy`.

---

## 📦 Supabase Integration Setup

1. Log in to [Supabase](https://supabase.com) and create a new project (or use the Vercel Marketplace Supabase integration).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy and run the contents of [`supabase_schema.sql`](file:///home/phyo_thiha1001/healthcare_erp/supabase_schema.sql).
4. Copy your project credentials into `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
   DOCTOR_SECRET_PIN=doctor1234
   ```

---

## ⚡ Deployment to Vercel

1. Push this repository to GitHub or GitLab:
   ```bash
   git add .
   git commit -m "feat: complete secure healthcare clinic web app"
   git push
   ```
2. In Vercel, click **Add New Project** and select this repository.
3. Add the Supabase integration directly from the Vercel Marketplace, or set the environment variables in **Project Settings -> Environment Variables**.
4. Click **Deploy**.
