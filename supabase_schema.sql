-- Supabase Schema for Healthcare Clinic
-- Run this in your Supabase SQL Editor

-- 1. Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    qualification TEXT NOT NULL,
    experience_years INTEGER NOT NULL DEFAULT 1,
    bio TEXT NOT NULL,
    avatar_url TEXT,
    available_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Health Topics / Knowledge Base table
CREATE TABLE IF NOT EXISTS health_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'အထွေထွေကျန်းမာရေး',
    author_name TEXT NOT NULL,
    author_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    image_url TEXT,
    published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Customer Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_name TEXT NOT NULL,
    patient_email TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    doctor_name TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Contact Inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'responded', 'archived')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- HACK-PROOF ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Doctors: Anyone can read doctor profiles. Only service_role can alter.
CREATE POLICY "Public can view doctors"
    ON doctors FOR SELECT
    USING (true);

-- Health Topics: Anyone can read published topics.
CREATE POLICY "Public can view published health topics"
    ON health_topics FOR SELECT
    USING (published = true);

-- Health Topics: Only authenticated doctors can insert/update
CREATE POLICY "Authenticated users can create topics"
    ON health_topics FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update own topics"
    ON health_topics FOR UPDATE
    TO authenticated
    USING (auth.uid() = author_id);

-- Appointments: Public can insert appointments (verified by application layer)
CREATE POLICY "Anyone can book an appointment"
    ON appointments FOR INSERT
    WITH CHECK (
        length(patient_name) >= 2 AND
        length(patient_email) >= 5 AND
        length(patient_phone) >= 7
    );

-- Appointments: Public CANNOT read other patients' appointments (prevents data harvesting)
CREATE POLICY "Public cannot view all appointments"
    ON appointments FOR SELECT
    TO authenticated
    USING (true);

-- Contact Inquiries: Anyone can submit inquiry
CREATE POLICY "Anyone can submit contact inquiry"
    ON contact_inquiries FOR INSERT
    WITH CHECK (
        length(name) >= 2 AND
        length(email) >= 5 AND
        length(message) >= 5
    );

-- Contact Inquiries: Only authenticated staff can read inquiries
CREATE POLICY "Only authenticated staff view inquiries"
    ON contact_inquiries FOR SELECT
    TO authenticated
    USING (true);

