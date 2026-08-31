import { NextRequest } from 'next/server';
import { contactSchema } from '@/lib/types';
import { checkRateLimit, sanitizeText, jsonResponse } from '@/lib/security';
import { getAdminSupabase } from '@/lib/supabase';

const mockInquiries: Array<Record<string, unknown>> = [];

export async function POST(req: NextRequest) {
  // 1. Rate Limiting defense against contact spam bots
  if (!checkRateLimit(req, 5, 60000)) {
    return jsonResponse({ error: 'Too many messages sent. Please wait a minute.' }, 429);
  }

  try {
    const rawBody = await req.json();

    // 2. Validate
    const parseResult = contactSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return jsonResponse({
        error: 'Validation failed',
        details: parseResult.error.issues.map((i) => i.message),
      }, 400);
    }

    const data = parseResult.data;

    // 3. Sanitize
    const sanitizedInquiry = {
      name: sanitizeText(data.name),
      email: data.email.toLowerCase(),
      phone: sanitizeText(data.phone || ''),
      subject: sanitizeText(data.subject),
      message: sanitizeText(data.message),
      status: 'unread',
    };

    // 4. Save to Supabase if connected
    const adminClient = getAdminSupabase();
    if (adminClient) {
      const { data: inserted, error: dbError } = await adminClient
        .from('contact_inquiries')
        .insert([sanitizedInquiry])
        .select()
        .single();

      if (dbError) {
        console.error('Supabase contact inquiry insert error:', dbError);
        return jsonResponse({ error: 'Database error storing message.' }, 500);
      }

      return jsonResponse({
        success: true,
        message: 'Your inquiry has been received. Our clinic team will reach out shortly.',
        inquiryId: inserted.id,
      }, 201);
    }

    // Local fallback
    const localId = `inq-${Date.now()}`;
    mockInquiries.push({ id: localId, ...sanitizedInquiry });

    return jsonResponse({
      success: true,
      message: 'Your inquiry has been received (demo mode). Our clinic team will reach out shortly.',
      inquiryId: localId,
    }, 201);
  } catch (err) {
    console.error('Contact API error:', err);
    return jsonResponse({ error: 'Internal server error processing contact message.' }, 500);
  }
}
