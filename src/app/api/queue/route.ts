import { jsonResponse } from '@/lib/security';
import { getLiveQueueStore } from '@/lib/erpStore';

export async function GET() {
  try {
    const queueData = getLiveQueueStore();
    return jsonResponse(
      {
        success: true,
        timestamp: new Date().toISOString(),
        queue: queueData,
      },
      200,
      {
        'Cache-Control': 'public, s-maxage=8, stale-while-revalidate=20',
      }
    );
  } catch (err) {
    console.error('Queue API error:', err);
    return jsonResponse({ error: 'Failed to fetch waiting room queue' }, 500);
  }
}