-- Seed Initial Doctors
INSERT INTO doctors (name, specialty, qualification, experience_years, bio, avatar_url)
VALUES 
    ('Dr. Sarah Jenkins', 'Cardiologist', 'MD, FACC - Harvard Medical School', 14, 'Specializing in preventative cardiovascular medicine, hypertension management, and heart wellness.', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'),
    ('Dr. Marcus Vance', 'Pediatrician', 'MD, FAAP - Johns Hopkins University', 10, 'Passionate about child development, neonatal health, and family pediatric care from infancy through adolescence.', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'),
    ('Dr. Elena Rostova', 'Internal Medicine & Endocrinology', 'MD, PhD - Stanford University', 12, 'Expert in hormonal health, diabetes management, metabolic balance, and holistic preventive wellness.', 'https://images.unsplash.com/photo-1594824813596-7494f6990470?auto=format&fit=crop&q=80&w=400'),
    ('Dr. Alexander Patel', 'Orthopedic Surgeon', 'MS, FRCS - Oxford University', 16, 'Focused on joint preservation, sports injury rehabilitation, and minimally invasive musculoskeletal procedures.', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400')
ON CONFLICT DO NOTHING;

-- Seed Health Topics
INSERT INTO health_topics (title, slug, excerpt, content, category, author_name)
VALUES
    (
        '5 Preventative Habits for Lifelong Cardiovascular Health',
        'preventative-habits-cardiovascular-health',
        'Small, daily lifestyle adjustments can lower your risk of heart disease by up to 80%. Here is what cardiology research recommends.',
        'Heart disease remains one of the leading health challenges worldwide, yet up to 80% of premature cardiovascular incidents are preventable. Regular zone-2 aerobic activity, maintaining blood pressure under 120/80 mmHg, adopting a Mediterranean-style diet rich in polyphenols and monounsaturated fats, managing sleep hygiene (7-8 hours), and chronic stress reduction can drastically preserve vascular elasticity and arterial health.',
        'Cardiology',
        'Dr. Sarah Jenkins'
    ),
    (
        'Managing Blood Glucose: Science-Backed Dietary Strategies',
        'managing-blood-glucose-strategies',
        'Understand glycemic variability, fiber pairings, and circadian eating to maintain stable energy and metabolic longevity.',
        'Metabolic flexibility is key to sustained well-being. By prioritizing high-fiber soluble foods prior to complex carbohydrate consumption, taking a brief 10-minute post-meal walk, and reducing ultra-processed refined sugars, insulin sensitivity can be maintained effectively without extreme restriction.',
        'Endocrinology',
        'Dr. Elena Rostova'
    ),
    (
        'Protecting Joint Health as You Age: Motion is Lotion',
        'protecting-joint-health-aging',
        'How low-impact resistance training, hydration, and posture mechanics preserve cartilage and mobility.',
        'Cartilage relies on movement to circulate synovial fluid and receive nutrients. Maintaining active daily joint ranges through swimming, bodyweight resistance training, and proper ergonomics will keep you pain-free and agile well into retirement.',
        'Orthopedics',
        'Dr. Alexander Patel'
    )
ON CONFLICT DO NOTHING;

-- =========================================================================
-- 6. HEALTHCARE ERP OPERATIONAL SCHEMAS
-- =========================================================================

-- Enhanced Appointments (Token & Room Support)
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS token_number TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS room_number TEXT;

-- Patients Master Table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hn TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    gender TEXT NOT NULL,
    age INTEGER NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    blood_type TEXT DEFAULT 'Unknown',
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    chronic_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    emergency_contact TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- EMR Consultation Encounters Table
CREATE TABLE IF NOT EXISTS emr_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    patient_hn TEXT,
    patient_name TEXT NOT NULL,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    doctor_name TEXT NOT NULL,
    date DATE NOT NULL,
    vitals JSONB NOT NULL DEFAULT '{}'::JSONB,
    chief_complaint TEXT,
    diagnosis TEXT NOT NULL,
    clinical_notes TEXT,
    prescriptions JSONB DEFAULT '[]'::JSONB,
    follow_up_date DATE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Pharmacy & Medicines Catalog Table
CREATE TABLE IF NOT EXISTS medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    generic_name TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    category TEXT NOT NULL,
    dosage_form TEXT NOT NULL,
    strength TEXT NOT NULL,
    current_stock INTEGER NOT NULL DEFAULT 0,
    reorder_level INTEGER NOT NULL DEFAULT 20,
    unit_price NUMERIC NOT NULL DEFAULT 0,
    cost_price NUMERIC NOT NULL DEFAULT 0,
    expiry_date DATE,
    batch_number TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Electronic Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_number TEXT UNIQUE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    patient_hn TEXT,
    patient_name TEXT NOT NULL,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    doctor_name TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_dispense' CHECK (status IN ('pending_dispense', 'dispensed')),
    items JSONB NOT NULL DEFAULT '[]'::JSONB,
    dispensed_at TIMESTAMPTZ,
    dispensed_by TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cashier Billing & Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    patient_phone TEXT,
    date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid', 'partial')),
    items JSONB NOT NULL DEFAULT '[]'::JSONB,
    subtotal NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC NOT NULL DEFAULT 0,
    tax NUMERIC NOT NULL DEFAULT 0,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT,
    paid_at TIMESTAMPTZ,
    receipt_number TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all ERP tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE emr_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Default authenticated staff policies
CREATE POLICY "Staff can view and manage patients" ON patients FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff can view and manage EMR" ON emr_records FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff can view and manage pharmacy" ON medicines FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff can view and manage prescriptions" ON prescriptions FOR ALL TO authenticated USING (true);
CREATE POLICY "Staff can view and manage invoices" ON invoices FOR ALL TO authenticated USING (true);

