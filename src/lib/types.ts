import { z } from 'zod';

// Appointment Validation Schema
export const appointmentSchema = z.object({
  patientName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\u1000-\u109F\s.'-]+$/, 'Name contains invalid characters'),
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
    .min(3, 'Title must be at least 3 characters')
    .max(250, 'Title cannot exceed 250 characters'),
  category: z.string().trim().min(2).max(50),
  authorName: z.string().trim().min(2).max(100),
  authorPin: z.string().min(4, 'Doctor PIN required'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  excerpt: z
    .string()
    .trim()
    .min(10, 'Excerpt must be at least 10 characters')
    .max(500, 'Excerpt cannot exceed 500 characters'),
  content: z
    .string()
    .trim()
    .min(20, 'Content must be at least 20 characters')
    .max(15000, 'Content exceeds character limit'),
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
  imageUrl?: string;
  createdAt: string;
}

export const initialDoctors: Doctor[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Cardiologist (နှလုံးအထူးကု)',
    qualification: 'MD, FACC - Harvard Medical School',
    experienceYears: 14,
    bio: 'နှလုံးသွေးကြောကျဉ်းရောဂါ ကာကွယ်ကုသခြင်း၊ သွေးတိုးရောဂါထိန်းချုပ်ခြင်းနှင့် နှလုံးကျန်းမာရေးစစ်ဆေးမှုဆိုင်ရာ အထူးကုဆရာဝန်ကြီး။',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Dr. Marcus Vance',
    specialty: 'Pediatrician (ကလေးအထူးကု)',
    qualification: 'MD, FAAP - Johns Hopkins University',
    experienceYears: 10,
    bio: 'မွေးကင်းစကလေးငယ်များမှစ၍ ဆယ်ကျော်သက်အရွယ်အထိ ကလေးဖွံ့ဖြိုးမှု၊ ကာကွယ်ဆေးထိုးနှံမှုနှင့် အာဟာရကျန်းမာရေး အထူးကုဆရာဝန်ကြီး။',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Dr. Elena Rostova',
    specialty: 'Endocrinology & Internal Medicine (ဆီးချိုနှင့် အထွေထွေရောဂါကု)',
    qualification: 'MD, PhD - Stanford University',
    experienceYears: 12,
    bio: 'ဆီးချို၊ သွေးတိုး၊ ဟော်မုန်းမညီမျှခြင်းနှင့် သိုင်းရွိုက်ရောဂါများဆိုင်ရာ အထူးကုဆရာဝန်မကြီး။',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813596-7494f6990470?auto=format&fit=crop&q=80&w=400',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Dr. Alexander Patel',
    specialty: 'Orthopedic Specialist (အရိုးအကြောနှင့် အဆစ်အထူးကု)',
    qualification: 'MS, FRCS - Oxford University',
    experienceYears: 16,
    bio: 'အရိုးအဆစ်ရောင်ရမ်းခြင်း၊ အားကစားဒဏ်ရာများ၊ ခါးနှင့် ဒူးဆစ်နာကျင်မှုကုသရေး အထူးကုဆရာဝန်ကြီး။',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    availableDays: ['Wednesday', 'Thursday', 'Friday'],
  },
];

// 10 Comprehensive Health Topics in Burmese Language with High Quality Medical Images
export const initialTopics: HealthTopic[] = [
  {
    id: 'topic-1',
    title: 'သွေးတိုးရောဂါကို သဘာဝအတိုင်း ထိန်းချုပ်ကာကွယ်နိုင်မည့် နည်းလမ်းကောင်းများ',
    slug: 'hypertension-prevention-lifestyle-guide',
    category: 'နှလုံးနှင့်သွေးကြော (Cardiology)',
    excerpt: 'သွေးတိုးရောဂါသည် လက္ခဏာမပြဘဲ အသံတိတ်လူသတ်သမားအဖြစ် လူသိများပါသည်။ နေ့စဉ်နေထိုင်စားသောက်မှုပုံစံ ပြုပြင်ပြောင်းလဲခြင်းဖြင့် သွေးပေါင်ချိန်ကို ဘေးထွက်ဆိုးကျိုးမရှိ ထိန်းချုပ်နိုင်ပါသည်။',
    content: `သွေးတိုးရောဂါ (Hypertension) သည် ကမ္ဘာတစ်ဝှမ်းတွင် နှလုံးရောဂါနှင့် လေဖြတ်ခြင်းကို ဖြစ်စေသောအဓိကအကြောင်းရင်းဖြစ်ပါသည်။ 

အဓိကလိုက်နာရမည့် ဆေးပညာဆိုင်ရာ အကြံပြုချက်များ-
၁။ **ဆားလျှော့စားပါ:** တစ်နေ့လျှင် ဆားစားသုံးမှု လက်ဖက်ရည်ဇွန်းတစ်ဇွန်း (၅ ဂရမ်) အောက် လျှော့ချပါ။ ငံပြာရည်၊ ဟင်းခတ်မှုန့်နှင့် အသင့်စား အစားအစာများကို ရှောင်ကြဉ်ပါ။
၂။ **ကိုယ်လက်လှုပ်ရှားမှု ပုံမှန်ပြုလုပ်ပါ:** တစ်ပတ်လျှင် အနည်းဆုံး ၁၅၀ မိနစ်ခန့် ခပ်သွက်သွက်လမ်းလျှောက်ခြင်း သို့မဟုတ် လေ့ကျင့်ခန်း ပုံမှန်ပြုလုပ်ပေးခြင်းသည် သွေးပေါင်ချိန်ကို ၅ မှ ၈ mmHg အထိ လျှော့ချပေးနိုင်သည်။
၃။ **ပိုတက်ဆီယမ်ကြွယ်ဝသော အသီးအရွက်များ စားသုံးပါ:** ငှက်ပျောသီး၊ ထောပတ်သီး၊ ဟင်းနုနွယ်ရွက်တို့သည် သွေးကြောများကို ပြေလျော့စေပါသည်။
၄။ **စိတ်ဖိစီးမှုလျှော့ချပြီး အိပ်ရေးဝဝအိပ်ပါ:** တစ်ညလျှင် ၇-၈ နာရီ ကောင်းစွာအိပ်စက်ခြင်းဖြင့် သွေးပေါင်တက်ခြင်းကို ကာကွယ်နိုင်ပါသည်။
၅။ **သွေးပေါင်ချိန်ကို ပုံမှန်တိုင်းတာပါ:** ဆရာဝန်ညွှန်ကြားသည့် ဆေးဝါးများကို ပုံမှန်သောက်သုံးပြီး မိမိသဘောဖြင့် ဆေးရပ်ခြင်း မပြုလုပ်သင့်ပါ။`,
    authorName: 'Dr. Sarah Jenkins',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-08-30',
  },
  {
    id: 'topic-2',
    title: 'ဆီးချိုရောဂါရှင်များ သိထားသင့်သည့် အစားအသောက်နှင့် သွေးတွင်းသကြားဓာတ် ထိန်းသိမ်းနည်း',
    slug: 'diabetes-diet-and-blood-sugar-control',
    category: 'ဆီးချိုနှင့်ဟော်မုန်း (Endocrinology)',
    excerpt: 'ဆီးချိုရောဂါရှိသူများအတွက် အစားအသောက် ရွေးချယ်စားသောက်မှုသည် အသက်တမျှ အရေးကြီးပါသည်။ သွေးတွင်းသကြားဓာတ် မတက်စေရန် မည်သို့စားသောက်နေထိုင်သင့်ပါသလဲ။',
    content: `ဆီးချိုရောဂါအမျိုးအစား (၂) သည် အစားအသောက်နှင့် နေထိုင်မှုပုံစံပေါ်တွင် ၈၀% အထိ မူတည်နေပါသည်။

သွေးတွင်းသကြားဓာတ်ကို ထိန်းညှိရန် အရေးကြီးသော အချက်များ-
- **အစားအသောက် စားသုံးပုံအစီအစဉ် (Food Sequencing):** ထမင်းမစားမီ အမျှင်ဓာတ်ကြွယ်ဝသော အသီးအရွက်များနှင့် ပရိုတင်း (ဥ၊ အသား၊ ငါး) ကို အရင်စားပါ။ ၎င်းသည် သွေးတွင်းသကြားဓာတ် ရုတ်တရက်ထိုးတက်ခြင်းကို ဟန့်တားပေးပါသည်။
- **အချိုလွန်ကဲသော အစားအစာနှင့် အချိုရည်များကို လုံးဝရှောင်ပါ:** သကြားပါသောအအေးများ၊ ဘိုဘိုလ္ဘက်ရည်၊ မုန့်ချိုများသည် သွေးတွင်းသကြားဓာတ်ကို လျင်မြန်စွာတက်စေပါသည်။
- **အစားစားပြီးနောက် ၁၀ မိနစ် လမ်းလျှောက်ပါ:** အစာစားပြီးပြီးချင်း ၁၀-၁၅ မိနစ်ခန့် ဖြည်းဖြည်းမှန်မှန် လမ်းလျှောက်ပေးခြင်းဖြင့် ကြွက်သားများက သွေးတွင်းသကြားဓာတ်ကို စုပ်ယူအသုံးချစေပါသည်။
- **သွေးတွင်းသကြားဓာတ် (HbA1c) စစ်ဆေးပါ:** ၃ လတစ်ကြိမ် သွေးစစ်ဆေးပြီး ပုံမှန်အတိုင်းအတာအတွင်း ရှိမရှိ စောင့်ကြည့်ပါ။`,
    authorName: 'Dr. Elena Rostova',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-08-28',
  },
  {
    id: 'topic-3',
    title: 'အရိုးအဆစ်နှင့် ဒူးနာသက်သာစေရန် လိုက်နာရမည့် နေ့စဉ်နေထိုင်မှုအလေ့အထများ',
    slug: 'joint-health-and-knee-pain-prevention',
    category: 'အရိုးနှင့်အကြော (Orthopedics)',
    excerpt: 'အသက်အရွယ်ရလာသည်နှင့်အမျှ ဒူးနာ၊ ခါးနာ၊ အရိုးအဆစ်ရောင်ရမ်းခြင်းများ မကြာခဏ ကြုံတွေ့ရတတ်ပါသည်။ အရိုးနုများ မပျက်စီးစေရန် ကာကွယ်နိုင်မည့် လမ်းညွှန်ချက်များ။',
    content: `အရိုးအဆစ်များသည် ကျွန်ုပ်တို့၏လှုပ်ရှားမှုတိုင်းအတွက် မရှိမဖြစ်လိုအပ်ပါသည်။ "လှုပ်ရှားမှ ချောဆီရမည်" ဟူသည့်အတိုင်း အရိုးအဆစ်ကျန်းမာရေးကို ထိန်းသိမ်းရန် အောက်ပါအချက်များကို လိုက်နာသင့်ပါသည်-

၁။ **ခန္ဓာကိုယ်အလေးချိန် ထိန်းသိမ်းပါ:** ကိုယ်အလေးချိန် ၁ ပေါင် လျှော့ချတိုင်း ဒူးဆစ်ပေါ်ကျရောက်သည့် ဖိအား ၄ ပေါင်ခန့် သက်သာသွားပါသည်။
၂။ **သက်ရောက်မှုနည်းသော လေ့ကျင့်ခန်းများ ပြုလုပ်ပါ:** ရေကူးခြင်း၊ လမ်းလျှောက်ခြင်း၊ စက်ဘီးစီးခြင်းတို့သည် အရိုးအဆစ်ဒဏ်မပိစေဘဲ ကြွက်သားများကို သန်မာစေပါသည်။
၃။ **ထိုင်ထအကြိမ်များလွန်းခြင်းနှင့် ကြမ်းပြင်ပေါ်တင်ပလ္လင်ခွေထိုင်ခြင်း ရှောင်ပါ:** ဒူးဆစ်အတွင်းရှိ အရိုးနုများကို ပွတ်တိုက်ပျက်စီးစေနိုင်သော ပုံစံများကို တတ်နိုင်သမျှ ရှောင်ရှားပါ။
၄။ **ကယ်လ်စီယမ်နှင့် ဗီတာမင် D ဖြည့်စွက်ပါ:** နို့၊ ပဲနို့၊ ငါးသေးသေးလေးများ စားသုံးပြီး နံနက်ခင်းနေရောင်ခြည် နုနုကို ခံယူပါ။`,
    authorName: 'Dr. Alexander Patel',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-08-25',
  },
  {
    id: 'topic-4',
    title: 'မိုးရာသီနှင့် ရာသီအကူးအပြောင်းတွင် ကလေးငယ်များ၌ အဖြစ်များသော တုပ်ကွေးရောဂါ ကာကွယ်နည်း',
    slug: 'pediatric-flu-prevention-rainy-season',
    category: 'ကလေးကျန်းမာရေး (Pediatrics)',
    excerpt: 'ကလေးငယ်များတွင် ရာသီတုပ်ကွေး၊ အအေးမိခြင်းနှင့် အဆုတ်ရောင်ရောဂါများ မဖြစ်ပွားစေရန် မိဘတိုင်း သိရှိထားသင့်သည့် ကြိုတင်ကာကွယ်ရေး အချက်များ။',
    content: `ကလေးငယ်များသည် ကိုယ်ခံအားစနစ် အပြည့်အဝမဖွံ့ဖြိုးသေးသောကြောင့် ရာသီဥတုအကူးအပြောင်းတွင် အသက်ရှူလမ်းကြောင်းဆိုင်ရာ ဗိုင်းရပ်စ်ပိုးများ ကူးစက်ခံရလွယ်ပါသည်။

မိဘများအတွက် ဆေးဘက်ဆိုင်ရာ အကြံပြုချက်များ-
- **နှစ်စဉ် တုပ်ကွေးကာကွယ်ဆေး (Flu Vaccine) ထိုးနှံပါ:** အသက် ၆ လအထက် ကလေးငယ်တိုင်း နှစ်စဉ် တုပ်ကွေးကာကွယ်ဆေး ထိုးနှံသင့်ပါသည်။
- **လက်ဆေးသည့် အလေ့အကျင့် သင်ကြားပေးပါ:** အစာမစားမီနှင့် အပြင်မှပြန်လာချိန်တိုင်း ဆပ်ပြာဖြင့် စက္ကန့် ၂၀ ကြာ သေချာစွာ လက်ဆေးခိုင်းပါ။
- **အာဟာရပြည့်ဝစွာ ကျွေးမွေးပါ:** ဗီတာမင် C ကြွယ်ဝသော သစ်သီးဝလံများ၊ ဟင်းသီးဟင်းရွက်စွပ်ပြုတ်နှင့် အရည်များများ တိုက်ကျွေးပါ။
- **သတိပြုရမည့် လက္ခဏာများ:** ကလေးငယ် အဖျားကြီးခြင်း၊ အသက်ရှူမြန်ခြင်း၊ ရင်ဘတ်ချိုင့်ဝင်ခြင်း၊ နို့မစို့နိုင်ခြင်း သို့မဟုတ် မှိန်းနေခြင်းရှိပါက နီးစပ်ရာဆေးခန်း သို့မဟုတ် ကလေးအထူးကုဆရာဝန်နှင့် ချက်ချင်းပြသပါ။`,
    authorName: 'Dr. Marcus Vance',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-08-23',
  },
  {
    id: 'topic-5',
    title: 'နှလုံးကျန်းမာစေရန် မည်သို့သော အစားအစာများကို ရွေးချယ်စားသုံးသင့်သလဲ',
    slug: 'heart-healthy-diet-and-nutrition',
    category: 'နှလုံးနှင့်သွေးကြော (Cardiology)',
    excerpt: 'နှလုံးသွေးကြောကျဉ်းရောဂါနှင့် သွေးကြောပိတ်ခြင်းမှ ကာကွယ်ပေးနိုင်သော အိုမီဂါ-၃ ကြွယ်ဝသည့် အစားအစာများနှင့် နှလုံးကျန်းမာရေး လမ်းညွှန်။',
    content: `နှလုံးရောဂါအများစုသည် သွေးတွင်းမကောင်းသော ကိုလက်စထရော (LDL) မြင့်တက်လာပြီး သွေးကြောနံရံများတွင် အဆီဂျိုးများ ပိတ်ဆို့ရာမှ စတင်ဖြစ်ပွားပါသည်။

နှလုံးအားကောင်းစေရန် ရွေးချယ်သင့်သော အစားအစာများ-
၁။ **အိုမီဂါ-၃ ကြွယ်ဝသော ငါးများ:** ဆယ်လ်မွန်ငါး၊ တူနာငါး၊ မက်ကရယ်ငါးနှင့် ဒေသထွက်ငါးများကို တစ်ပတ်လျှင် ၂ ကြိမ် စားသုံးပေးခြင်းဖြင့် သွေးတွင်းအဆီဓာတ်ကို ကျဆင်းစေပါသည်။
၂။ **သံလွင်ဆီနှင့် အဆန်အစေ့များ:** မြေပဲ၊ သီဟိုဠ်စေ့၊ သစ်ကြားသီးတို့တွင် သွေးကြောပျော့ပျောင်းစေသော အကျိုးပြုအဆီများ ပါဝင်ပါသည်။
၃။ **သစ်သီးသစ်ဥများ:** ဘယ်ရီသီးများ၊ ပန်းသီး၊ လိမ္မော်သီးတို့တွင် Antioxidant ဓာတ်များစွာပါဝင်ပြီး နှလုံးဆဲလ်များ ပျက်စီးမှုကို ကာကွယ်ပေးပါသည်။
၄။ **ရှောင်ကြဉ်ရမည့် အရာများ:** ဝက်ဆီ၊ အကြော်အလှော်များ၊ ထရန်စ်ဖက်တီအက်ဆစ် (Trans-fat) ပါသော မာဂျရင်းနှင့် မုန့်ကြွပ်များကို တတ်နိုင်သမျှ ရှောင်ရှားသင့်ပါသည်။`,
    authorName: 'Dr. Sarah Jenkins',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-08-20',
  },
  {
    id: 'topic-6',
    title: 'အိပ်မပျော်ခြင်းနှင့် စိတ်ဖိစီးမှုကို ကုသနိုင်မည့် သိပ္ပံနည်းကျ အိပ်စက်ခြင်းအလေ့အထများ',
    slug: 'sleep-hygiene-and-stress-management',
    category: 'အထွေထွေကျန်းမာရေး (General Health)',
    excerpt: 'အိပ်ရေးပျက်ခြင်းသည် မှတ်ဉာဏ်၊ ကိုယ်ခံအားနှင့် နှလုံးကျန်းမာရေးကို ထိခိုက်စေပါသည်။ နှစ်ခြိုက်စွာ အိပ်ပျော်စေရန် လိုက်နာသင့်သည့် အိပ်စက်ခြင်းစည်းမျဉ်းများ။',
    content: `အရည်အသွေးပြည့်ဝသော အိပ်စက်ခြင်း (Quality Sleep) သည် ခန္ဓာကိုယ်၏ တစ်ရှူးများနှင့် ဦးနှောက်ဆဲလ်များကို ပြန်လည်ပြုပြင်ပေးသည့် အရေးကြီးဆုံးအချိန်ဖြစ်ပါသည်။

ကောင်းမွန်စွာ အိပ်ပျော်စေရန် နည်းလမ်းများ-
- **အိပ်ရာဝင်ချိန်နှင့် နိုးချိန်ကို တသမတ်တည်းထားပါ:** စနေ၊ တနင်္ဂနွေ အပါအဝင် နေ့စဉ် အချိန်မှန် အိပ်ရာဝင်ပြီး အချိန်မှန် ထပါ။
- **အိပ်ရာမဝင်မီ ဖုန်းနှင့် စခရင်များကို ပိတ်ပါ:** အပြာရောင်အလင်းတန်း (Blue Light) သည် အိပ်စက်ခြင်းကို ကူညီပေးသော မယ်လာတိုနင် (Melatonin) ဟော်မုန်းထွက်ရှိမှုကို ဟန့်တားစေပါသည်။
- **ညနေပိုင်းတွင် ကဖိန်းဓာတ် ရှောင်ပါ:** နေ့လယ် ၂ နာရီကျော်ပါက ကော်ဖီ၊ လက်ဖက်ရည်နှင့် စွမ်းအင်ဖြည့်အချိုရည်များ သောက်သုံးခြင်းကို ရှောင်ကြဉ်ပါ။
- **အိပ်ခန်းပတ်ဝန်းကျင်ကို အေးမြပြီး မှောင်အောင်ထားပါ:** အသံတိတ်ဆိတ်ပြီး လေဝင်လေထွက်ကောင်းသော အခန်းသည် အိပ်စက်ခြင်းကို များစွာအထောက်အကူပြုပါသည်။`,
    authorName: 'Dr. Elena Rostova',
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-08-18',
  },
  {
    id: 'topic-7',
    title: 'ကွန်ပျူတာနှင့် ဖုန်းအသုံးများသူများအတွက် ဇက်ကြောတက်နှင့် ခါးနာသက်သာစေမည့် လေ့ကျင့်ခန်းများ',
    slug: 'ergonomics-neck-back-pain-relief',
    category: 'အရိုးနှင့်အကြော (Orthopedics)',
    excerpt: 'ရုံးထိုင်အလုပ်လုပ်သူများတွင် အဖြစ်များသော ရုံးရောဂါစု (Office Syndrome)၊ ဇက်ကြောညောင်းညာခြင်းနှင့် ခါးရိုးဆစ်နာကျင်ခြင်းကို ကာကွယ်နည်း။',
    content: `အချိန်ကြာမြင့်စွာ ကွန်ပျူတာကြည့်ခြင်းနှင့် ပုံစံမမှန်ဘဲ ထိုင်ခြင်းကြောင့် ကျောရိုးဆစ်များနှင့် လည်ပင်းကြွက်သားများပေါ်တွင် အဆမတန် ဝန်ပိစေပါသည်။

ရုံးရောဂါစု ကာကွယ်ရန် နည်းလမ်းများ-
၁။ **ထိုင်ခုံအနေအထားကို ချိန်ညှိပါ:** ကွန်ပျူတာစခရင်သည် မျက်လုံးနှင့် တစ်ပြေးညီရှိရမည်။ ခြေထောက်နှစ်ဖက်သည် ကြမ်းပြင်ပေါ်တွင် သက်တောင့်သက်သာ ပြားပြားကပ်နေသင့်ပါသည်။
၂။ **၂၀-၂၀-၂၀ စည်းမျဉ်းကို သုံးပါ:** မိနစ် ၂၀ လျှင် တစ်ကြိမ် ပေ ၂၀ အကွာရှိ အရာဝတ္ထုတစ်ခုကို စက္ကန့် ၂၀ ကြာ ကြည့်ပေးခြင်းဖြင့် မျက်စိညောင်းညာမှုကို သက်သာစေပါသည်။
၃။ **နာရီဝက်တစ်ခါ မတ်တပ်ရပ်ပါ:** အနည်းဆုံး ၁ နာရီလျှင် တစ်ကြိမ် မတ်တပ်ရပ်၍ ခန္ဓာကိုယ်နှင့် ပခုံး၊ လည်ပင်းကြွက်သားများကို ဆန့်ထုတ် (Stretching) ပေးပါ။
၄။ **လည်ပင်းကို ငုံ့၍ ဖုန်းသုံးခြင်းရှောင်ပါ:** ဖုန်းကို ရင်ဘတ်အဆင့် မထားဘဲ မျက်လုံးအဆင့်အထိ မြှင့်တင်ကိုင်တွယ်ပါ။`,
    authorName: 'Dr. Alexander Patel',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-08-15',
  },
  {
    id: 'topic-8',
    title: 'ကလေးငယ်များတွင် အဝလွန်ခြင်းကို ကာကွယ်ပြီး မျှတသော အာဟာရကျွေးမွေးနည်း',
    slug: 'childhood-obesity-and-balanced-nutrition',
    category: 'ကလေးကျန်းမာရေး (Pediatrics)',
    excerpt: 'ကလေးဘဝ အဝလွန်ခြင်းသည် ကြီးပြင်းလာချိန်တွင် ဆီးချို၊ သွေးတိုးနှင့် နှလုံးရောဂါဖြစ်နိုင်ခြေကို မြင့်တက်စေပါသည်။ ကလေးငယ်များအတွက် မှန်ကန်သော အစားအသောက်ပုံစံ။',
    content: `ယနေ့ခေတ် ကလေးငယ်များတွင် အသင့်စားအစားအစာ (Fast Food) များပြားလာခြင်းနှင့် အိမ်တွင်း၌သာ ဖုန်း၊ ဂိမ်းကစားခြင်းကြောင့် ကလေးအဝလွန်ရောဂါ သိသိသာသာ မြင့်တက်လာနေပါသည်။

မိဘများ ပြုပြင်ပေးသင့်သည့် အချက်များ-
- **အိမ်ချက် အစားအစာများကို ဦးစားပေးကျွေးပါ:** အသီးအရွက်၊ ပဲအမျိုးမျိုး၊ ဥနှင့် အသားကို မျှတစွာ ပါဝင်အောင် ချက်ပြုတ်ကျွေးမွေးပါ။
- **အချိုရည်နှင့် အသင့်စားမုန့်များ ကန့်သတ်ပါ:** အာလူးကြော်၊ သကြားလုံးနှင့် ဆိုဒါအချိုရည်များအစား လတ်ဆတ်သော သစ်သီးများကို မုန့်အဖြစ် ပေးပါ။
- **စခရင်ကြည့်ချိန် (Screen Time) လျှော့ပါ:** တစ်နေ့လျှင် ၂ နာရီထက်မပိုစေဘဲ ပြင်ပတွင် အပြေးအလွှားဆော့ကစားစေပါ။
- **မိသားစုလိုက် ကျန်းမာရေးနှင့်ညီညွတ်သော စံပြဖြစ်ပါစေ:** ကလေးငယ်များသည် မိဘများ စားသောက်နေထိုင်သည့်အတိုင်း အတုယူတတ်ကြပါသည်။`,
    authorName: 'Dr. Marcus Vance',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-08-12',
  },
  {
    id: 'topic-9',
    title: 'ကျောက်ကပ်ကျန်းမာရေးကို ထိန်းသိမ်းရန် ရေဓာတ်နှင့် ဆေးဝါးသတိပြုဖွယ်ရာများ',
    slug: 'kidney-health-hydration-and-medications',
    category: 'အထွေထွေကျန်းမာရေး (General Health)',
    excerpt: 'ကျောက်ကပ်သည် ခန္ဓာကိုယ်အတွင်းရှိ အညစ်အကြေးများကို စစ်ထုတ်ပေးသော အရေးပါသည့် အင်္ဂါဖြစ်ပါသည်။ ကျောက်ကပ်ပျက်စီးခြင်းမှ ကာကွယ်နိုင်မည့် နည်းလမ်းများ။',
    content: `ကျောက်ကပ်ရောဂါ အများစုသည် နောက်ဆုံးအဆင့်မရောက်မချင်း သိသာသော လက္ခဏာမပြတတ်သောကြောင့် ကြိုတင်ကာကွယ်မှုသည် အရေးအကြီးဆုံးဖြစ်ပါသည်။

ကျောက်ကပ်ကျန်းမာစေရန် သိထားသင့်သည့် အချက်များ-
၁။ **ရေကို လုံလောက်စွာသောက်ပါ:** တစ်နေ့လျှင် ရေ ၂ လီတာမှ ၂.၅ လီတာ (ရေ ၈ ဖန်ခွက်ခန့်) သောက်သုံးပေးခြင်းဖြင့် ဆီးလမ်းကြောင်းပိုးဝင်ခြင်းနှင့် ကျောက်တည်ခြင်းကို ကာကွယ်နိုင်ပါသည်။
၂။ **အကိုက်အခဲပျောက်ဆေးများ အလွန်အကျွံမသောက်ပါနှင့်:** ဆရာဝန်ညွှန်ကြားချက်မပါဘဲ NSAIDs ခေါ် အကိုက်အခဲပျောက်ဆေးများကို ရက်ရှည်သောက်သုံးခြင်းသည် ကျောက်ကပ်ကို အဆိပ်အတောက်ဖြစ်စေပါသည်။
၃။ **သွေးတိုးနှင့် ဆီးချိုကို ထိန်းပါ:** ကျောက်ကပ်ပျက်စီးရခြင်း၏ အဓိကလက်သည်မှာ ထိန်းချုပ်မှုမရှိသော သွေးတိုးနှင့် ဆီးချိုရောဂါတို့ ဖြစ်ပါသည်။
၄။ **ဆီးအောင့်ခြင်း ရှောင်ပါ:** ဆီးသွားချင်ပါက မအောင့်ထားဘဲ ချက်ချင်းသွားသည့် အလေ့အကျင့် ပြုလုပ်ပါ။`,
    authorName: 'Dr. Elena Rostova',
    imageUrl: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-08-10',
  },
  {
    id: 'topic-10',
    title: 'အသက် ၄၀ ကျော် လူကြီးများ ပြုလုပ်သင့်သည့် နှစ်စဉ် ကျန်းမာရေးစစ်ဆေးမှုများ (Annual Health Check-up)',
    slug: 'annual-health-checkup-guidelines-over-40',
    category: 'အထွေထွေကျန်းမာရေး (General Health)',
    excerpt: 'ရောဂါမဖြစ်မီ ကြိုတင်ကာကွယ်ခြင်းသည် ကုသခြင်းထက် များစွာထိရောက်ပါသည်။ အသက် ၄၀ ကျော်ပါက နှစ်စဉ် မဖြစ်မနေ စစ်ဆေးသင့်သည့် ဆေးစစ်ချက်များ။',
    content: `အသက် ၄၀ အရွယ်သည် ဇီဝကမ္မဖြစ်စဉ်များ စတင်ပြောင်းလဲလာချိန်ဖြစ်ပြီး နာတာရှည်ရောဂါများ စတင်ခိုအောင်းလာနိုင်သည့် အရွယ်ဖြစ်ပါသည်။

နှစ်စဉ် ပြုလုပ်သင့်သော ကျန်းမာရေး စစ်ဆေးမှုများ-
- **သွေးပေါင်ချိန်နှင့် နှလုံးကြွက်သားလျှပ်စစ်စစ်ဆေးခြင်း (ECG):** နှလုံးသွေးကြောဆိုင်ရာ ပြဿနာများကို စောစီးစွာ သိရှိနိုင်ပါသည်။
- **အစာရှောင်သွေးတွင်းသကြားဓာတ် (Fasting Blood Sugar) နှင့် HbA1c:** ဆီးချိုအကြိုအဆင့်နှင့် ဆီးချိုရောဂါကို စစ်ဆေးခြင်း။
- **သွေးတွင်းအဆီဓာတ်စစ်ဆေးခြင်း (Lipid Profile):** သွေးတွင်းမကောင်းသော အဆီနှင့် ထရိုင်ဂလစ်စရိုက် (Triglycerides) ပမာဏကို တိုင်းတာခြင်း။
- **အသည်းနှင့် ကျောက်ကပ်လုပ်ဆောင်ချက်စစ်ဆေးခြင်း (LFT, RFT):** အတွင်းအင်္ဂါများ ကောင်းမွန်စွာ အလုပ်လုပ်ခြင်း ရှိမရှိ စစ်ဆေးခြင်း။
- **ကင်ဆာကြိုတင်စစ်ဆေးမှုများ:** အမျိုးသမီးများအတွက် ရင်သားဓာတ်မှန် (Mammogram) နှင့် သားအိမ်ခေါင်းကင်ဆာစစ်ဆေးခြင်း (Pap Smear)၊ အမျိုးသားများအတွက် ဆီးကျိတ်အကျိတ်စစ်ဆေးခြင်း (PSA) စသည်တို့ကို ဆရာဝန်နှင့် တိုင်ပင်၍ စစ်ဆေးသင့်ပါသည်။`,
    authorName: 'Dr. Sarah Jenkins',
    imageUrl: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-08-08',
  },
];

// ============================================================================
// HEALTHCARE ERP TYPES & SCHEMAS
// ============================================================================

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in_consultation'
  | 'completed'
  | 'cancelled';

export interface Appointment {
  id: string;
  tokenNumber?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  roomNumber?: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface Patient {
  id: string;
  hn: string; // Hospital/Clinic Number e.g. HN-2026-001
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  phone: string;
  email?: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: string;
  address?: string;
  createdAt: string;
}

export interface Vitals {
  bloodPressure: string; // e.g. "120/80"
  heartRate: number; // bpm e.g. 74
  temperature: number; // °C e.g. 36.8
  spO2: number; // % e.g. 98
  weight: number; // kg e.g. 65
  height: number; // cm e.g. 170
  bmi: number; // auto calculated
}

export interface PrescriptionItem {
  medicineId: string;
  medicineName: string;
  dosage: string; // e.g. "500mg"
  frequency: string; // e.g. "1 tab twice daily after meals (BID PC)"
  duration: string; // e.g. "5 days"
  quantity: number;
  instructions: string;
}

export interface EMRRecord {
  id: string;
  patientId: string;
  patientHn: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  vitals: Vitals;
  chiefComplaint: string;
  diagnosis: string;
  clinicalNotes: string;
  prescriptions: PrescriptionItem[];
  followUpDate?: string;
  createdAt: string;
}

export interface Medicine {
  id: string;
  code: string;
  genericName: string;
  brandName: string;
  category: string;
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment' | 'Drops' | 'Sachet';
  strength: string;
  currentStock: number;
  reorderLevel: number;
  unitPrice: number; // MMK
  costPrice: number; // MMK
  expiryDate: string;
  batchNumber: string;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientHn: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  status: 'pending_dispense' | 'dispensed';
  items: PrescriptionItem[];
  dispensedAt?: string;
  dispensedBy?: string;
  notes?: string;
}

export interface InvoiceItem {
  description: string;
  category: 'consultation' | 'pharmacy' | 'procedure' | 'lab';
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  status: 'paid' | 'unpaid' | 'partial';
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paymentMethod?: 'cash' | 'kpay' | 'wave' | 'card';
  paidAt?: string;
  receiptNumber?: string;
}

export interface LiveQueueItem {
  roomNumber: string;
  doctorName: string;
  specialty: string;
  currentToken: string;
  patientNameMasked: string;
  status: 'consulting' | 'ready' | 'idle';
  nextTokens: string[];
}

