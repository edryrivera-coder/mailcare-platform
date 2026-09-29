-- ============================================================================
-- MAILCARE POSTGRESQL PRODUCTION MIGRATION: 0001_INIT_MULTI_TENANT_SCHEMA
-- Enforces:
--   1. Multi-Tenant Row-Level Security (RLS) across all tables (Sec. 37, NFA-22)
--   2. Append-only immutability triggers on audit_events & verification_results (Sec. 34, NFA-52, NFA-53)
--   3. Zero raw email body persistence & zero plaintext password columns (NFA-14, NFA-15)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. ORGANIZATIONS (Tenant Root)
-- ----------------------------------------------------------------------------
CREATE TABLE organizations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    plan TEXT NOT NULL DEFAULT 'ENTERPRISE',
    isolation_level TEXT NOT NULL DEFAULT 'RLS_ENFORCED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. USERS
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Administrator',
    two_factor_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    language TEXT NOT NULL DEFAULT 'English (US)',
    time_zone TEXT NOT NULL DEFAULT '(GMT+08:00) Manila',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_org ON users(organization_id);

-- ----------------------------------------------------------------------------
-- 3. ACCOUNTS & 4. SUBSCRIPTIONS (NFA-21 Zero Data Brokerage, NFA-46 Retention)
-- ----------------------------------------------------------------------------
CREATE TABLE accounts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    owner_user_id TEXT NOT NULL REFERENCES users(id),
    account_type TEXT NOT NULL DEFAULT 'HYBRID_CONSUMER_ENTERPRISE',
    monthly_verify_quota INTEGER NOT NULL DEFAULT 5000000,
    monthly_verify_used INTEGER NOT NULL DEFAULT 0,
    rate_limit_per_minute INTEGER NOT NULL DEFAULT 100,
    zero_data_brokerage_opt_in BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_accounts_org ON accounts(organization_id);

CREATE TABLE subscriptions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan_code TEXT NOT NULL DEFAULT 'ENTERPRISE_PRO',
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    audit_retention_days INTEGER NOT NULL DEFAULT 365,
    batch_artifact_retention_days INTEGER NOT NULL DEFAULT 7,
    temp_result_retention_days INTEGER NOT NULL DEFAULT 14,
    current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_subscriptions_org ON subscriptions(organization_id);

-- ----------------------------------------------------------------------------
-- 5. OAUTH CONNECTIONS (NFA-15: Passwordless OAuth Only; KMS Encrypted Refresh Token)
-- ----------------------------------------------------------------------------
CREATE TABLE oauth_connections (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('gmail', 'microsoft365', 'outlook', 'yahoo')),
    provider_account_id TEXT NOT NULL,
    encrypted_refresh_token TEXT NOT NULL,
    kms_key_arn TEXT NOT NULL,
    scopes TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'CONNECTED',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, provider, provider_account_id)
);
CREATE INDEX idx_oauth_org ON oauth_connections(organization_id);

-- ----------------------------------------------------------------------------
-- 6. MAILBOXES & 7. THREADS & 8. MESSAGES METADATA (Sec. 7, NFA-14)
-- ----------------------------------------------------------------------------
CREATE TABLE mailboxes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_address TEXT NOT NULL,
    provider TEXT NOT NULL,
    sync_state TEXT NOT NULL DEFAULT 'SYNCED',
    sync_cursor TEXT,
    total_messages INTEGER NOT NULL DEFAULT 0,
    unread_messages INTEGER NOT NULL DEFAULT 0,
    archived_messages INTEGER NOT NULL DEFAULT 0,
    deleted_messages INTEGER NOT NULL DEFAULT 0,
    storage_recovered BIGINT NOT NULL DEFAULT 0,
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_mailboxes_org_user ON mailboxes(organization_id, user_id);

