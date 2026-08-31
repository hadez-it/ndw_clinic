import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiting map: IP -> array of timestamps
// ponytail: in-memory Map rate limiter; use Redis/KV when horizontally autoscaling on serverless
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(req: NextRequest, maxRequests = 10, windowMs = 60000): boolean {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
  const now = Date.now();
  
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((time) => now - time < windowMs);
  
  if (validTimestamps.length >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  
  // Simple cleanup when map grows
  if (rateLimitMap.size > 2000) {
    for (const [key, times] of rateLimitMap.entries()) {
      if (times.every((t) => now - t > windowMs)) {
        rateLimitMap.delete(key);
      }
    }
  }
  
  return true;
}

// Sanitize string to prevent Stored XSS
export function sanitizeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
  });
}
