// ============================================================================
// ISOLATED WORKLOAD QUEUE TOPOLOGY & EVENT CATALOG (Sec. 22, 24, 31, NFA-05)
// ============================================================================

export const CONSUMER_QUEUES = {
  METADATA: 'consumer.metadata',
  MUTATIONS: 'consumer.mutations',
  UNSUBSCRIBE: 'consumer.unsubscribe',
  DLQ: 'consumer.dlq',
} as const;

export const ENTERPRISE_QUEUES = {
  SYNTAX: 'enterprise.syntax',
  DNS: 'enterprise.dns',
  SMTP: 'enterprise.smtp',
  RISK: 'enterprise.risk',
  EXPORT: 'enterprise.export',
  SYNC: 'enterprise.sync',
  DLQ: 'enterprise.dlq',
} as const;

export type DomainEventType =
  | 'message.indexed'
  | 'message.classified'
  | 'bulk_action.created'
  | 'bulk_action.completed'
  | 'unsubscribe.completed'
  | 'verification.created'
  | 'verification.completed'
  | 'batch.completed'
  | 'domain.blacklisted'
  | 'dmarc.alert'
  | 'integration.sync.completed';

export interface ImmutableDomainEvent<TPayload = Record<string, unknown>> {
  readonly event_id: string;
  readonly event_type: DomainEventType;
  readonly timestamp: string;
  readonly organization_id: string;
  readonly trace_id: string;
  readonly job_id?: string;
  readonly payload: TPayload;
}
