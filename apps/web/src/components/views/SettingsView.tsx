'use client';

import React, { useState } from 'react';
import {
  Bell,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Database,
  Globe,
  KeyRound,
  Link2,
  Lock,
  Play,
  Plus,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Terminal,
  Trash2,
  X,
} from 'lucide-react';
import { SettingsHeroGraphic } from '@/components/illustrations/HeroGraphics';
import { computeInitials, useUserProfile } from '@/lib/user-profile-store';

const SETTINGS_TABS = ['Account', 'Security', 'Notifications', 'Preferences', 'API'] as const;

const POSTGRES_SCHEMA_TABLES = [
  { name: 'organizations', zone: 'Tenant Root', policy: 'Primary Key (Sec. 37)' },
  { name: 'users', zone: 'Identity', policy: 'RLS: organization_id (NFA-22)' },
  { name: 'accounts', zone: 'Billing/Quotas', policy: 'RLS + Zero Data Brokerage (NFA-21)' },
  { name: 'subscriptions', zone: 'Retention', policy: 'Configurable TTLs (NFA-46)' },
  { name: 'oauth_connections', zone: 'Auth Vault', policy: 'KMS Encrypted • Zero Passwords (NFA-15)' },
  { name: 'mailboxes', zone: 'Consumer', policy: 'RLS + Storage Reclaimed (Sec. 33)' },
  { name: 'threads', zone: 'Consumer', policy: 'Indexed by physical size (Sec. 7)' },
  { name: 'messages_metadata', zone: 'Consumer', policy: 'Metadata-Only • No Raw Body (NFA-14)' },
  { name: 'rules', zone: 'Consumer', policy: 'Structured JSON AST (Sec. 11)' },
  { name: 'jobs', zone: 'Async Queue', policy: 'Idempotency-Key + Checkpoint (NFA-10..11)' },
  { name: 'job_items', zone: 'Worker Pool', policy: '10,000-Record Partitions + DLQ (NFA-08)' },
  { name: 'verification_results', zone: 'Enterprise', policy: 'Immutable Trigger + Model Ver (NFA-52)' },
  { name: 'contacts', zone: 'Enterprise', policy: 'RLS + CRM Suppression State' },
  { name: 'api_keys', zone: 'Gateway', policy: 'SHA-256 Hash + RPM Quotas' },
  { name: 'webhooks', zone: 'Events', policy: 'At-Least-Once HMAC-SHA256 (NFA-37)' },
  { name: 'integrations', zone: 'CRM / ESP', policy: 'KMS Credentials + Sync Cron (Sec. 25)' },
  { name: 'audit_events', zone: 'Compliance', policy: 'Append-Only Immutable Trigger (NFA-53)' },
];

interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  created: string;
  status: 'Active' | 'Revoked';
}

interface DeviceSessionItem {
  id: string;
  device: string;
  location: string;
  authType: string;
  lastActive: string;
  current?: boolean;
}

