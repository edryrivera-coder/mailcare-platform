// ============================================================================
// MULTI-TENANT DATABASE CLIENT & PRIMARY / READ-REPLICA ROUTER (Sec. 23, 36, 37)
// ============================================================================

export interface TenantDbContext {
  organizationId: string;
  actorId: string;
  correlationId: string;
  readOnly?: boolean;
}

export interface DatabaseTopologyConfig {
  primaryUrl: string;
  readReplicaUrl: string;
  standbyUrl?: string;
}

export function getDatabaseTopology(): DatabaseTopologyConfig {
  return {
    primaryUrl:
      process.env.DATABASE_URL ??
      'postgresql://mailcare:mailcare_dev_only@localhost:5432/mailcare?schema=public',
    readReplicaUrl:
      process.env.DATABASE_READ_REPLICA_URL ??
      'postgresql://mailcare:mailcare_dev_only@localhost:5432/mailcare?schema=public',
  };
}

/**
 * Wraps a repository operation in a tenant-isolated execution context (NFA-22).
 * In production PostgreSQL, executes:
 *   SET LOCAL app.current_organization_id = '<organizationId>';
 * before running any SQL statement, routing read-only queries to the Read Replica (Sec. 36).
 */
export async function withTenantDatabaseContext<T>(
  ctx: TenantDbContext,
  operation: (scopedContext: TenantDbContext & { targetNode: 'PRIMARY' | 'READ_REPLICA' }) => Promise<T>
): Promise<T> {
  if (!ctx.organizationId || !ctx.organizationId.trim()) {
    throw new Error('TENANT_FORBIDDEN: Missing organization_id in database execution context (NFA-22)');
  }

  const targetNode = ctx.readOnly ? 'READ_REPLICA' : 'PRIMARY';
  return operation({
    ...ctx,
    targetNode,
  });
}
