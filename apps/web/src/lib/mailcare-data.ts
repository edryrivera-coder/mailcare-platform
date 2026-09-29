import type {
  BatchJob,
  FilteringRule,
  MessageMetadata,
  VerificationResult,
} from '@mailcare/shared-types';

// ============================================================================
// SCREEN 1: EMAIL VERIFICATION DEFAULT DATA (Matches dashboard.png)
// ============================================================================
export const DEFAULT_VERIFICATION_RESULT: VerificationResult = {
  id: 'ver_2026_001',
  email: 'john.doe@company.com',
  status: 'DELIVERABLE',
  displayBadge: 'Valid',
  score: 9.8,
  riskScore100: 5,
  riskLabel: 'Low',
  checks: {
    syntax: 'Valid',
    domainDns: 'Valid',
    mxRecord: 'Valid',
    smtp: 'Valid',
  },
  domain: {
    exists: true,
    mx: true,
    catchAll: false,
  },
  smtp: {
    status: 'accepted',
  },
  risk: {
    disposable: false,
    role: false,
    spamTrap: false,
  },
  processing: {
    durationMs: 412,
    engineVersion: '1.0.0',
    modelVersion: 'catchall-xgb-2026.09',
    featureVersion: 'feat-lexical-v3',
  },
  timestamp: '2026-09-29T03:00:00Z',
};

export const INITIAL_VERIFICATION_HISTORY: VerificationResult[] = [
  DEFAULT_VERIFICATION_RESULT,
  {
    id: 'ver_hist_002',
    email: 'support@company.com',
    status: 'RISKY',
    displayBadge: 'Risky',
    score: 6.8,
    riskScore100: 28,
    riskLabel: 'Medium',
    checks: {
      syntax: 'Valid',
      domainDns: 'Valid',
      mxRecord: 'Valid',
      smtp: 'Valid',
    },
    domain: { exists: true, mx: true, catchAll: false },
    smtp: { status: 'accepted' },
    risk: { disposable: false, role: true, spamTrap: false },
    processing: { durationMs: 245, engineVersion: '1.0.0', modelVersion: 'deterministic-v1' },
    timestamp: '2026-09-29T03:05:00Z',
  },
  {
    id: 'ver_hist_003',
    email: 'temp88@mailinator.com',
    status: 'RISKY',
    displayBadge: 'Risky',
    score: 2.1,
    riskScore100: 84,
    riskLabel: 'High',
    checks: {
      syntax: 'Valid',
      domainDns: 'Valid',
      mxRecord: 'Valid',
      smtp: 'Valid',
    },
    domain: { exists: true, mx: true, catchAll: false },
    smtp: { status: 'accepted' },
    risk: { disposable: true, role: false, spamTrap: false },
    processing: { durationMs: 180, engineVersion: '1.0.0', modelVersion: 'disposable-heuristics-v2' },
    timestamp: '2026-09-29T03:10:00Z',
  },
  {
    id: 'ver_hist_004',
    email: 'sarah.connor@cyberdyne.io',
    status: 'DELIVERABLE',
    displayBadge: 'Valid',
    score: 9.6,
    riskScore100: 6,
    riskLabel: 'Low',
    checks: {
      syntax: 'Valid',
      domainDns: 'Valid',
      mxRecord: 'Valid',
      smtp: 'Valid',
    },
    domain: { exists: true, mx: true, catchAll: false },
    smtp: { status: 'accepted' },
    risk: { disposable: false, role: false, spamTrap: false },
    processing: { durationMs: 310, engineVersion: '1.0.0', modelVersion: 'catchall-xgb-2026.09' },
    timestamp: '2026-09-29T03:15:00Z',
  },
];

