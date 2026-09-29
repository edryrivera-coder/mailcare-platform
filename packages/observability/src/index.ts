// ============================================================================
// OBSERVABILITY, REDACTED LOGGING & CIRCUIT BREAKER (Sec. 32, NFA-34, NFA-39)
// ============================================================================

const SENSITIVE_FIELD_KEYS = new Set([
  'password',
  'refresh_token',
  'access_token',
  'api_secret',
  'raw_body',
  'html_body',
]);

export function redactSensitiveFields<T extends Record<string, unknown>>(payload: T): Record<string, unknown> {
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (SENSITIVE_FIELD_KEYS.has(key.toLowerCase())) {
      output[key] = '[REDACTED_BY_NFA_39]';
    } else {
      output[key] = value;
    }
  }
  return output;
}

// NFA-34: Model failure must not break deterministic verification
export async function withMlAdvisoryFallback<T>(
  operation: () => Promise<T>,
  fallbackValue: T
): Promise<{ result: T; degraded: boolean; reason?: 'ML_SERVICE_UNAVAILABLE' }> {
  try {
    const result = await operation();
    return { result, degraded: false };
  } catch {
    return {
      result: fallbackValue,
      degraded: true,
      reason: 'ML_SERVICE_UNAVAILABLE',
    };
  }
}
