// ============================================================================
// MAIL PROVIDER ABSTRACTION LAYER (Sec. 6.1, NFA-15 Passwordless OAuth Only)
// ============================================================================

export interface AuthResult {
  accountId: string;
  provider: 'gmail' | 'microsoft365' | 'outlook' | 'yahoo';
  scopes: string[];
  expiresAt: string;
}

export interface Mutation {
  action: 'ARCHIVE' | 'DELETE' | 'MOVE_TO_QUARANTINE' | 'SNOOZE';
  snoozeUntil?: string;
}

export interface BatchResult {
  totalRequested: number;
  succeeded: number;
  retryableFailedIds: string[];
  rateLimitedRetryAfterSec?: number;
}

export interface UnsubscribeResult {
  messageId: string;
  senderDomain: string;
  method: 'RFC8058_HTTP_POST' | 'HTTPS_URL' | 'MAILTO';
  status: 'success' | 'failed';
  timestamp: string;
}

export interface MailProvider {
  authenticate(): Promise<AuthResult>;
  listMessages(cursor?: string): Promise<{ messageIds: string[]; nextCursor?: string }>;
  getMessageMetadata(id: string): Promise<Record<string, unknown>>;
  modifyMessage(id: string, operation: Mutation): Promise<void>;
  batchModify(ids: string[], operation: Mutation): Promise<BatchResult>;
  unsubscribe(messageId: string): Promise<UnsubscribeResult>;
}
