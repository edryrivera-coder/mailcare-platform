// ============================================================================
// MULTI-TENANT REPOSITORIES (Sec. 23, 34, 37, NFA-11, NFA-22, NFA-52, NFA-53)
// ============================================================================

import type {
  BatchJob,
  FilteringRule,
  MessageMetadata,
  VerificationResult,
} from '@mailcare/shared-types';
import { withTenantDatabaseContext, type TenantDbContext } from '../client';

export interface AuditEventRecord {
  event_id: string;
  organization_id: string;
  actor_id: string;
  action: string;
  resource: string;
  resource_id: string;
  result: 'SUCCESS' | 'FAILURE';
  correlation_id: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// In-memory transactional ledger backing development runtime when Postgres container is offline
const verificationLedger = new Map<string, Array<VerificationResult & { organizationId: string; version: number }>>();
const auditLedger: AuditEventRecord[] = [
  {
    event_id: 'audit_2026_001',
    organization_id: 'org_enterprise_01',
    actor_id: 'user_edry_01',
    action: 'OAUTH_CONNECTION_VERIFIED',
    resource: 'mailbox',
    resource_id: 'mbx_gmail_01',
    result: 'SUCCESS',
    correlation_id: 'req_init_001',
    timestamp: '2026-09-29T02:15:00Z',
  },
  {
    event_id: 'audit_2026_002',
    organization_id: 'org_enterprise_01',
    actor_id: 'user_edry_01',
    action: 'BATCH_VERIFICATION_COMPLETED',
    resource: 'job',
    resource_id: 'BJ-2025-00120',
    result: 'SUCCESS',
    correlation_id: 'req_init_002',
    timestamp: '2026-09-29T02:45:00Z',
  },
];

export const VerificationResultsRepository = {
  /**
   * NFA-52: Results are immutable after finalization.
   * Re-verifying an email creates a new version (version + 1) rather than overwriting historical evidence.
   */
  async appendImmutableResult(
    ctx: TenantDbContext,
    result: VerificationResult
  ): Promise<VerificationResult & { version: number; organizationId: string }> {
    return withTenantDatabaseContext(ctx, async (scoped) => {
      const key = `${scoped.organizationId}:${result.email.toLowerCase()}`;
      const existingVersions = verificationLedger.get(key) ?? [];
      const nextVersion = existingVersions.length + 1;
      const versionedRecord = {
        ...result,
        organizationId: scoped.organizationId,
        version: nextVersion,
      };
      verificationLedger.set(key, [versionedRecord, ...existingVersions]);
      return versionedRecord;
    });
  },

  async listByTenant(
    ctx: TenantDbContext
  ): Promise<Array<VerificationResult & { version: number; organizationId: string }>> {
    return withTenantDatabaseContext({ ...ctx, readOnly: true }, async (scoped) => {
      const output: Array<VerificationResult & { version: number; organizationId: string }> = [];
      for (const [key, versions] of verificationLedger.entries()) {
        if (key.startsWith(`${scoped.organizationId}:`)) {
          output.push(...versions);
        }
      }
      return output;
    });
  },
};

export const AuditEventsRepository = {
  /**
   * Sec. 34 & NFA-53: Append-only immutable administrative and operational audit events.
   */
  async appendAuditEvent(
    ctx: TenantDbContext,
    params: {
      action: string;
      resource: string;
      resourceId: string;
      result: 'SUCCESS' | 'FAILURE';
      metadata?: Record<string, unknown>;
    }
  ): Promise<AuditEventRecord> {
    return withTenantDatabaseContext(ctx, async (scoped) => {
      const record: AuditEventRecord = {
        event_id: `audit_${Math.random().toString(36).slice(2, 10)}`,
        organization_id: scoped.organizationId,
        actor_id: scoped.actorId,
        action: params.action,
        resource: params.resource,
        resource_id: params.resourceId,
        result: params.result,
        correlation_id: scoped.correlationId,
        timestamp: new Date().toISOString(),
        metadata: params.metadata,
      };
      auditLedger.unshift(record);
      return record;
    });
  },

  async listAuditEvents(ctx: TenantDbContext, limit = 50): Promise<AuditEventRecord[]> {
    return withTenantDatabaseContext({ ...ctx, readOnly: true }, async (scoped) => {
      return auditLedger
        .filter((e) => e.organization_id === scoped.organizationId)
        .slice(0, limit);
    });
  },
};

export type { BatchJob, FilteringRule, MessageMetadata };
