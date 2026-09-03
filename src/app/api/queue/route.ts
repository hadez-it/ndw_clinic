import { jsonResponse } from '@/lib/security';
import { getLiveQueueStore } from '@/lib/erpStore';

export async function GET() {
  try {
    const queueData = getLiveQueueStore();
    return jsonResponse({
      success: true,
      timestamp: new Date().toISOString(),
      queue: queueData,
    });
  } catch (err) {
    console.error('Queue API error:', err);
    return jsonResponse({ error: 'Failed to fetch waiting room queue' }, 500);
  }
}
