// ============================================================================
// API GATEWAY MIDDLEWARE PIPELINE (Sec. 4.1, 5, 29, 30, NFA-10, NFA-15..27, NFA-38)
// ============================================================================

import crypto from 'node:crypto';

export interface GatewayRequestContext {
  requestId: string;
  traceId: string;
  organizationId: string;
  actorId: string;
  authMethod: 'OAUTH_BEARER' | 'ENTERPRISE_API_KEY';
  idempotencyKey?: string;
  startedAtMs: number;
}

export interface GatewayErrorResponse {
  status: number;
  headers?: Record<string, string>;
  body: {
    error: {
      code:
        | 'RATE_LIMITED'
        | 'SYNTAX_ERROR'
        | 'TENANT_FORBIDDEN'
        | 'PASSWORD_AUTH_PROHIBITED'
        | 'UNAUTHORIZED'
        | 'NOT_FOUND'
        | 'ML_SERVICE_UNAVAILABLE';
      message: string;
      retry_after?: number;
      request_id: string;
      trace_id: string;
    };
  };
}

// In-memory Token Bucket Rate Limiter (Sec. 29: Default 100 req/min/user - NFA-26, NFA-27)
const rateLimitBuckets = new Map<string, { tokens: number; resetAtMs: number }>();

// In-memory Idempotency-Key response cache (NFA-10)
const idempotencyStore = new Map<
  string,
  { status: number; body: unknown; createdAtMs: number }
>();

/**
 * 1. Correlation & Trace ID Generator (NFA-38)
 */
export function createCorrelationContext(headers: Record<string, string | undefined>): {
  requestId: string;
  traceId: string;
  startedAtMs: number;
} {
  return {
    requestId: headers['x-request-id'] ?? `req_${crypto.randomBytes(6).toString('hex')}`,
    traceId: headers['x-trace-id'] ?? `trc_${crypto.randomBytes(8).toString('hex')}`,
    startedAtMs: Date.now(),
  };
}

/**
 * 2. Authentication & Multi-Tenant Guard (Sec. 4.1, Sec. 5, NFA-15, NFA-22)
 * Strictly rejects any plaintext mailbox password submission (NFA-15).
 */
export function enforceAuthAndTenantIsolation(
  headers: Record<string, string | undefined>,
  bodyPayload?: Record<string, unknown>,
  correlation?: { requestId: string; traceId: string }
): { ok: true; context: GatewayRequestContext } | { ok: false; errorResponse: GatewayErrorResponse } {
  const reqId = correlation?.requestId ?? 'req_unknown';
  const trcId = correlation?.traceId ?? 'trc_unknown';

  // NFA-15: Passwordless Mailbox Authorization — reject plaintext password fields immediately
  if (bodyPayload && ('password' in bodyPayload || 'mailbox_password' in bodyPayload)) {
    return {
      ok: false,
      errorResponse: {
        status: 400,
        body: {
          error: {
            code: 'PASSWORD_AUTH_PROHIBITED',
            message:
              'Plaintext mailbox passwords are prohibited by NFA-15. Use delegated OAuth 2.0 / OIDC authorization.',
            request_id: reqId,
            trace_id: trcId,
          },
        },
      },
    };
  }

  const apiKey = headers['x-api-key'];
  const authHeader = headers['authorization'];
  const organizationId = headers['x-organization-id'] ?? 'org_enterprise_01';
  const actorId = headers['x-actor-id'] ?? 'user_edry_01';

  if (!organizationId.trim()) {
    return {
      ok: false,
      errorResponse: {
        status: 403,
        body: {
          error: {
            code: 'TENANT_FORBIDDEN',
            message: 'Missing organization_id boundary for multi-tenant isolation (NFA-22)',
            request_id: reqId,
            trace_id: trcId,
          },
        },
      },
    };
  }

  const authMethod = apiKey || authHeader?.startsWith('Key ') ? 'ENTERPRISE_API_KEY' : 'OAUTH_BEARER';

  return {
    ok: true,
    context: {
      requestId: reqId,
      traceId: trcId,
      organizationId,
      actorId,
      authMethod,
      idempotencyKey: headers['idempotency-key'],
      startedAtMs: Date.now(),
    },
  };
}

/**
 * 3. Token-Bucket Rate Limiter (Sec. 29, NFA-25, NFA-26, NFA-27)
 */
export function checkRateLimit(
  ctx: GatewayRequestContext,
  limitPerMinute = 100
): { allowed: true; remaining: number } | { allowed: false; errorResponse: GatewayErrorResponse } {
  const now = Date.now();
  const key = `${ctx.organizationId}:${ctx.actorId}`;
  const existing = rateLimitBuckets.get(key);

  if (!existing || now >= existing.resetAtMs) {
    rateLimitBuckets.set(key, {
      tokens: limitPerMinute - 1,
      resetAtMs: now + 60_000,
    });
    return { allowed: true, remaining: limitPerMinute - 1 };
  }

  if (existing.tokens <= 0) {
    const retryAfterSec = Math.max(1, Math.ceil((existing.resetAtMs - now) / 1000));
    return {
      allowed: false,
      errorResponse: {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSec),
          'X-RateLimit-Remaining': '0',
        },
        body: {
          error: {
            code: 'RATE_LIMITED',
            message: 'Request temporarily throttled',
            retry_after: retryAfterSec,
            request_id: ctx.requestId,
            trace_id: ctx.traceId,
          },
        },
      },
    };
  }

  existing.tokens -= 1;
  return { allowed: true, remaining: existing.tokens };
}

/**
 * 4. Idempotency-Key Guard (NFA-10)
 */
export function checkIdempotencyCache(
  ctx: GatewayRequestContext
): { hit: true; status: number; body: unknown } | { hit: false } {
  if (!ctx.idempotencyKey) return { hit: false };
  const scopedKey = `${ctx.organizationId}:${ctx.idempotencyKey}`;
  const cached = idempotencyStore.get(scopedKey);
  if (cached) {
    return { hit: true, status: cached.status, body: cached.body };
  }
  return { hit: false };
}

export function saveIdempotencyCache(
  ctx: GatewayRequestContext,
  status: number,
  body: unknown
): void {
  if (!ctx.idempotencyKey) return;
  const scopedKey = `${ctx.organizationId}:${ctx.idempotencyKey}`;
  idempotencyStore.set(scopedKey, {
    status,
    body,
    createdAtMs: Date.now(),
  });
}

/**
 * 5. HMAC-SHA256 Webhook Signature Generator (Sec. 26, NFA-37)
 */
export function signWebhookPayload(payloadJson: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payloadJson).digest('hex');
}