CREATE TABLE threads (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    mailbox_id TEXT NOT NULL REFERENCES mailboxes(id) ON DELETE CASCADE,
    provider_thread_id TEXT NOT NULL,
    message_count INTEGER NOT NULL DEFAULT 1,
    total_size_bytes INTEGER NOT NULL DEFAULT 0,
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_threads_mailbox_size ON threads(mailbox_id, total_size_bytes DESC);

CREATE TABLE messages_metadata (
    message_id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    mailbox_id TEXT NOT NULL REFERENCES mailboxes(id) ON DELETE CASCADE,
    provider_id TEXT NOT NULL,
    thread_id TEXT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    sender_domain TEXT NOT NULL,
    subject_summary TEXT NOT NULL,
    recipient_count INTEGER NOT NULL DEFAULT 1,
    timestamp TIMESTAMPTZ NOT NULL,
    message_size INTEGER NOT NULL,
    labels TEXT[] NOT NULL DEFAULT '{}',
    has_list_unsubscribe BOOLEAN NOT NULL DEFAULT FALSE,
    unsubscribe_method TEXT,
    classification TEXT NOT NULL,
    confidence_score DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    risk_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    trackers_blocked INTEGER NOT NULL DEFAULT 0,
    is_unread BOOLEAN NOT NULL DEFAULT FALSE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    is_quarantined BOOLEAN NOT NULL DEFAULT FALSE,
    snoozed_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_msg_mailbox_domain ON messages_metadata(mailbox_id, sender_domain);
CREATE INDEX idx_msg_mailbox_class ON messages_metadata(mailbox_id, classification);
CREATE INDEX idx_msg_mailbox_time ON messages_metadata(mailbox_id, timestamp DESC);
CREATE INDEX idx_msg_mailbox_size ON messages_metadata(mailbox_id, message_size DESC);

-- ----------------------------------------------------------------------------
-- 9. RULES (Structured JSON Conditions & Actions - Sec. 11)
-- ----------------------------------------------------------------------------
CREATE TABLE rules (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    mailbox_id TEXT NOT NULL REFERENCES mailboxes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    conditions JSONB NOT NULL,
    actions JSONB NOT NULL,
    priority INTEGER NOT NULL DEFAULT 100,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    executed_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_rules_mailbox_enabled ON rules(mailbox_id, enabled);

-- ----------------------------------------------------------------------------
-- 10. JOBS & 11. JOB ITEMS (Checkpointed 10k-Record Partitions - NFA-08..11)
-- ----------------------------------------------------------------------------
CREATE TABLE jobs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    job_code TEXT NOT NULL UNIQUE,
    workload_domain TEXT NOT NULL CHECK (workload_domain IN ('CONSUMER', 'ENTERPRISE')),
    queue_name TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Running', 'Completed', 'Failed', 'Paused')),
    total_items INTEGER NOT NULL DEFAULT 0,
    completed_items INTEGER NOT NULL DEFAULT 0,
    failed_items INTEGER NOT NULL DEFAULT 0,
    checkpoint_cursor INTEGER NOT NULL DEFAULT 0,
    idempotency_key TEXT UNIQUE,
    input_object_key TEXT,
    export_object_key TEXT,
    last_error_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
CREATE INDEX idx_jobs_org_status ON jobs(organization_id, status);

CREATE TABLE job_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    partition_index INTEGER NOT NULL,
    start_offset INTEGER NOT NULL,
    end_offset INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'QUEUED',
    attempts INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 5,
    next_retry_at TIMESTAMPTZ,
    dlq_reason TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (job_id, partition_index)
);
CREATE INDEX idx_job_items_org_status ON job_items(organization_id, status);

-- ----------------------------------------------------------------------------
-- 12. VERIFICATION RESULTS (Immutable Versioned Evidence - Sec. 19, NFA-32, NFA-52)
-- ----------------------------------------------------------------------------
CREATE TABLE verification_results (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    job_id TEXT REFERENCES jobs(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL CHECK (status IN ('DELIVERABLE', 'UNDELIVERABLE', 'RISKY', 'UNKNOWN')),
    score DOUBLE PRECISION NOT NULL,
    risk_score_100 INTEGER NOT NULL DEFAULT 5,
    domain_exists BOOLEAN NOT NULL,
    mx_valid BOOLEAN NOT NULL,
    catch_all BOOLEAN NOT NULL DEFAULT FALSE,
    smtp_status TEXT NOT NULL,
    disposable BOOLEAN NOT NULL DEFAULT FALSE,
    role_account BOOLEAN NOT NULL DEFAULT FALSE,
    spam_trap BOOLEAN NOT NULL DEFAULT FALSE,
    duration_ms INTEGER NOT NULL,
    engine_version TEXT NOT NULL DEFAULT '1.0.0',
    model_version TEXT,
    feature_version TEXT,
    scoring_version TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ver_org_email_ver ON verification_results(organization_id, email, version DESC);
CREATE INDEX idx_ver_org_status ON verification_results(organization_id, status);

-- ----------------------------------------------------------------------------
-- 13. CONTACTS, 14. API KEYS, 15. WEBHOOKS, 16. INTEGRATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE contacts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    external_crm_id TEXT,
    source_provider TEXT,
    latest_verification_id TEXT,
    latest_status TEXT NOT NULL DEFAULT 'UNKNOWN',
    suppressed BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, email)
);

CREATE TABLE api_keys (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_prefix TEXT NOT NULL,
    key_sha256_hash TEXT NOT NULL UNIQUE,
    scopes TEXT[] NOT NULL DEFAULT '{}',
    rate_limit_rpm INTEGER NOT NULL DEFAULT 600,
    last_used_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_api_keys_org ON api_keys(organization_id);

CREATE TABLE webhooks (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    target_url TEXT NOT NULL,
    hmac_secret_kms TEXT NOT NULL,
    subscribed_to TEXT[] NOT NULL DEFAULT '{}',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    failure_count INTEGER NOT NULL DEFAULT 0,
    last_delivery_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'CONNECTED',
    encrypted_credentials TEXT NOT NULL,
    sync_schedule_cron TEXT,
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, provider)
);

-- ----------------------------------------------------------------------------
-- 17. AUDIT EVENTS (Append-Only Immutable Audit Trail - Sec. 34, NFA-53)
-- ----------------------------------------------------------------------------
CREATE TABLE audit_events (
    event_id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    actor_id TEXT NOT NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    result TEXT NOT NULL CHECK (result IN ('SUCCESS', 'FAILURE')),
    correlation_id TEXT NOT NULL,
    metadata JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_org_time ON audit_events(organization_id, timestamp DESC);

-- ============================================================================
-- IMMUTABILITY ENFORCEMENT TRIGGERS (Sec. 34, NFA-52, NFA-53)
-- ============================================================================
CREATE OR REPLACE FUNCTION prevent_immutable_record_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Table % is append-only immutable (NFA-52 / NFA-53). UPDATE and DELETE are prohibited.', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_events_immutable
BEFORE UPDATE OR DELETE ON audit_events
FOR EACH ROW EXECUTE FUNCTION prevent_immutable_record_mutation();

CREATE TRIGGER trg_verification_results_immutable
BEFORE UPDATE OR DELETE ON verification_results
FOR EACH ROW EXECUTE FUNCTION prevent_immutable_record_mutation();

-- ============================================================================
-- MULTI-TENANT ROW-LEVEL SECURITY (RLS) POLICIES (Sec. 37, NFA-22)
-- ============================================================================
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'users', 'accounts', 'subscriptions', 'oauth_connections',
        'mailboxes', 'threads', 'messages_metadata', 'rules',
        'jobs', 'job_items', 'verification_results', 'contacts',
        'api_keys', 'webhooks', 'integrations', 'audit_events'
    ]
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
        EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY;', tbl);
        EXECUTE format(
            'CREATE POLICY tenant_isolation_policy ON %I
             USING (organization_id = current_setting(''app.current_organization_id'', true))
             WITH CHECK (organization_id = current_setting(''app.current_organization_id'', true));',
            tbl
        );
    END LOOP;
END $$;
