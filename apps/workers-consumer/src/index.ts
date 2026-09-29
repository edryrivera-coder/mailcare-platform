// ============================================================================
// CONSUMER INBOX WORKER POOL (Sec. 6-11, 22, NFA-05, NFA-11, NFA-26, NFA-27)
// ============================================================================

export interface ConsumerBatchCheckpoint {
  jobId: string;
  mailboxId: string;
  operation: 'ARCHIVE' | 'DELETE' | 'UNSUBSCRIBE';
  totalMessages: number;
  completedOffset: number;
  status: 'RUNNING' | 'THROTTLED_BACKOFF' | 'COMPLETED';
}

export function calculateExponentialBackoffMs(attempt: number, retryAfterHeaderSec?: number): number {
  if (retryAfterHeaderSec && retryAfterHeaderSec > 0) {
    return retryAfterHeaderSec * 1000;
  }
  const baseMs = 1000;
  const maxMs = 60_000;
  return Math.min(maxMs, baseMs * Math.pow(2, attempt));
}
