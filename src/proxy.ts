import { NextRequest, NextResponse } from 'next/server';

// Sliding window in-memory rate limiter at the Edge
// ponytail: Map-based sliding window per IP; keeps zero dependencies
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Suspicious bot/scanner signatures
const BLOCKED_USER_AGENTS = [
  'sqlmap',
  'nikto',
  'acunetix',
  'masscan',
  'nmap',
  'havij',
  'zgrab',
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const userAgent = (req.headers.get('user-agent') || '').toLowerCase();
  const method = req.method.toUpperCase();
  const now = Date.now();

  // 1. Block automated penetration scanners
  if (BLOCKED_USER_AGENTS.some((agent) => userAgent.includes(agent))) {
    return new NextResponse(JSON.stringify({ error: 'Blocked: Automated scanner detected.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. Strict CSRF Check on mutating API requests (POST/PATCH/DELETE)
  if (pathname.startsWith('/api') && ['POST', 'PATCH', 'DELETE', 'PUT'].includes(method)) {
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');

    if (origin && host) {
      const originHost = origin.replace(/^https?:\/\//, '').split(':')[0];
      const reqHost = host.split(':')[0];

      // Block if origin does not match host (cross-site forged request)
      if (originHost !== reqHost && originHost !== 'localhost') {
        return new NextResponse(
          JSON.stringify({ error: 'CSRF validation failed: Cross-origin mutation prohibited.' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  // 3. Multi-Tiered Rate Limiting for API routes
  if (pathname.startsWith('/api')) {
    let maxRequests = 60; // default 60 req/min for reads
    const windowMs = 60 * 1000;

    if (pathname.startsWith('/api/auth/login')) {
      maxRequests = 6; // max 6 login attempts per minute (anti-brute force)
    } else if (['POST', 'PATCH', 'DELETE'].includes(method)) {
      maxRequests = 15; // max 15 write operations per minute (anti-spam)
    }

    const key = `${ip}:${pathname.split('/')[2] || 'general'}:${method}`;
    const record = rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    } else {
      record.count += 1;
      if (record.count > maxRequests) {
        const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
        return new NextResponse(
          JSON.stringify({
            error: 'Too many requests. Rate limit exceeded.',
            retryAfterSeconds,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(retryAfterSeconds),
              'X-RateLimit-Limit': String(maxRequests),
              'X-RateLimit-Remaining': '0',
            },
          }
        );
      }
    }

    // Cleanup stale entries when map grows
    if (rateLimitMap.size > 3000) {
      for (const [k, v] of rateLimitMap.entries()) {
        if (now > v.resetTime) rateLimitMap.delete(k);
      }
    }
  }

  // 4. Inject Content-Security-Policy & Defensive HTTP Headers
  const response = NextResponse.next();

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' data:;
    connect-src 'self' https:;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
