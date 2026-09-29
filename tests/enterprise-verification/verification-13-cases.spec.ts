// ============================================================================
// ACCEPTANCE TEST SUITE: 13 ENTERPRISE VERIFICATION SCENARIOS (Sec. 46)
// ============================================================================

export const ENTERPRISE_13_ACCEPTANCE_CASES = [
  { id: 'TC-01', scenario: 'Valid address', input: 'john.doe@company.com', expectedStatus: 'DELIVERABLE' },
  { id: 'TC-02', scenario: 'Invalid address (syntax)', input: 'john.doe@@company..com', expectedStatus: 'UNDELIVERABLE' },
  { id: 'TC-03', scenario: 'Nonexistent domain (NXDOMAIN)', input: 'user@nonexistent-domain-9999.invalid', expectedStatus: 'UNDELIVERABLE' },
  { id: 'TC-04', scenario: 'No MX record', input: 'user@nomx.example.org', expectedStatus: 'UNDELIVERABLE' },
  { id: 'TC-05', scenario: 'Valid MX record', input: 'verified@company.com', expectedStatus: 'DELIVERABLE' },
  { id: 'TC-06', scenario: 'SMTP accepted (250 OK)', input: 'active@company.com', expectedStatus: 'DELIVERABLE' },
  { id: 'TC-07', scenario: 'SMTP rejected (550 User Unknown)', input: 'bounced@company.com', expectedStatus: 'UNDELIVERABLE' },
  { id: 'TC-08', scenario: 'Greylisting (451 Temporary - retry)', input: 'greylist@partner.org', expectedStatus: 'UNKNOWN' },
  { id: 'TC-09', scenario: 'SMTP timeout (>3s)', input: 'slow@timeout-mx.net', expectedStatus: 'UNKNOWN' },
  { id: 'TC-10', scenario: 'Catch-all domain', input: 'anyone@catchall-corp.io', expectedStatus: 'RISKY' },
  { id: 'TC-11', scenario: 'Disposable address', input: 'temp88@mailinator.com', expectedStatus: 'RISKY' },
  { id: 'TC-12', scenario: 'Role address', input: 'support@company.com', expectedStatus: 'RISKY' },
  { id: 'TC-13', scenario: 'Spam trap / honeypot', input: 'trap-honeypot@rbl-monitor.org', expectedStatus: 'UNDELIVERABLE' },
] as const;
