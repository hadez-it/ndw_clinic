import { NextRequest } from 'next/server';
import { topicSchema, initialTopics, HealthTopic } from '@/lib/types';
import { checkRateLimit, sanitizeText, jsonResponse } from '@/lib/security';
import { getAdminSupabase, supabase } from '@/lib/supabase';

// In-memory shared topics list for local dev fallback
const dynamicTopics: HealthTopic[] = [...initialTopics];

export async function GET() {
  // Try fetching from Supabase first
  if (supabase) {
    const { data, error } = await supabase
      .from('health_topics')
      .select('id, title, slug, category, excerpt, content, author_name, image_url, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const formatted = data.map((t) => ({
        id: t.id,
        title: t.title,
        slug: t.slug,
        category: t.category,
        excerpt: t.excerpt,
        content: t.content,
        authorName: t.author_name,
        imageUrl: t.image_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
        createdAt: t.created_at.split('T')[0],
      }));
      return jsonResponse({ topics: formatted }, 200, {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      });
    }
  }

  return jsonResponse({ topics: dynamicTopics }, 200, {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  });
}

export async function POST(req: NextRequest) {
  // 1. Rate limiting
  if (!checkRateLimit(req, 10, 60000)) {
    return jsonResponse({ error: 'Too many requests. Please slow down.' }, 429);
  }

  try {
    const rawBody = await req.json();

    // 2. Validate with Zod
    const parseResult = topicSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return jsonResponse({
        error: 'Validation failed',
        details: parseResult.error.issues.map((i) => i.message),
      }, 400);
    }

    const data = parseResult.data;

    // 3. Security: Authenticate Doctor or Owner via Secret PIN / Password
    const serverDoctorPin = process.env.DOCTOR_SECRET_PIN || 'doctor1234';
    const serverOwnerPass = process.env.CLINIC_OWNER_PASSWORD || 'owner2026!';
    if (data.authorPin !== serverDoctorPin && data.authorPin !== serverOwnerPass) {
      return jsonResponse({ error: 'Unauthorized: Invalid Doctor PIN or Owner Password.' }, 401);
    }

    // 4. Sanitize inputs
    const cleanTitle = sanitizeText(data.title);
    const slug = `topic-${Date.now()}`;

    const newTopic = {
      title: cleanTitle,
      slug,
      category: sanitizeText(data.category),
      excerpt: sanitizeText(data.excerpt),
      content: sanitizeText(data.content),
      author_name: sanitizeText(data.authorName),
      image_url: data.imageUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      published: true,
    };

    // 5. Save to Supabase if connected
    const adminClient = getAdminSupabase();
    if (adminClient) {
      const { data: inserted, error: dbError } = await adminClient
        .from('health_topics')
        .insert([newTopic])
        .select()
        .single();

      if (dbError) {
        console.error('Supabase health topic insert error:', dbError);
        return jsonResponse({ error: 'Database error saving topic.' }, 500);
      }

      return jsonResponse({
        success: true,
        message: 'Health article published successfully!',
        topic: {
          id: inserted.id,
          title: inserted.title,
          slug: inserted.slug,
          category: inserted.category,
          excerpt: inserted.excerpt,
          content: inserted.content,
          authorName: inserted.author_name,
          imageUrl: inserted.image_url,
          createdAt: inserted.created_at.split('T')[0],
        },
      }, 201);
    }

    // Local fallback
    const localTopic: HealthTopic = {
      id: `topic-${Date.now()}`,
      title: newTopic.title,
      slug: newTopic.slug,
      category: newTopic.category,
      excerpt: newTopic.excerpt,
      content: newTopic.content,
      authorName: newTopic.author_name,
      imageUrl: newTopic.image_url,
      createdAt: new Date().toISOString().split('T')[0],
    };

    dynamicTopics.unshift(localTopic);

    return jsonResponse({
      success: true,
      message: 'Health article published successfully (local mode)!',
      topic: localTopic,
    }, 201);
  } catch (err) {
    console.error('Error posting health topic:', err);
    return jsonResponse({ error: 'Internal server error processing health topic.' }, 500);
  }
}
