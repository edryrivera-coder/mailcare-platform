// ============================================================================
// MAILCARE CANONICAL DOMAIN MODELS & API CONTRACTS (Sec. 7, 11, 19, 24, 26)
// ============================================================================

export type VerificationStatus = 'DELIVERABLE' | 'UNDELIVERABLE' | 'RISKY' | 'UNKNOWN';

export type CheckState = 'Valid' | 'Invalid' | 'Risky' | 'Unknown';

export interface VerificationResult {
  id: string;
  email: string;
  status: VerificationStatus;
  displayBadge: CheckState;
  score: number; // 0.0 - 10.0
  riskScore100: number; // 0 - 100 (e.g. Low 5/100 in dashboard.png)
  riskLabel: 'Low' | 'Medium' | 'High' | 'Critical';
  checks: {
    syntax: CheckState;
    domainDns: CheckState;
    mxRecord: CheckState;
    smtp: CheckState;
  };
  domain: {
    exists: boolean;
    mx: boolean;
    catchAll: boolean;
  };
  smtp: {
    status: 'accepted' | 'rejected' | 'greylisted' | 'timeout';
  };
  risk: {
    disposable: boolean;
    role: boolean;
    spamTrap: boolean;
  };
  processing: {
    durationMs: number;
    engineVersion: string;
    modelVersion?: string;
    featureVersion?: string;
  };
  timestamp: string;
}

export type SmartFilterCategory =
  | 'All Emails'
  | 'Inbox'
  | 'Newsletters'
  | 'Promotions'
  | 'Social'
  | 'Updates'
  | 'Forums';

export interface MessageMetadata {
  messageId: string;
  providerId: 'gmail' | 'microsoft365' | 'outlook' | 'yahoo';
  accountId: string;
  threadId: string;
  senderName: string;
  senderEmail: string;
  senderDomain: string;
  senderBrandColor: string;
  senderIconType: 'netflix' | 'amazon' | 'youtube' | 'spotify' | 'google' | 'facebook' | 'generic';
  subject: string;
  timestamp: string;
  relativeDate: string;
  messageSizeBytes: number;
  formattedSize: string;
  category: Exclude<SmartFilterCategory, 'All Emails'>;
  hasListUnsubscribe: boolean;
  unsubscribeMethod?: 'RFC8058_HTTP_POST' | 'HTTPS_URL' | 'MAILTO';
  trackersBlocked: number;
  unread: boolean;
  archived: boolean;
}

export type BatchJobCategory = 'All Jobs' | 'Verification' | 'Inbox Processing' | 'CRM Sync' | 'Hygiene';

export type BatchJobStatus = 'Running' | 'Completed' | 'Failed' | 'Paused';

export interface BatchJob {
  jobId: string;
  type: 'Bulk Verification' | 'Inbox Cleanup' | 'CRM Sync' | 'Verification' | 'Hygiene Job';
  category: Exclude<BatchJobCategory, 'All Jobs'>;
  status: BatchJobStatus;
  progress: number; // 0 - 100
  totalRecords: number;
  completedRecords: number;
  checkpointRange: string; // e.g., "000001 - 680000" (NFA-11)
  createdRelative: string;
  organizationId: string;
}

export interface FilteringRule {
  id: string;
  name: string;
  conditions: Array<{
    field: 'category' | 'sender_domain' | 'size_mb' | 'age_days';
    operator: 'equals' | 'contains' | 'greater_than';
    value: string;
  }>;
  actions: Array<{
    type: 'archive' | 'delete' | 'unsubscribe' | 'quarantine';
  }>;
  enabled: boolean;
}

export interface ApiErrorContract {
  error: {
    code: 'RATE_LIMITED' | 'SYNTAX_ERROR' | 'TENANT_FORBIDDEN' | 'ML_SERVICE_UNAVAILABLE' | 'PROVIDER_REVOKED';
    message: string;
    retry_after?: number;
    request_id: string;
  };
}
