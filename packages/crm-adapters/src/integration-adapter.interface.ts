// ============================================================================
// CRM & ESP INTEGRATION ADAPTER LAYER (Sec. 25, NFA-35, NFA-36)
// ============================================================================

export interface ContactRecord {
  externalId: string;
  email: string;
  verificationStatus?: 'DELIVERABLE' | 'UNDELIVERABLE' | 'RISKY' | 'UNKNOWN';
  score?: number;
}

export interface IntegrationAdapter {
  readonly providerName: 'salesforce' | 'hubspot' | 'marketo' | 'mailchimp' | 'sendgrid' | 'convertkit' | 'klaviyo';
  authenticate(): Promise<{ connected: boolean; organizationId: string }>;
  pullContacts(cursor?: string): Promise<{ contacts: ContactRecord[]; nextCursor?: string }>;
  updateContact(contact: ContactRecord): Promise<void>;
  suppressContact(email: string, reason: string): Promise<void>;
  pushResults(batchJobId: string, results: ContactRecord[]): Promise<{ updated: number; failed: number }>;
}
