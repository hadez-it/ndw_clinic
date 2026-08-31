import { z } from 'zod';

// Appointment Validation Schema
export const appointmentSchema = z.object({
  patientName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name contains invalid characters'),
  patientEmail: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(150, 'Email cannot exceed 150 characters'),
  patientPhone: z
    .string()
    .trim()
    .min(7, 'Phone number must be at least 7 characters')
    .max(20, 'Phone number cannot exceed 20 characters')
    .regex(/^[0-9+()\s-]+$/, 'Invalid phone number format'),
  doctorId: z.string().uuid().or(z.string().min(1)),
  doctorName: z.string().trim().min(2).max(100),
  appointmentDate: z.string().refine((val) => {
    const selected = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !isNaN(selected.getTime()) && selected >= today;
  }, 'Appointment date must be today or in the future'),
  appointmentTime: z.string().min(1, 'Please select a time slot'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional().default(''),
});

// Doctor Topic Publishing Schema
export const topicSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(160, 'Title cannot exceed 160 characters'),
  category: z.string().trim().min(2).max(50),
  authorName: z.string().trim().min(2).max(100),
  authorPin: z.string().min(4, 'Doctor PIN required'),
  excerpt: z
    .string()
    .trim()
    .min(10, 'Excerpt must be at least 10 characters')
    .max(300, 'Excerpt cannot exceed 300 characters'),
  content: z
    .string()
    .trim()
    .min(30, 'Content must be at least 30 characters')
    .max(10000, 'Content exceeds character limit'),
});

// Contact Us Validation Schema
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().email('Invalid email address').max(150),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+()\s-]*$/, 'Invalid phone format')
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .trim()
    .min(3, 'Subject must be at least 3 characters')
    .max(150, 'Subject cannot exceed 150 characters'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message cannot exceed 2000 characters'),
});

// Minimal In-Memory / Local Fallback Store when Supabase credentials are not connected yet
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  bio: string;
  avatarUrl: string;
  availableDays: string[];
}

export interface HealthTopic {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  authorName: string;
  createdAt: string;
}

export const initialDoctors: Doctor[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Cardiologist',
    qualification: 'MD, FACC - Harvard Medical School',
    experienceYears: 14,
    bio: 'Specializing in preventative cardiovascular medicine, blood pressure control, and heart wellness.',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Dr. Marcus Vance',
    specialty: 'Pediatrician',
    qualification: 'MD, FAAP - Johns Hopkins University',
    experienceYears: 10,
    bio: 'Comprehensive child development, immunizations, and caring pediatric support from infancy through teens.',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Dr. Elena Rostova',
    specialty: 'Endocrinology & Internal Medicine',
    qualification: 'MD, PhD - Stanford University',
    experienceYears: 12,
    bio: 'Authority in hormonal balance, thyroid health, and modern diabetes and metabolic longevity.',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813596-7494f6990470?auto=format&fit=crop&q=80&w=400',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Dr. Alexander Patel',
    specialty: 'Orthopedic Specialist',
    qualification: 'MS, FRCS - Oxford University',
    experienceYears: 16,
    bio: 'Joint preservation, sports medicine, spine posture management, and non-surgical orthopedic healing.',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    availableDays: ['Wednesday', 'Thursday', 'Friday'],
  },
];

export const initialTopics: HealthTopic[] = [
  {
    id: 'topic-1',
    title: '5 Preventative Habits for Lifelong Cardiovascular Health',
    slug: 'preventative-habits-cardiovascular-health',
    category: 'Cardiology',
    excerpt: 'Small, daily lifestyle adjustments can lower cardiovascular risks by up to 80%. Here is what clinical cardiology recommends.',
    content: `Cardiovascular conditions are largely preventable when proactive habits are established early. Key pillars include:
    
1. **Regular Zone-2 Aerobic Training:** Aim for 150 minutes per week of brisk walking, swimming, or cycling to improve vascular compliance.
2. **Blood Pressure Awareness:** Keep blood pressure monitored; ideal resting rates hover around 120/80 mmHg.
3. **Nutrient-Dense Diet:** Focus on whole, unprocessed foods rich in polyphenols and monounsaturated fats.
4. **Sleep Restoration:** 7-8 hours of quality sleep reduces sympathetic nervous overdrive.
5. **Routine Screenings:** Annual lipid panels and arterial health checks help spot risk factors before symptoms manifest.`,
    authorName: 'Dr. Sarah Jenkins',
    createdAt: '2026-08-15',
  },
  {
    id: 'topic-2',
    title: 'Managing Blood Glucose: Science-Backed Strategies for Longevity',
    slug: 'managing-blood-glucose-strategies',
    category: 'Endocrinology',
    excerpt: 'Understand glycemic variability, meal sequencing, and circadian habits to maintain stable energy and metabolic function.',
    content: `Maintaining steady insulin sensitivity protects vascular and neurological systems as we age.

- **Sequence Your Food:** Eating fiber and vegetables before carbohydrates blunts post-meal glucose spikes.
- **Post-Meal Movement:** A 10-minute walk after lunch and dinner stimulates muscular glucose uptake independent of insulin.
- **Hydration & Electrolytes:** Adequate hydration prevents false cortisol-driven glucose elevations.
- **Stress Modulation:** Chronic cortisol elevates fasting glucose; structured breathing and mindfulness yield measurable metabolic benefits.`,
    authorName: 'Dr. Elena Rostova',
    createdAt: '2026-08-20',
  },
  {
    id: 'topic-3',
    title: 'Protecting Joint Health as You Age: Motion is Lotion',
    slug: 'protecting-joint-health-aging',
    category: 'Orthopedics',
    excerpt: 'How low-impact resistance training, hydration, and posture mechanics preserve cartilage and daily flexibility.',
    content: `Cartilage tissue is avascular, meaning it relies on joint movement to circulate synovial fluid and receive nutrients.

- **Daily Movement Routine:** Simple dynamic stretches keep tendons elastic.
- **Resistance Training:** Strengthening muscles around the knee and hip relieves joint load.
- **Ergonomics:** Changing seated positions frequently throughout the workday prevents spinal stiffness.
- **Consultation:** Address persistent swelling or mechanical pain early to avoid joint degeneration.`,
    authorName: 'Dr. Alexander Patel',
    createdAt: '2026-08-26',
  },
];