export const VERIFICATION_STATS_BREAKDOWN = [
  { label: 'Valid', percent: 99.2, color: '#28c76f', dotClass: 'bg-[#28c76f]' },
  { label: 'Invalid', percent: 0.5, color: '#ea5455', dotClass: 'bg-[#ea5455]' },
  { label: 'Risky', percent: 0.2, color: '#f5b041', dotClass: 'bg-[#f5b041]' },
  { label: 'Unknown', percent: 0.1, color: '#7367f0', dotClass: 'bg-[#7367f0]' },
];

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'yopmail.com',
]);

const ROLE_PREFIXES = new Set([
  'admin',
  'support',
  'info',
  'sales',
  'billing',
  'security',
  'help',
  'office',
]);

export function evaluateEmailPipeline(rawEmail: string): VerificationResult {
  const email = rawEmail.trim();
  const start = Date.now();

  if (email.toLowerCase() === 'john.doe@company.com') {
    return { ...DEFAULT_VERIFICATION_RESULT, timestamp: new Date().toISOString() };
  }

  // Stage 1: RFC Syntax Check
  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  if (!emailRegex.test(email)) {
    return {
      id: `ver_${Math.random().toString(36).slice(2, 9)}`,
      email: email || '(empty)',
      status: 'UNDELIVERABLE',
      displayBadge: 'Invalid',
      score: 0.0,
      riskScore100: 98,
      riskLabel: 'Critical',
      checks: {
        syntax: 'Invalid',
        domainDns: 'Invalid',
        mxRecord: 'Invalid',
        smtp: 'Invalid',
      },
      domain: { exists: false, mx: false, catchAll: false },
      smtp: { status: 'rejected' },
      risk: { disposable: false, role: false, spamTrap: false },
      processing: { durationMs: 18, engineVersion: '1.0.0' },
      timestamp: new Date().toISOString(),
    };
  }

  const [localPart = '', domainPart = ''] = email.toLowerCase().split('@');
  const isDisposable = DISPOSABLE_DOMAINS.has(domainPart);
  const isRole = ROLE_PREFIXES.has(localPart);
  const isCatchAll = domainPart.includes('catchall') || domainPart.includes('enterprise.io');
  const isNoMx = domainPart.includes('nomx') || domainPart.endsWith('.invalid');
  const isSpamTrap = localPart.includes('trap') || localPart.includes('honeypot');

  if (isNoMx) {
    return {
      id: `ver_${Math.random().toString(36).slice(2, 9)}`,
      email,
      status: 'UNDELIVERABLE',
      displayBadge: 'Invalid',
      score: 1.2,
      riskScore100: 92,
      riskLabel: 'High',
      checks: {
        syntax: 'Valid',
        domainDns: 'Invalid',
        mxRecord: 'Invalid',
        smtp: 'Invalid',
      },
      domain: { exists: false, mx: false, catchAll: false },
      smtp: { status: 'rejected' },
      risk: { disposable: false, role: isRole, spamTrap: false },
      processing: { durationMs: 145, engineVersion: '1.0.0' },
      timestamp: new Date().toISOString(),
    };
  }

  if (isDisposable || isRole || isCatchAll || isSpamTrap) {
    const riskVal = isSpamTrap ? 95 : isDisposable ? 84 : isCatchAll ? 42 : 28;
    return {
      id: `ver_${Math.random().toString(36).slice(2, 9)}`,
      email,
      status: isSpamTrap ? 'UNDELIVERABLE' : 'RISKY',
      displayBadge: isSpamTrap ? 'Invalid' : 'Risky',
      score: isSpamTrap ? 0.5 : 6.8,
      riskScore100: riskVal,
      riskLabel: riskVal > 75 ? 'High' : 'Medium',
      checks: {
        syntax: 'Valid',
        domainDns: 'Valid',
        mxRecord: 'Valid',
        smtp: isCatchAll ? 'Risky' : 'Valid',
      },
      domain: { exists: true, mx: true, catchAll: isCatchAll },
      smtp: { status: 'accepted' },
      risk: { disposable: isDisposable, role: isRole, spamTrap: isSpamTrap },
      processing: {
        durationMs: Math.max(210, Date.now() - start + 340),
        engineVersion: '1.0.0',
        modelVersion: 'catchall-xgb-2026.09',
        featureVersion: 'feat-lexical-v3',
      },
      timestamp: new Date().toISOString(),
    };
  }

  return {
    id: `ver_${Math.random().toString(36).slice(2, 9)}`,
    email,
    status: 'DELIVERABLE',
    displayBadge: 'Valid',
    score: 9.7,
    riskScore100: 5,
    riskLabel: 'Low',
    checks: {
      syntax: 'Valid',
      domainDns: 'Valid',
      mxRecord: 'Valid',
      smtp: 'Valid',
    },
    domain: { exists: true, mx: true, catchAll: false },
    smtp: { status: 'accepted' },
    risk: { disposable: false, role: false, spamTrap: false },
    processing: {
      durationMs: 390,
      engineVersion: '1.0.0',
      modelVersion: 'catchall-xgb-2026.09',
      featureVersion: 'feat-lexical-v3',
    },
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// SCREEN 2: CONSUMER INBOX DATA (Exact match to dashboard.png)
// ============================================================================
export const SMART_FILTERS_INITIAL = [
  { name: 'All Emails' as const, count: 12847 },
  { name: 'Inbox' as const, count: 342 },
  { name: 'Newsletters' as const, count: 892 },
  { name: 'Promotions' as const, count: 1562 },
  { name: 'Social' as const, count: 436 },
  { name: 'Updates' as const, count: 298 },
  { name: 'Forums' as const, count: 153 },
];

export const INITIAL_INBOX_MESSAGES: MessageMetadata[] = [
  {
    messageId: 'msg_netflix_01',
    providerId: 'gmail',
    accountId: 'acc_edry',
    threadId: 'thd_01',
    senderName: 'Netflix',
    senderEmail: 'info@mailer.netflix.com',
    senderDomain: 'netflix.com',
    senderBrandColor: '#E50914',
    senderIconType: 'netflix',
    subject: 'Your weekly recommendations',
    timestamp: '2026-09-29T01:00:00Z',
    relativeDate: '2h ago',
    messageSizeBytes: 2516582,
    formattedSize: '2.4 MB',
    category: 'Newsletters',
    hasListUnsubscribe: true,
    unsubscribeMethod: 'RFC8058_HTTP_POST',
    trackersBlocked: 3,
    unread: true,
    archived: false,
  },
  {
    messageId: 'msg_amazon_02',
    providerId: 'gmail',
    accountId: 'acc_edry',
    threadId: 'thd_02',
    senderName: 'Amazon',
    senderEmail: 'shipment-tracking@amazon.com',
    senderDomain: 'amazon.com',
    senderBrandColor: '#FF9900',
    senderIconType: 'amazon',
    subject: 'Order update #123456',
    timestamp: '2026-09-28T23:00:00Z',
    relativeDate: '4h ago',
    messageSizeBytes: 1258291,
    formattedSize: '1.2 MB',
    category: 'Updates',
    hasListUnsubscribe: false,
    trackersBlocked: 1,
    unread: true,
    archived: false,
  },
  {
    messageId: 'msg_youtube_03',
    providerId: 'gmail',
    accountId: 'acc_edry',
    threadId: 'thd_03',
    senderName: 'YouTube',
    senderEmail: 'noreply@youtube.com',
    senderDomain: 'youtube.com',
    senderBrandColor: '#FF0000',
    senderIconType: 'youtube',
    subject: 'New video from your channel',
    timestamp: '2026-09-28T21:00:00Z',
    relativeDate: '6h ago',
    messageSizeBytes: 3250585,
    formattedSize: '3.1 MB',
    category: 'Social',
    hasListUnsubscribe: true,
    unsubscribeMethod: 'RFC8058_HTTP_POST',
    trackersBlocked: 2,
    unread: false,
    archived: false,
  },
  {
    messageId: 'msg_spotify_04',
    providerId: 'gmail',
    accountId: 'acc_edry',
    threadId: 'thd_04',
    senderName: 'Spotify',
    senderEmail: 'no-reply@spotify.com',
    senderDomain: 'spotify.com',
    senderBrandColor: '#1DB954',
    senderIconType: 'spotify',
    subject: 'New music this week',
    timestamp: '2026-09-28T19:00:00Z',
    relativeDate: '8h ago',
    messageSizeBytes: 2936012,
    formattedSize: '2.8 MB',
    category: 'Promotions',
    hasListUnsubscribe: true,
    unsubscribeMethod: 'RFC8058_HTTP_POST',
    trackersBlocked: 4,
    unread: false,
    archived: false,
  },
  {
    messageId: 'msg_google_05',
    providerId: 'gmail',
    accountId: 'acc_edry',
    threadId: 'thd_05',
    senderName: 'Google',
    senderEmail: 'no-reply@accounts.google.com',
    senderDomain: 'google.com',
    senderBrandColor: '#4285F4',
    senderIconType: 'google',
    subject: 'Security alert',
    timestamp: '2026-09-28T15:00:00Z',
    relativeDate: '12h ago',
    messageSizeBytes: 1153433,
    formattedSize: '1.1 MB',
    category: 'Inbox',
    hasListUnsubscribe: false,
    trackersBlocked: 0,
    unread: true,
    archived: false,
  },
  {
    messageId: 'msg_facebook_06',
    providerId: 'gmail',
    accountId: 'acc_edry',
    threadId: 'thd_06',
    senderName: 'Facebook',
    senderEmail: 'notification@facebookmail.com',
    senderDomain: 'facebook.com',
    senderBrandColor: '#1877F2',
    senderIconType: 'facebook',
    subject: 'New friend request',
    timestamp: '2026-09-28T13:00:00Z',
    relativeDate: '14h ago',
    messageSizeBytes: 862208,
    formattedSize: '842 KB',
    category: 'Social',
    hasListUnsubscribe: true,
    unsubscribeMethod: 'HTTPS_URL',
    trackersBlocked: 2,
    unread: false,
    archived: false,
  },
];

export const INITIAL_FILTER_RULES: FilteringRule[] = [
  {
    id: 'rule_01',
    name: 'Archive promotional digests older than 30 days',
    conditions: [{ field: 'category', operator: 'equals', value: 'Promotions' }],
    actions: [{ type: 'archive' }],
    enabled: true,
  },
  {
    id: 'rule_02',
    name: 'Auto-unsubscribe high-volume marketing senders',
    conditions: [{ field: 'category', operator: 'equals', value: 'Newsletters' }],
    actions: [{ type: 'unsubscribe' }, { type: 'archive' }],
    enabled: true,
  },
];

// ============================================================================
// SCREEN 3: BATCH JOBS DATA (Exact match to dashboard.png)
// ============================================================================
export const INITIAL_BATCH_JOBS: BatchJob[] = [
  {
    jobId: 'BJ-2025-00123',
    type: 'Bulk Verification',
    category: 'Verification',
    status: 'Running',
    progress: 68,
    totalRecords: 250000,
    completedRecords: 170000,
    checkpointRange: '000001 - 170000',
    createdRelative: '2h ago',
    organizationId: 'org_enterprise_01',
  },
  {
    jobId: 'BJ-2025-00122',
    type: 'Inbox Cleanup',
    category: 'Inbox Processing',
    status: 'Running',
    progress: 42,
    totalRecords: 25000,
    completedRecords: 10500,
    checkpointRange: '000001 - 010500',
    createdRelative: '3h ago',
    organizationId: 'org_enterprise_01',
  },
  {
    jobId: 'BJ-2025-00121',
    type: 'CRM Sync',
    category: 'CRM Sync',
    status: 'Completed',
    progress: 100,
    totalRecords: 85000,
    completedRecords: 85000,
    checkpointRange: '000001 - 085000',
    createdRelative: '5h ago',
    organizationId: 'org_enterprise_01',
  },
  {
    jobId: 'BJ-2025-00120',
    type: 'Verification',
    category: 'Verification',
    status: 'Completed',
    progress: 100,
    totalRecords: 100000,
    completedRecords: 100000,
    checkpointRange: '000001 - 100000',
    createdRelative: '6h ago',
    organizationId: 'org_enterprise_01',
  },
  {
    jobId: 'BJ-2025-00119',
    type: 'Hygiene Job',
    category: 'Hygiene',
    status: 'Failed',
    progress: 0,
    totalRecords: 50000,
    completedRecords: 0,
    checkpointRange: 'DLQ: SMTP_TIMEOUT_RETRY_EXHAUSTED',
    createdRelative: '7h ago',
    organizationId: 'org_enterprise_01',
  },
];

// ============================================================================
// SCREEN 4: ANALYTICS DATA (Exact match to dashboard.png)
// ============================================================================
export const ANALYTICS_TREND_7D = [
  { date: 'Apr 21', volume: 215000, label: '215K' },
  { date: 'Apr 22', volume: 310000, label: '310K' },
  { date: 'Apr 23', volume: 212000, label: '212K' },
  { date: 'Apr 24', volume: 315000, label: '315K' },
  { date: 'Apr 25', volume: 278000, label: '278K' },
  { date: 'Apr 26', volume: 332000, label: '332K' },
  { date: 'Apr 27', volume: 345000, label: '345K' },
];

export const ANALYTICS_CATEGORIES = [
  { name: 'Inbox', percent: 42, color: '#3b82f6' },
  { name: 'Newsletters', percent: 22, color: '#60a5fa' },
  { name: 'Promotions', percent: 18, color: '#eab308' },
  { name: 'Social', percent: 10, color: '#f59e0b' },
  { name: 'Updates', percent: 8, color: '#d97706' },
];

// ============================================================================
// SCREEN 5: INTEGRATIONS DATA (Exact match to dashboard.png)
// ============================================================================
export interface ConnectorItem {
  id: string;
  name: string;
  group: 'Email Providers' | 'CRM & ESP';
  connected: boolean;
  lastSync: string;
  highlighted?: boolean;
}

export const INITIAL_CONNECTORS: ConnectorItem[] = [
  { id: 'gmail', name: 'Gmail', group: 'Email Providers', connected: true, lastSync: '2m ago' },
  { id: 'microsoft365', name: 'Microsoft 365', group: 'Email Providers', connected: true, lastSync: '5m ago', highlighted: true },
  { id: 'outlook', name: 'Outlook', group: 'Email Providers', connected: false, lastSync: 'Not connected' },
  { id: 'yahoo', name: 'Yahoo', group: 'Email Providers', connected: false, lastSync: 'Not connected' },
  { id: 'salesforce', name: 'Salesforce', group: 'CRM & ESP', connected: true, lastSync: '14m ago' },
  { id: 'hubspot', name: 'HubSpot', group: 'CRM & ESP', connected: false, lastSync: 'Ready to connect' },
  { id: 'mailchimp', name: 'Mailchimp', group: 'CRM & ESP', connected: false, lastSync: 'Ready to connect' },
  { id: 'sendgrid', name: 'SendGrid', group: 'CRM & ESP', connected: false, lastSync: 'Ready to connect' },
];

export const INTEGRATION_STATUS_LIST = [
  { id: 'gmail', name: 'Gmail', status: 'Connected' },
  { id: 'microsoft365', name: 'Microsoft 365', status: 'Connected' },
  { id: 'salesforce', name: 'Salesforce', status: 'Connected' },
  { id: 'hubspot', name: 'HubSpot', status: 'Connected' },
  { id: 'mailchimp', name: 'Mailchimp', status: 'Connected' },
  { id: 'sendgrid', name: 'SendGrid', status: 'Connected' },
];
