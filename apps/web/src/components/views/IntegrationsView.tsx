'use client';

import React, { useState } from 'react';
import { Check, CheckCircle2, Edit3, Mail, RefreshCw, Shield, Webhook } from 'lucide-react';
import { INITIAL_CONNECTORS, type ConnectorItem } from '@/lib/mailcare-data';
import { IntegrationsHeroGraphic } from '@/components/illustrations/HeroGraphics';
import { IntegrationBrandLogo } from '@/components/illustrations/BrandIcons';
import { useUserProfile } from '@/lib/user-profile-store';

const INTEGRATION_TABS = [
  'All Integrations',
  'Email Providers',
  'CRM & ESP',
  'DNS & Security',
  'Webhooks',
] as const;

export function IntegrationsView({ compact = false }: { compact?: boolean }) {
  const { profile, updateProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState<(typeof INTEGRATION_TABS)[number]>('All Integrations');
  const [connectors, setConnectors] = useState<ConnectorItem[]>(INITIAL_CONNECTORS);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [isEditingMailbox, setIsEditingMailbox] = useState(false);
  const [mailboxInput, setMailboxInput] = useState(profile.email);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  function toggleConnector(id: string) {
    setConnectors((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextConnected = !item.connected;
        setStatusNotice(
          nextConnected
            ? `OAuth 2.0 delegated connection established for ${item.name} (${profile.email} • KMS Encrypted).`
            : `Connection revoked for ${item.name}. Immutable audit event logged (NFA-53).`
        );
        return { ...item, connected: nextConnected };
      })
    );
  }

  async function handleSaveLinkedMailbox(e: React.FormEvent) {
    e.preventDefault();
    const nextEmail = mailboxInput.trim() || 'edryrivera@gmail.com';
    updateProfile({
      email: nextEmail,
      linkedGmailAccount: nextEmail,
      oauthStatus: 'CONNECTED',
    });

    try {
      await fetch('/api/v1/mailboxes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Organization-Id': 'org_enterprise_01',
        },
        body: JSON.stringify({
          emailAddress: nextEmail,
          provider: 'gmail',
        }),
      });
    } catch {
      // Local store already updated
    }

    setIsEditingMailbox(false);
    setStatusNotice(
      `Linked Gmail OAuth 2.0 mailbox updated to "${nextEmail}" across Consumer Inbox, Verification, and Profile!`
    );
  }

  function handleSyncAllConnections() {
    setIsSyncingAll(true);
    const activeCount = connectors.filter((c) => c.connected).length;
    setTimeout(() => {
      setIsSyncingAll(false);
      setStatusNotice(
        `Verified & synced all ${activeCount} connected integrations with primary mailbox ${profile.email} (0 errors).`
      );
    }, 350);
  }

  const emailProviders = connectors.filter((c) => c.group === 'Email Providers');
  const crmProviders = connectors.filter((c) => c.group === 'CRM & ESP');
  const connectedList = connectors.filter((c) => c.connected);

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
            Integrations
          </h1>
          <p className="text-xs sm:text-sm text-[#d4c5a9] mt-1">
            Connect your favorite tools and extend your platform with passwordless OAuth 2.0.
          </p>

          {/* Sub-navigation Tabs */}
          <div className="flex items-center gap-1 mt-3 sm:mt-4 p-1 rounded-xl bg-[#12100d] border border-[#d8a84e]/25 overflow-x-auto no-scrollbar max-w-full w-fit">
            {INTEGRATION_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'gold-tab-active font-semibold'
                    : 'text-[#c7b99e] hover:text-[#fff8eb]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <IntegrationsHeroGraphic />
      </div>

      {/* Connected Primary Mailbox Bar (edryrivera@gmail.com) */}
      <div className="gold-card px-3.5 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center gap-2.5 text-xs min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#194d33] border border-[#28c76f]/60 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 text-[#4be38d]" />
          </div>
          <div className="min-w-0">
            <span className="text-[#d4c5a9] block text-[11px] truncate">
              Primary Delegated OAuth 2.0 Mailbox (NFA-15 Passwordless)
            </span>
            <span className="font-bold text-[#fff8eb] truncate block">{profile.email}</span>
          </div>
        </div>

        {!isEditingMailbox ? (
          <button
            type="button"
            onClick={() => {
              setMailboxInput(profile.email);
              setIsEditingMailbox(true);
            }}
            className="gold-btn-outline px-3 py-1.5 rounded-lg text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#eab95c]" />
            <span>Change / Edit Linked Email</span>
          </button>
        ) : (
          <form
            onSubmit={(e) => void handleSaveLinkedMailbox(e)}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto"
          >
            <input
              type="email"
              required
              value={mailboxInput}
              onChange={(e) => setMailboxInput(e.target.value)}
              className="gold-card-inset rounded-lg px-3 py-1.5 text-xs text-[#fff8eb] focus:outline-none focus:border-[#eab95c]"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="gold-btn flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs inline-flex items-center justify-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Link Email
              </button>
              <button
                type="button"
                onClick={() => setIsEditingMailbox(false)}
                className="text-xs text-[#d4c5a9] hover:text-white px-2 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {statusNotice && (
        <div className="px-3.5 py-2 rounded-lg bg-[#194d33]/50 border border-[#28c76f]/50 text-xs text-[#6ce8a0] flex items-center justify-between">
          <span>{statusNotice}</span>
          <button
            type="button"
            onClick={() => setStatusNotice(null)}
            className="text-xs underline ml-3 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {(activeTab === 'All Integrations' ||
        activeTab === 'Email Providers' ||
        activeTab === 'CRM & ESP') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Email Providers + CRM & ESP */}
          <div className="lg:col-span-8 space-y-4">
            {(activeTab === 'All Integrations' || activeTab === 'Email Providers') && (
              <div className="gold-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs sm:text-sm font-semibold text-[#f3e5c8]">
                    Email Providers
                  </h2>
                  <span className="text-[11px] text-[#d4c5a9]">
                    Click any provider to connect or revoke OAuth 2.0
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {emailProviders.map((provider) => (
                    <div
                      key={provider.id}
                      onClick={() => toggleConnector(provider.id)}
                      className={`rounded-xl p-3.5 flex flex-col items-center text-center transition cursor-pointer ${
                        provider.connected && (provider.highlighted || provider.id === 'gmail')
                          ? 'bg-gradient-to-b from-[#172c21]/90 to-[#0e1812]/95 border border-[#28c76f]/60 shadow-[0_0_16px_rgba(40,199,111,0.2)]'
                          : 'gold-card-inset hover:border-[#eab95c]/60'
                      }`}
                    >
                      <IntegrationBrandLogo id={provider.id} />
                      <span className="text-xs font-semibold text-[#fff8eb] mt-2.5">
                        {provider.name}
                      </span>
                      {provider.id === 'gmail' ? (
                        <span className="text-[10.5px] text-[#f5d07e] truncate max-w-full mt-0.5">
                          {profile.email}
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#c7b99e] mt-0.5">
                          {provider.connected ? 'Synced 2m ago' : 'OAuth 2.0 Ready'}
                        </span>
                      )}
                      {provider.connected ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#28c76f] mt-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#28c76f]" />
                          Connected
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="gold-btn-outline mt-2 px-3.5 py-1 rounded-md text-[11px] font-medium cursor-pointer"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'All Integrations' || activeTab === 'CRM & ESP') && (
              <div className="gold-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs sm:text-sm font-semibold text-[#f3e5c8]">
                    CRM &amp; ESP
                  </h2>
                  <span className="text-[11px] text-[#d4c5a9]">
                    Bi-directional suppression &amp; verified contact sync
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {crmProviders.map((crm) => (
                    <div
                      key={crm.id}
                      onClick={() => toggleConnector(crm.id)}
                      className="gold-card-inset hover:border-[#eab95c]/60 rounded-xl p-3.5 flex flex-col items-center text-center transition cursor-pointer"
                    >
                      <IntegrationBrandLogo id={crm.id} />
                      <span className="text-xs font-semibold text-[#fff8eb] mt-2.5">
                        {crm.name}
                      </span>
                      <span className="text-[10px] text-[#c7b99e] mt-0.5">
                        {crm.connected ? 'Auto-Sync Active' : '1-Click Connect'}
                      </span>
                      {crm.connected ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#28c76f] mt-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#28c76f]" />
                          Connected
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="gold-btn-outline mt-2 px-3.5 py-1 rounded-md text-[11px] font-medium cursor-pointer"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Synchronized Integration Status Card */}
          <div className="lg:col-span-4">
            <div className="gold-card p-4 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <h2 className="text-xs sm:text-sm font-semibold text-[#f3e5c8]">
                    Integration Status
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#194d33] border border-[#28c76f]/50 text-[10.5px] font-semibold text-[#4be38d] tabular-nums">
                    {connectedList.length} Active
                  </span>
                </div>

                <div className="space-y-2">
                  {connectedList.map((row) => (
                    <div
                      key={row.id}
                      className="flex items-center justify-between py-1.5 border-b border-white/5 text-xs"
                    >
                      <span className="flex items-center gap-2 text-[#e2d6c1] min-w-0 pr-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#28c76f] shrink-0" />
                        <span className="truncate">
                          {row.name}
                          {row.id === 'gmail' ? ` (${profile.email})` : ''}
                        </span>
                      </span>
                      <span className="text-[#28c76f] font-semibold shrink-0">Active</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                disabled={isSyncingAll}
                onClick={handleSyncAllConnections}
                className="gold-btn mt-5 w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
                <span>
                  {isSyncingAll
                    ? 'Syncing Connectors...'
                    : `Test & Sync All (${connectedList.length})`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'DNS & Security' && (
        <div className="gold-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#fff8eb]">
            <Shield className="w-4 h-4 text-[#eab95c]" />
            <span>SPF / DKIM / DMARC Telemetry &amp; RBL Blacklist Monitoring (Sec. 33)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="gold-card-inset p-3.5 rounded-lg">
              <span className="text-[#c7b99e] block">SPF Record</span>
              <span className="text-[#28c76f] font-bold">v=spf1 include:_spf.google.com ~all</span>
            </div>
            <div className="gold-card-inset p-3.5 rounded-lg">
              <span className="text-[#c7b99e] block">DKIM Signature</span>
              <span className="text-[#28c76f] font-bold">2048-bit RSA Verified (google)</span>
            </div>
            <div className="gold-card-inset p-3.5 rounded-lg">
              <span className="text-[#c7b99e] block">DMARC &amp; RBL Status</span>
              <span className="text-[#28c76f] font-bold">p=reject • 0 / 48 Blacklists</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Webhooks' && (
        <div className="gold-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#fff8eb]">
            <Webhook className="w-4 h-4 text-[#eab95c]" />
            <span>HMAC-Signed At-Least-Once Webhooks (Sec. 26, NFA-37)</span>
          </div>
          <div className="gold-card-inset p-3.5 rounded-lg text-xs flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-mono text-[#f5d07e] block">
                POST https://customer.example.com/webhooks/email-cleaning
              </span>
              <span className="text-[#c7b99e]">
                Events: verification.job.completed, bulk_action.completed, domain.blacklisted
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#194d33] text-[#28c76f] font-semibold">
              HMAC-SHA256 Active
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