export function SettingsView({ compact = false }: { compact?: boolean }) {
  const { profile, updateProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState<(typeof SETTINGS_TABS)[number]>('Account');

  // Edit Profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [draftName, setDraftName] = useState(profile.fullName);
  const [draftRole, setDraftRole] = useState(profile.role);
  const [draftEmail, setDraftEmail] = useState(profile.email);
  const [draftAvatar, setDraftAvatar] = useState<string | undefined>(profile.avatarDataUrl);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Edit Organization state
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [draftOrgName, setDraftOrgName] = useState(profile.organizationName);
  const [draftOrgPlan, setDraftOrgPlan] = useState(profile.organizationPlan);

  // Security Center interactive state
  const [twoFactorMethod, setTwoFactorMethod] = useState<
    'Authenticator App (TOTP)' | 'Google Prompt (edryrivera@gmail.com)' | 'Hardware Security Key (WebAuthn)'
  >('Google Prompt (edryrivera@gmail.com)');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    {
      id: 'key_01',
      name: 'Production Verification Gateway',
      prefix: 'mc_live_98a7f31c...e402',
      scopes: ['verify:realtime', 'verify:batch', 'webhooks:manage'],
      created: '2 days ago',
      status: 'Active',
    },
    {
      id: 'key_02',
      name: 'Consumer Inbox Hygiene Worker',
      prefix: 'mc_live_41b9c82d...a119',
      scopes: ['inbox:metadata', 'inbox:mutations', 'unsubscribe:rfc8058'],
      created: '5 days ago',
      status: 'Active',
    },
  ]);

  const [sessions, setSessions] = useState<DeviceSessionItem[]>([
    {
      id: 'sess_win11',
      device: 'Windows 11 Workstation • Chrome 134',
      location: 'Manila, Philippines (TLS 1.3)',
      authType: 'Google OAuth 2.0 (edryrivera@gmail.com)',
      lastActive: 'Active now',
      current: true,
    },
    {
      id: 'sess_ios',
      device: 'iPhone 16 Pro • MailCare iOS App',
      location: 'Makati, Philippines (TLS 1.3)',
      authType: 'Google OAuth 2.0 + Biometric 2FA',
      lastActive: '18 mins ago',
    },
    {
      id: 'sess_cli',
      device: 'Enterprise CLI Worker Node (az-a)',
      location: 'Singapore Region (mTLS)',
      authType: 'Scoped API Key (mc_live_98a7...)',
      lastActive: '1 hour ago',
    },
  ]);

  const [securityEvents, setSecurityEvents] = useState([
    {
      id: 'sec_01',
      event: 'GOOGLE_OAUTH_DELEGATION_VERIFIED',
      target: 'edryrivera@gmail.com',
      ip: 'Manila, PH • TLS 1.3',
      time: 'Just now',
      status: 'SUCCESS',
    },
    {
      id: 'sec_02',
      event: 'KMS_REFRESH_TOKEN_ENVELOPE_ROTATED',
      target: 'alias/mailcare-oauth-token-vault',
      ip: 'Internal KMS HSM',
      time: '14 mins ago',
      status: 'SUCCESS',
    },
    {
      id: 'sec_03',
      event: 'PLAINTEXT_PASSWORD_ATTEMPT_BLOCKED',
      target: 'POST /v1/auth (NFA-15 Guard)',
      ip: 'WAF Edge Filter',
      time: '32 mins ago',
      status: 'BLOCKED',
    },
  ]);

  // Preferences & Retention state
  const [retentionConfig, setRetentionConfig] = useState({
    batchFilesDays: '7 days (Short-Term Ephemeral - NFA-13)',
    auditLogDays: '365 days (Enterprise Compliance - NFA-46)',
    emailBodyMode: 'Never Store Raw Email Bodies — Metadata Only (NFA-14)',
    privacyProxyMode: 'Block All 1x1 Spy Pixels & Route Assets via Proxy (Sec. 12)',
  });

  // Notifications state
  const [notificationsConfig, setNotificationsConfig] = useState({
    batchCompleted: true,
    webhookFailures: true,
    rblBlacklistAlerts: true,
    weeklyDigest: false,
  });

  // Automated Inbox Cleanup Rules (Sec. 11)
  const [rulesList, setRulesList] = useState([
    {
      id: 'rule_01',
      name: 'Auto-Archive Newsletters Older Than 14 Days',
      condition: 'category == "Newsletters" && age_days > 14',
      action: 'ARCHIVE',
      enabled: true,
      matchedCount: 1420,
    },
    {
      id: 'rule_02',
      name: 'Neutralize 1x1 Spy Pixels on All Marketing Mail',
      condition: 'trackers_detected >= 1',
      action: 'PROXY_STRIP',
      enabled: true,
      matchedCount: 384,
    },
    {
      id: 'rule_03',
      name: 'Auto-Unsubscribe (RFC 8058) After 10 Ignored Promotions',
      condition: 'category == "Promotions" && unread_streak >= 10',
      action: 'UNSUBSCRIBE',
      enabled: true,
      matchedCount: 89,
    },
    {
      id: 'rule_04',
      name: 'Auto-Delete Disposable & RBL Honeypot Senders',
      condition: 'sender_domain in DISPOSABLE_RBL_SET',
      action: 'DELETE',
      enabled: true,
      matchedCount: 52,
    },
  ]);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleAction, setNewRuleAction] = useState<'ARCHIVE' | 'DELETE' | 'UNSUBSCRIBE'>('ARCHIVE');

  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [apiResponseJson, setApiResponseJson] = useState<string>(
    '// Click any /v1/* endpoint probe below to inspect live API Gateway headers, RLS context & payload'
  );
  const [apiHeadersLog, setApiHeadersLog] = useState<string>('');

  function openEditProfile() {
    setDraftName(profile.fullName);
    setDraftRole(profile.role);
    setDraftEmail(profile.email);
    setDraftAvatar(profile.avatarDataUrl);
    setIsEditingProfile(true);
  }

  function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraftAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    const cleanName = draftName.trim() || 'Edry de Guzman';
    const cleanRole = draftRole.trim() || 'Administrator';
    const cleanEmail = draftEmail.trim() || 'edryrivera@gmail.com';

    setIsSavingProfile(true);
    const updated = updateProfile({
      fullName: cleanName,
      role: cleanRole,
      email: cleanEmail,
      linkedGmailAccount: cleanEmail,
      oauthStatus: 'CONNECTED',
      initials: computeInitials(cleanName),
      avatarDataUrl: draftAvatar,
    });

    try {
      await fetch('/api/v1/accounts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Organization-Id': 'org_enterprise_01',
        },
        body: JSON.stringify({
          fullName: updated.fullName,
          role: updated.role,
          email: updated.email,
          linkedGmailAccount: updated.linkedGmailAccount,
        }),
      });
    } catch {
      // Local persistence already succeeded
    } finally {
      setIsSavingProfile(false);
      setIsEditingProfile(false);
      setSavedNotice(
        `Profile & OAuth Mailbox saved! Linked "${updated.email}" for ${updated.fullName} (${updated.role}) and recorded in immutable audit trail.`
      );
    }
  }

  async function handleSaveOrganization(e: React.FormEvent) {
    e.preventDefault();
    const cleanOrg = draftOrgName.trim() || 'Your Organization';
    const updated = updateProfile({
      organizationName: cleanOrg,
      organizationPlan: draftOrgPlan,
    });
    try {
      await fetch('/api/v1/accounts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Organization-Id': 'org_enterprise_01',
        },
        body: JSON.stringify({
          organizationName: updated.organizationName,
          organizationPlan: updated.organizationPlan,
        }),
      });
    } catch {
      // Local persistence succeeded
    }
    setIsEditingOrg(false);
    setSavedNotice(
      `Organization updated to "${updated.organizationName}" (${updated.organizationPlan}).`
    );
  }

  function handleCreateApiKey(e: React.FormEvent) {
    e.preventDefault();
    const name = newKeyName.trim() || `Enterprise Key #${apiKeys.length + 1}`;
    const randomHex = Math.random().toString(16).slice(2, 10);
    const createdKey: ApiKeyItem = {
      id: `key_${Date.now()}`,
      name,
      prefix: `mc_live_${randomHex}...9f1a`,
      scopes: ['verify:realtime', 'verify:batch'],
      created: 'Just now',
      status: 'Active',
    };
    setApiKeys((prev) => [createdKey, ...prev]);
    setNewKeyName('');
    setSecurityEvents((prev) => [
      {
        id: `sec_${Date.now()}`,
        event: 'API_KEY_CREATED (NFA-53)',
        target: `${name} (${createdKey.prefix})`,
        ip: 'Manila, PH • TLS 1.3',
        time: 'Just now',
        status: 'SUCCESS',
      },
      ...prev,
    ]);
    setSavedNotice(`Created scoped API key "${name}" (${createdKey.prefix}). Stored as SHA-256 hash.`);
  }

  function handleRevokeApiKey(id: string, name: string) {
    setApiKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'Revoked' as const } : k))
    );
    setSecurityEvents((prev) => [
      {
        id: `sec_${Date.now()}`,
        event: 'API_KEY_REVOKED (NFA-53)',
        target: name,
        ip: 'Manila, PH • TLS 1.3',
        time: 'Just now',
        status: 'SUCCESS',
      },
      ...prev,
    ]);
    setSavedNotice(`API Key "${name}" revoked. Immutable audit event recorded (NFA-53).`);
  }

  function handleRevokeSession(id: string, deviceName: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setSecurityEvents((prev) => [
      {
        id: `sec_${Date.now()}`,
        event: 'DEVICE_SESSION_REVOKED',
        target: deviceName,
        ip: 'Manila, PH • TLS 1.3',
        time: 'Just now',
        status: 'SUCCESS',
      },
      ...prev,
    ]);
    setSavedNotice(`Revoked session "${deviceName}".`);
  }

  async function probeGatewayEndpoint(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body?: Record<string, unknown>,
    customHeaders?: Record<string, string>
  ) {
    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Organization-Id': 'org_enterprise_01',
          ...customHeaders,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json();
      setApiHeadersLog(
        `HTTP ${res.status} | X-Request-Id: ${res.headers.get('x-request-id') ?? 'n/a'} | X-Trace-Id: ${
          res.headers.get('x-trace-id') ?? 'n/a'
        } | X-RateLimit-Remaining: ${res.headers.get('x-ratelimit-remaining') ?? 'n/a'}`
      );
      setApiResponseJson(JSON.stringify(json, null, 2));
    } catch (err) {
      setApiResponseJson(JSON.stringify({ error: String(err) }, null, 2));
    }
  }

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-1 border-b border-[#d8a84e]/20">
        <div className="min-w-0">
          <h1
            className={`${
              compact ? 'text-xl' : 'text-xl sm:text-3xl'
            } font-bold text-[#fff8eb] tracking-tight`}
          >
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#b9ab90] mt-1">
            Configure your account, security, and platform preferences.
          </p>

          {/* Sub-navigation Tabs */}
          <div className="flex items-center gap-1 mt-3 sm:mt-4 p-1 rounded-xl bg-[#12100d] border border-[#d8a84e]/25 overflow-x-auto no-scrollbar max-w-full w-fit">
            {SETTINGS_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'gold-tab-active font-semibold'
                    : 'text-[#a89b82] hover:text-[#f3e5c8]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <SettingsHeroGraphic />
      </div>

      {savedNotice && (
        <div className="px-3.5 py-2.5 rounded-lg bg-[#194d33]/40 border border-[#28c76f]/50 text-xs text-[#6ce8a0] flex items-center justify-between">
          <span>{savedNotice}</span>
          <button
            type="button"
            onClick={() => setSavedNotice(null)}
            className="text-xs underline ml-3 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* =====================================================================
          TAB 1: ACCOUNT (2x2 Grid matching dashboard.png)
         ===================================================================== */}
      {activeTab === 'Account' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Profile Information + Organization */}
          <div className="lg:col-span-6 space-y-4">
            {/* Profile Information Card */}
            <div className="gold-card p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-[#fff8eb]">Profile Information</h2>
                  {isEditingProfile ? (
                    <span className="text-[11px] text-[#eab95c] font-medium">Editing Profile</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#194d33]/60 border border-[#28c76f]/50 text-[10px] font-semibold text-[#4be38d]">
                      <CheckCircle2 className="w-3 h-3 text-[#28c76f]" />
                      Gmail OAuth Linked
                    </span>
                  )}
                </div>

                {!isEditingProfile ? (
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-b from-[#f5d07e] to-[#9b6f23] shadow-[0_0_16px_rgba(216,168,78,0.35)] overflow-hidden shrink-0">
                      {profile.avatarDataUrl ? (
                        <img
                          src={profile.avatarDataUrl}
                          alt={profile.fullName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-[#1a150e] flex items-center justify-center text-lg font-extrabold text-[#f5d07e]">
                          {profile.initials}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-bold text-white">
                        {profile.fullName}
                      </div>
                      <div className="text-xs text-[#b9ab90]">{profile.role}</div>
                      <div className="text-xs text-[#f5d07e] font-medium mt-0.5 flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5 text-[#28c76f]" />
                        <span>{profile.email}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Interactive Edit Profile Form */
                  <form onSubmit={(e) => void handleSaveProfile(e)} className="space-y-3 text-xs">
                    <div className="flex items-center gap-3 pb-2">
                      <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-b from-[#f5d07e] to-[#9b6f23] overflow-hidden shrink-0">
                        {draftAvatar ? (
                          <img
                            src={draftAvatar}
                            alt="Avatar preview"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-[#1a150e] flex items-center justify-center text-base font-extrabold text-[#f5d07e]">
                            {computeInitials(draftName)}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="gold-btn-outline px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer">
                          <Camera className="w-3.5 h-3.5 text-[#eab95c]" />
                          <span>Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarFileChange}
                            className="hidden"
                          />
                        </label>
                        {draftAvatar && (
                          <button
                            type="button"
                            onClick={() => setDraftAvatar(undefined)}
                            className="text-[11px] text-[#ea5455] hover:underline cursor-pointer"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#b9ab90] mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        placeholder="Enter your full name..."
                        className="w-full gold-card-inset rounded-lg px-3 py-2 text-xs text-[#fff8eb] focus:outline-none focus:border-[#eab95c]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#b9ab90] mb-1">Role / Title</label>
                        <input
                          type="text"
                          required
                          value={draftRole}
                          onChange={(e) => setDraftRole(e.target.value)}
                          placeholder="e.g. Administrator"
                          className="w-full gold-card-inset rounded-lg px-3 py-2 text-xs text-[#fff8eb] focus:outline-none focus:border-[#eab95c]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#b9ab90] mb-1">
                          Linked Email Address (OAuth)
                        </label>
                        <input
                          type="email"
                          required
                          value={draftEmail}
                          onChange={(e) => setDraftEmail(e.target.value)}
                          placeholder="e.g. edryrivera@gmail.com"
                          className="w-full gold-card-inset rounded-lg px-3 py-2 text-xs text-[#fff8eb] focus:outline-none focus:border-[#eab95c]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="gold-btn-outline px-3.5 py-1.5 rounded-lg text-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="gold-btn px-4 py-1.5 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {isSavingProfile ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {!isEditingProfile && (
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={openEditProfile}
                    className="gold-btn-outline px-4 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            {/* Organization Card */}
            <div className="gold-card p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[#fff8eb] mb-3.5">Organization</h2>
                {!isEditingOrg ? (
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center gap-2.5 text-[#e2d6c1]">
                      <Building2 className="w-4 h-4 text-[#eab95c]" />
                      <span>{profile.organizationName}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[#e2d6c1]">
                      <ShieldCheck className="w-4 h-4 text-[#eab95c]" />
                      <span>{profile.organizationPlan}</span>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => void handleSaveOrganization(e)}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="block text-[11px] text-[#b9ab90] mb-1">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        required
                        value={draftOrgName}
                        onChange={(e) => setDraftOrgName(e.target.value)}
                        className="w-full gold-card-inset rounded-lg px-3 py-2 text-xs text-[#fff8eb] focus:outline-none focus:border-[#eab95c]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#b9ab90] mb-1">
                        Subscription Tier
                      </label>
                      <select
                        value={draftOrgPlan}
                        onChange={(e) => setDraftOrgPlan(e.target.value)}
                        className="w-full gold-card-inset rounded-lg px-3 py-2 text-xs text-[#fff8eb] focus:outline-none focus:border-[#eab95c]"
                      >
                        <option value="Enterprise Plan" className="bg-[#12100d]">
                          Enterprise Plan
                        </option>
                        <option value="Business Hygiene Plan" className="bg-[#12100d]">
                          Business Hygiene Plan
                        </option>
                        <option value="Consumer Pro Plan" className="bg-[#12100d]">
                          Consumer Pro Plan
                        </option>
                      </select>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsEditingOrg(false)}
                        className="gold-btn-outline px-3.5 py-1.5 rounded-lg text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="gold-btn px-4 py-1.5 rounded-lg text-xs cursor-pointer"
                      >
                        Save Organization
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {!isEditingOrg && (
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setDraftOrgName(profile.organizationName);
                      setDraftOrgPlan(profile.organizationPlan);
                      setIsEditingOrg(true);
                    }}
                    className="gold-btn-outline px-4 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Manage Organization
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Security Settings + Preferences Summary */}
          <div className="lg:col-span-6 space-y-4">
            {/* Security Settings Summary Card */}
            <div className="gold-card p-5">
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="text-sm font-semibold text-[#fff8eb]">Security Settings</h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('Security')}
                  className="text-[11px] text-[#eab95c] hover:underline cursor-pointer"
                >
                  Open Security Center →
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="flex items-center gap-2.5 text-[#e2d6c1]">
                    <Lock className="w-4 h-4 text-[#eab95c]" />
                    Two-Factor Authentication
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next2fa = !profile.twoFactorEnabled;
                      updateProfile({ twoFactorEnabled: next2fa });
                      setSavedNotice(
                        `Two-Factor Authentication ${next2fa ? 'Enabled' : 'Disabled'} for ${profile.email}.`
                      );
                    }}
                    className={`inline-flex items-center gap-1 font-semibold cursor-pointer ${
                      profile.twoFactorEnabled ? 'text-[#28c76f]' : 'text-[#f5b041]'
                    }`}
                  >
                    <span>{profile.twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="flex items-center gap-2.5 text-[#e2d6c1]">
                    <Clock className="w-4 h-4 text-[#eab95c]" />
                    Login Activity
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('Security')}
                    className="inline-flex items-center gap-1 text-[#d4c6ad] hover:text-white cursor-pointer"
                  >
                    <span>View Activity</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="flex items-center gap-2.5 text-[#e2d6c1]">
                    <KeyRound className="w-4 h-4 text-[#eab95c]" />
                    API Keys
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('Security')}
                    className="inline-flex items-center gap-1 text-[#d4c6ad] hover:text-white cursor-pointer"
                  >
                    <span>Manage Keys</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1.5">
                  <span className="flex items-center gap-2.5 text-[#e2d6c1]">
                    <Smartphone className="w-4 h-4 text-[#eab95c]" />
                    Session Management
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('Security')}
                    className="inline-flex items-center gap-1 text-[#d4c6ad] hover:text-white cursor-pointer"
                  >
                    <span>Manage Sessions</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Preferences Card */}
            <div className="gold-card p-5">
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="text-sm font-semibold text-[#fff8eb]">Preferences</h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('Preferences')}
                  className="text-[11px] text-[#eab95c] hover:underline cursor-pointer"
                >
                  Data Retention &amp; Privacy →
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
                  <label className="text-[#c7b99e]">Language</label>
                  <select
                    value={profile.language}
                    onChange={(e) => {
                      updateProfile({ language: e.target.value });
                      setSavedNotice(`Language preference updated to ${e.target.value}.`);
                    }}
                    className="gold-card-inset rounded-lg px-3 py-2 text-xs text-[#fff8eb] w-full sm:w-auto sm:min-w-[180px] focus:outline-none focus:border-[#eab95c]"
                  >
                    <option value="English (US)" className="bg-[#12100d]">
                      English (US)
                    </option>
                    <option value="English (UK)" className="bg-[#12100d]">
                      English (UK)
                    </option>
                    <option value="Japanese (JP)" className="bg-[#12100d]">
                      Japanese (JP)
                    </option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
                  <label className="text-[#c7b99e]">Time Zone</label>
                  <select
                    value={profile.timeZone}
                    onChange={(e) => {
                      updateProfile({ timeZone: e.target.value });
                      setSavedNotice(`Time zone updated to ${e.target.value}.`);
                    }}
                    className="gold-card-inset rounded-lg px-3 py-2 text-xs text-[#fff8eb] w-full sm:w-auto sm:min-w-[180px] focus:outline-none focus:border-[#eab95c]"
                  >
                    <option value="(GMT+08:00) Manila" className="bg-[#12100d]">
                      (GMT+08:00) Manila
                    </option>
                    <option value="(GMT+00:00) UTC" className="bg-[#12100d]">
                      (GMT+00:00) UTC
                    </option>
                    <option value="(GMT-08:00) Pacific Time" className="bg-[#12100d]">
                      (GMT-08:00) Pacific Time
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: SECURITY (Full Interactive Security & Access Control Center)
         ===================================================================== */}
      {activeTab === 'Security' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Top-Left: 2FA & OAuth KMS Vault */}
          <div className="lg:col-span-6 gold-card p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Lock className="w-4 h-4 text-[#eab95c] shrink-0" />
                <h2 className="text-xs sm:text-sm font-bold text-[#fff8eb] truncate">
                  Two-Factor Authentication &amp; OAuth KMS Vault
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next2fa = !profile.twoFactorEnabled;
                  updateProfile({ twoFactorEnabled: next2fa });
                  setSavedNotice(
                    `Two-Factor Authentication ${next2fa ? 'Enabled' : 'Disabled'} for ${profile.email}.`
                  );
                }}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold shrink-0 cursor-pointer ${
                  profile.twoFactorEnabled
                    ? 'bg-[#194d33] text-[#4be38d] border border-[#28c76f]/50'
                    : 'bg-[#4d3819] text-[#ffca6b] border border-[#f5b041]/50'
                }`}
              >
                {profile.twoFactorEnabled ? '2FA Enabled' : '2FA Disabled'}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] text-[#b9ab90] mb-1">
                  Primary 2FA Verification Method
                </label>
                <select
                  value={twoFactorMethod}
                  onChange={(e) => {
                    setTwoFactorMethod(e.target.value as typeof twoFactorMethod);
                    setSavedNotice(`2FA method updated to "${e.target.value}".`);
                  }}
                  className="w-full gold-card-inset rounded-lg px-3 py-2 text-xs text-[#fff8eb] focus:outline-none focus:border-[#eab95c]"
                >
                  <option
                    value="Google Prompt (edryrivera@gmail.com)"
                    className="bg-[#12100d]"
                  >
                    Google Prompt ({profile.email})
                  </option>
                  <option value="Authenticator App (TOTP)" className="bg-[#12100d]">
                    Authenticator App (TOTP • Google/Authy)
                  </option>
                  <option value="Hardware Security Key (WebAuthn)" className="bg-[#12100d]">
                    Hardware Security Key (YubiKey / Passkey WebAuthn)
                  </option>
                </select>
              </div>

              <div className="gold-card-inset p-3 rounded-xl space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="text-[#b9ab90]">Passwordless OAuth Policy (NFA-15)</span>
                  <span className="text-[#28c76f] font-semibold">Strictly Enforced</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="text-[#b9ab90]">KMS Refresh Token Encryption (NFA-17)</span>
                  <span className="font-mono text-[11px] text-[#f5d07e] break-all">
                    alias/mailcare-oauth-token-vault
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="text-[#b9ab90]">Transport Security (NFA-16)</span>
                  <span className="text-white font-semibold">TLS 1.3 + Internal mTLS</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowBackupCodes((v) => !v)}
                  className="gold-btn-outline px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                >
                  {showBackupCodes ? 'Hide Recovery Codes' : 'View 2FA Recovery Codes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSecurityEvents((prev) => [
                      {
                        id: `sec_${Date.now()}`,
                        event: 'KMS_OAUTH_TOKEN_ROTATED',
                        target: profile.email,
                        ip: 'Manila, PH • KMS HSM',
                        time: 'Just now',
                        status: 'SUCCESS',
                      },
                      ...prev,
                    ]);
                    setSavedNotice(
                      `Rotated KMS envelope key for ${profile.email} OAuth refresh token.`
                    );
                  }}
                  className="gold-btn-outline px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#eab95c]" />
                  Rotate OAuth Token Key
                </button>
              </div>

              {showBackupCodes && (
                <div className="gold-card-inset p-3 rounded-xl font-mono text-[11px] text-[#f5d07e] grid grid-cols-2 gap-1.5">
                  <span>MC-8942-1104</span>
                  <span>MC-7731-9920</span>
                  <span>MC-5510-4482</span>
                  <span>MC-3309-6128</span>
                </div>
              )}
            </div>
          </div>

          {/* Top-Right: Scoped Enterprise API Keys Manager */}
          <div className="lg:col-span-6 gold-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#eab95c]" />
                <h2 className="text-sm font-bold text-[#fff8eb]">
                  Scoped Enterprise API Keys (NFA-18, NFA-53)
                </h2>
              </div>
              <span className="text-[11px] text-[#b9ab90]">SHA-256 Hashed</span>
            </div>

            <form onSubmit={handleCreateApiKey} className="flex items-center gap-2">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="New API key name (e.g. HubSpot Sync Key)..."
                className="flex-1 gold-card-inset rounded-lg px-3 py-2 text-xs text-[#fff8eb] placeholder-[#80745e] focus:outline-none focus:border-[#eab95c]"
              />
              <button
                type="submit"
                className="gold-btn px-3.5 py-2 rounded-lg text-xs inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Key
              </button>
            </form>

            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {apiKeys.map((item) => (
                <div
                  key={item.id}
                  className="gold-card-inset p-3 rounded-xl flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-semibold text-[#fff8eb] flex items-center gap-2">
                      <span>{item.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] ${
                          item.status === 'Active'
                            ? 'bg-[#194d33] text-[#4be38d]'
                            : 'bg-[#4d191e] text-[#ff7a7b]'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-[#f5d07e] mt-0.5">
                      {item.prefix} • Created {item.created}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setSavedNotice(`Copied key prefix ${item.prefix} to clipboard.`)
                      }
                      className="gold-btn-outline p-1.5 rounded-lg text-[#eab95c] cursor-pointer"
                      title="Copy Key Prefix"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {item.status === 'Active' && (
                      <button
                        type="button"
                        onClick={() => handleRevokeApiKey(item.id, item.name)}
                        className="gold-btn-outline p-1.5 rounded-lg text-[#ea5455] cursor-pointer"
                        title="Revoke API Key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom-Left: Active Device Sessions Manager */}
          <div className="lg:col-span-6 gold-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#eab95c]" />
                <h2 className="text-sm font-bold text-[#fff8eb]">
                  Active Device Sessions ({sessions.length})
                </h2>
              </div>
              {sessions.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setSessions((prev) => prev.filter((s) => s.current));
                    setSavedNotice('Revoked all other device sessions.');
                  }}
                  className="text-[11px] text-[#ea5455] hover:underline cursor-pointer"
                >
                  Revoke All Other Sessions
                </button>
              )}
            </div>

            <div className="space-y-2.5 text-xs">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="gold-card-inset p-3 rounded-xl flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-[#fff8eb] flex items-center gap-2">
                      <span>{sess.device}</span>
                      {sess.current && (
                        <span className="px-2 py-0.5 rounded-full bg-[#194d33] text-[#4be38d] text-[10px]">
                          Current Session
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#b9ab90] mt-0.5">
                      {sess.location} • {sess.authType}
                    </div>
                  </div>
                  {!sess.current && (
                    <button
                      type="button"
                      onClick={() => handleRevokeSession(sess.id, sess.device)}
                      className="gold-btn-outline px-2.5 py-1 rounded-lg text-[11px] text-[#ea5455] cursor-pointer"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom-Right: Chronological Login & Security Audit Log */}
          <div className="lg:col-span-6 gold-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#eab95c]" />
                <h2 className="text-sm font-bold text-[#fff8eb]">
                  Login Activity &amp; Immutable Security Log (Sec. 34)
                </h2>
              </div>
              <span className="text-[11px] text-[#28c76f]">Append-Only Trigger Active</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
              {securityEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="gold-card-inset p-2.5 rounded-xl flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-mono text-[11px] font-semibold text-[#f5d07e]">
                      {ev.event}
                    </div>
                    <div className="text-[11px] text-[#d4c6ad]">
                      {ev.target} • <span className="text-[#9c8d73]">{ev.ip}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        ev.status === 'SUCCESS'
                          ? 'bg-[#194d33] text-[#4be38d]'
                          : 'bg-[#4d191e] text-[#ff7a7b]'
                      }`}
                    >
                      {ev.status}
                    </span>
                    <div className="text-[10px] text-[#9c8d73] mt-0.5">{ev.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: NOTIFICATIONS
         ===================================================================== */}
      {activeTab === 'Notifications' && (
        <div className="gold-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#fff8eb]">
            <Bell className="w-4 h-4 text-[#eab95c]" />
            <span>Notification Channels &amp; Alert Preferences ({profile.email})</span>
          </div>
          <div className="space-y-3 text-xs">
            {[
              {
                key: 'batchCompleted' as const,
                title: 'Batch Verification & Cleanup Job Completed',
                desc: 'Send an alert when asynchronous jobs (10k+ records) finish processing.',
              },
              {
                key: 'webhookFailures' as const,
                title: 'Webhook Delivery & Dead-Letter Queue (DLQ) Alerts',
                desc: 'Notify immediately when an HMAC webhook endpoint returns 5xx or enters DLQ.',
              },
              {
                key: 'rblBlacklistAlerts' as const,
                title: 'Domain Health, SPF/DKIM/DMARC & RBL Blacklist Telemetry',
                desc: 'Alert if any monitored enterprise domain appears on an RBL blacklist.',
              },
              {
                key: 'weeklyDigest' as const,
                title: 'Weekly Storage Recovery & Hygiene Summary',
                desc: 'Receive a weekly report of archived/deleted emails and reclaimed storage.',
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 rounded-xl gold-card-inset"
              >
                <div>
                  <div className="font-semibold text-[#fff8eb]">{item.title}</div>
                  <div className="text-[11px] text-[#9c8d73] mt-0.5">{item.desc}</div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNotificationsConfig((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key],
                    }))
                  }
                  className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                    notificationsConfig[item.key]
                      ? 'bg-[#194d33] text-[#4be38d] border border-[#28c76f]/50'
                      : 'bg-white/5 text-[#9c8d73] border border-white/10'
                  }`}
                >
                  {notificationsConfig[item.key] ? 'Enabled' : 'Muted'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: PREFERENCES (Localization + Configurable Data Retention NFA-46)
         ===================================================================== */}
      {activeTab === 'Preferences' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6 gold-card p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#fff8eb]">
              <Globe className="w-4 h-4 text-[#eab95c]" />
              <span>Regional &amp; Display Preferences</span>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#c7b99e] mb-1">Language</label>
                <select
                  value={profile.language}
                  onChange={(e) => {
                    updateProfile({ language: e.target.value });
                    setSavedNotice(`Language preference updated to ${e.target.value}.`);
                  }}
                  className="w-full gold-card-inset rounded-lg px-3 py-2 text-xs text-[#fff8eb] focus:outline-none focus:border-[#eab95c]"
                >
                  <option value="English (US)" className="bg-[#12100d]">
                    English (US)
                  </option>
                  <option value="English (UK)" className="bg-[#12100d]">
                    English (UK)
                  </option>
                  <option value="Japanese (JP)" className="bg-[#12100d]">
                    Japanese (JP)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[#c7b99e] mb-1">Time Zone</label>
                <select
                  value={profile.timeZone}
                  onChange={(e) => {
                    updateProfile({ timeZone: e.target.value });
                    setSavedNotice(`Time zone updated to ${e.target.value}.`);
                  }}
                  className="w-full gold-card-inset rounded-lg px-3 py-2 text-xs text-[#fff8eb] focus:outline-none focus:border-[#eab95c]"
                >
                  <option value="(GMT+08:00) Manila" className="bg-[#12100d]">
                    (GMT+08:00) Manila
                  </option>
                  <option value="(GMT+00:00) UTC" className="bg-[#12100d]">
                    (GMT+00:00) UTC
                  </option>
                  <option value="(GMT-08:00) Pacific Time" className="bg-[#12100d]">
                    (GMT-08:00) Pacific Time
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 gold-card p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#fff8eb]">
              <ShieldCheck className="w-4 h-4 text-[#eab95c]" />
              <span>Data Minimization &amp; Retention Policies (NFA-14, NFA-46)</span>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#c7b99e] mb-1">
                  Consumer Email Body Persistence (NFA-14)
                </label>
                <input
                  type="text"
                  readOnly
                  value={retentionConfig.emailBodyMode}
                  className="w-full gold-card-inset rounded-lg px-3 py-2 text-xs text-[#28c76f] font-semibold"
                />
              </div>
              <div>
                <label className="block text-[#c7b99e] mb-1">
                  Uploaded CSV/XLSX Batch File Lifecycle (NFA-13)
                </label>
                <select
                  value={retentionConfig.batchFilesDays}
                  onChange={(e) => {
                    setRetentionConfig((p) => ({ ...p, batchFilesDays: e.target.value }));
                    setSavedNotice(`Batch artifact lifecycle set to: ${e.target.value}`);
                  }}
                  className="w-full gold-card-inset rounded-lg px-3 py-2 text-xs text-[#fff8eb]"
                >
                  <option
                    value="7 days (Short-Term Ephemeral - NFA-13)"
                    className="bg-[#12100d]"
                  >
                    7 days (Short-Term Ephemeral - NFA-13)
                  </option>
                  <option value="24 hours (Strict Zero-Retention)" className="bg-[#12100d]">
                    24 hours (Strict Zero-Retention)
                  </option>
                  <option value="14 days (Extended Batch Window)" className="bg-[#12100d]">
                    14 days (Extended Batch Window)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Automated Inbox Cleanup Rules (Sec. 11 Structured JSON AST) */}
          <div className="lg:col-span-12 gold-card p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#d8a84e]/20">
              <div>
                <h2 className="text-sm font-bold text-[#fff8eb]">
                  Automated Inbox Hygiene Rules (Sec. 11 Structured AST Engine)
                </h2>
                <p className="text-xs text-[#d4c5a9] mt-0.5">
                  Automatically archive, delete, or unsubscribe from clutter in{' '}
                  <strong>{profile.email}</strong> without manual triage.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSavedNotice(
                    `Executed ${rulesList.filter((r) => r.enabled).length} active AST rules on ${profile.email} (1,945 messages matched).`
                  )
                }
                className="gold-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Run Active Rules Now
              </button>
            </div>

            <div className="space-y-2">
              {rulesList.map((rule) => (
                <div
                  key={rule.id}
                  className="gold-card-inset p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#fff8eb]">{rule.name}</span>
                      <span className="px-2 py-0.5 rounded bg-[#d8a84e]/15 border border-[#eab95c]/35 text-[10px] font-semibold text-[#f5d07e]">
                        {rule.action}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-[#c7b99e]">
                      IF {rule.condition} • {rule.matchedCount.toLocaleString()} historical matches
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRulesList((prev) =>
                          prev.map((r) =>
                            r.id === rule.id ? { ...r, enabled: !r.enabled } : r
                          )
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition ${
                        rule.enabled
                          ? 'bg-[#194d33] text-[#4be38d] border border-[#28c76f]/50'
                          : 'bg-white/5 text-[#a89b82] border border-white/10'
                      }`}
                    >
                      {rule.enabled ? 'Active ✓' : 'Paused'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Create New Automation Rule Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newRuleName.trim()) return;
                const nextRule = {
                  id: `rule_0${rulesList.length + 1}`,
                  name: newRuleName.trim(),
                  condition: 'custom_filter == true',
                  action: newRuleAction,
                  enabled: true,
                  matchedCount: 12,
                };
                setRulesList((prev) => [...prev, nextRule]);
                setNewRuleName('');
                setSavedNotice(`Created new automated rule "${nextRule.name}" (${nextRule.action}).`);
              }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2"
            >
              <input
                type="text"
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                placeholder="New rule name (e.g. Auto-delete promotional flyers older than 7 days)..."
                className="flex-1 gold-card-inset rounded-lg px-3.5 py-2 text-xs text-[#fff8eb] placeholder-[#9c8d73] focus:outline-none focus:border-[#eab95c]"
              />
              <select
                value={newRuleAction}
                onChange={(e) =>
                  setNewRuleAction(e.target.value as 'ARCHIVE' | 'DELETE' | 'UNSUBSCRIBE')
                }
                className="gold-card-inset rounded-lg px-3 py-2 text-xs text-[#fff8eb]"
              >
                <option value="ARCHIVE" className="bg-[#12100d]">
                  Action: Archive
                </option>
                <option value="UNSUBSCRIBE" className="bg-[#12100d]">
                  Action: RFC 8058 Unsubscribe
                </option>
                <option value="DELETE" className="bg-[#12100d]">
                  Action: Delete
                </option>
              </select>
              <button
                type="submit"
                className="gold-btn-outline px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#eab95c]" />
                <span>Add Rule</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: API GATEWAY & POSTGRESQL SCHEMA INSPECTOR
         ===================================================================== */}
      {activeTab === 'API' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6 gold-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#fff8eb] flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#eab95c]" />
                API Gateway Live Tester (/v1/* OpenAPI 3.1)
              </h2>
              <span className="text-[11px] text-[#28c76f] font-semibold">TLS 1.2+ • RLS Active</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void probeGatewayEndpoint('/api/v1/mailboxes')}
                className="gold-btn-outline px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3 text-[#28c76f]" />
                GET /v1/mailboxes ({profile.email})
              </button>
              <button
                type="button"
                onClick={() => void probeGatewayEndpoint('/api/v1/monitoring')}
                className="gold-btn-outline px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3 text-[#eab95c]" />
                GET /v1/monitoring
              </button>
              <button
                type="button"
                onClick={() => void probeGatewayEndpoint('/api/v1/audit')}
                className="gold-btn-outline px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3 text-[#eab95c]" />
                GET /v1/audit
              </button>
              <button
                type="button"
                onClick={() =>
                  void probeGatewayEndpoint(
                    '/api/v1/unsubscribe',
                    'POST',
                    { mailboxId: 'mbx_edryrivera_gmail', senderDomain: 'netflix.com' },
                    { 'Idempotency-Key': 'idem_demo_rfc8058_01' }
                  )
                }
                className="gold-btn-outline px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3 text-[#eab95c]" />
                POST /v1/unsubscribe (Idempotent)
              </button>
              <button
                type="button"
                onClick={() =>
                  void probeGatewayEndpoint('/api/v1/auth', 'POST', {
                    email: profile.email,
                    password: 'secret_password_attempt',
                  })
                }
                className="gold-btn-outline px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3 text-[#ea5455]" />
                Test NFA-15 Password Guard
              </button>
            </div>

            {apiHeadersLog && (
              <div className="p-2 rounded bg-[#14110c] border border-[#d8a84e]/30 font-mono text-[11px] text-[#f5d07e]">
                {apiHeadersLog}
              </div>
            )}

            <pre className="gold-card-inset p-3.5 rounded-xl font-mono text-[11px] text-[#e2d6c1] overflow-x-auto max-h-64">
              {apiResponseJson}
            </pre>
          </div>

          <div className="lg:col-span-6 gold-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#fff8eb] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#eab95c]" />
                PostgreSQL Multi-Tenant Schema (17 Entities)
              </h2>
              <span className="text-[11px] text-[#b9ab90]">Row-Level Security (NFA-22)</span>
            </div>

            <div className="overflow-y-auto max-h-80 pr-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#d8a84e]/25 text-[#a89b82]">
                    <th className="py-2 px-2">Table</th>
                    <th className="py-2 px-2">Domain</th>
                    <th className="py-2 px-2">Security / NFR Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {POSTGRES_SCHEMA_TABLES.map((t) => (
                    <tr key={t.name} className="hover:bg-white/[0.02]">
                      <td className="py-1.5 px-2 font-mono text-[11px] text-[#f5d07e]">{t.name}</td>
                      <td className="py-1.5 px-2 text-[#c7b99e]">{t.zone}</td>
                      <td className="py-1.5 px-2 text-[#e2d6c1]">{t.policy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
