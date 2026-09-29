'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Globe,
  Server,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  UploadCloud,
  History,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  XCircle,
  Send,
  Ban,
} from 'lucide-react';
import type { CheckState, VerificationResult } from '@mailcare/shared-types';
import {
  DEFAULT_VERIFICATION_RESULT,
  INITIAL_VERIFICATION_HISTORY,
  VERIFICATION_STATS_BREAKDOWN,
  evaluateEmailPipeline,
} from '@/lib/mailcare-data';
import { VerificationHeroGraphic } from '@/components/illustrations/HeroGraphics';

const PRESET_TEST_EMAILS = [
  { label: 'My Gmail (edryrivera@gmail.com)', email: 'edryrivera@gmail.com' },
  { label: 'Valid Corp', email: 'john.doe@company.com' },
  { label: 'Role Account', email: 'support@company.com' },
  { label: 'Disposable', email: 'temp88@mailinator.com' },
  { label: 'Catch-All', email: 'exec@catchall-enterprise.io' },
  { label: 'Syntax Error', email: 'broken@@address..com' },
];

export function EmailVerificationView({ compact = false }: { compact?: boolean }) {
  const [activeTab, setActiveTab] = useState<'Single Verification' | 'Bulk Verification' | 'History'>(
    'Single Verification'
  );
  const [emailInput, setEmailInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentResult, setCurrentResult] = useState<VerificationResult>(DEFAULT_VERIFICATION_RESULT);
  const [historyList, setHistoryList] = useState<VerificationResult[]>(INITIAL_VERIFICATION_HISTORY);
  const [bulkUploadNotice, setBulkUploadNotice] = useState<string | null>(null);
  const [nextActionNotice, setNextActionNotice] = useState<string | null>(null);

  async function handleVerify(targetEmail?: string) {
    const query = (targetEmail ?? emailInput).trim() || 'john.doe@company.com';
    setIsVerifying(true);
    setNextActionNotice(null);
    try {
      const response = await fetch('/api/v1/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: query }),
      });
      if (response.ok) {
        const data = (await response.json()) as VerificationResult;
        setCurrentResult(data);
        setHistoryList((prev) => [data, ...prev.filter((item) => item.email !== data.email).slice(0, 9)]);
      } else {
        const fallback = evaluateEmailPipeline(query);
        setCurrentResult(fallback);
      }
    } catch {
      const fallback = evaluateEmailPipeline(query);
      setCurrentResult(fallback);
    } finally {
      setIsVerifying(false);
    }
  }

  function renderCheckValue(state: CheckState) {
    if (state === 'Valid') {
      return <span className="text-[#28c76f] font-semibold text-sm">Valid</span>;
    }
    if (state === 'Risky') {
      return <span className="text-[#f5b041] font-semibold text-sm">Risky</span>;
    }
    return <span className="text-[#ea5455] font-semibold text-sm">{state}</span>;
  }

  function renderStatusPill(badge: CheckState) {
    if (badge === 'Valid') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#194d33] border border-[#28c76f]/60 text-[#4be38d] text-xs font-semibold shadow-[0_0_12px_rgba(40,199,111,0.3)]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#28c76f]" />
          Valid
        </span>
      );
    }
    if (badge === 'Risky') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4d3819] border border-[#f5b041]/60 text-[#ffca6b] text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-[#f5b041]" />
          Risky
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4d191e] border border-[#ea5455]/60 text-[#ff7a7b] text-xs font-semibold">
        <XCircle className="w-3.5 h-3.5 text-[#ea5455]" />
        Invalid
      </span>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-1 border-b border-[#d8a84e]/20">
        <div className="min-w-0">
          <h1 className={`${compact ? 'text-xl' : 'text-xl sm:text-3xl'} font-bold text-[#fff8eb] tracking-tight`}>
            Email Verification
          </h1>
          <p className="text-xs sm:text-sm text-[#d4c5a9] mt-1">
            Validate, clean, and improve your email data quality in &lt;1.0s.
          </p>

          {/* Sub-navigation Tabs */}
          <div className="flex items-center gap-1 mt-3 sm:mt-4 p-1 rounded-xl bg-[#12100d] border border-[#d8a84e]/25 overflow-x-auto no-scrollbar max-w-full w-fit">
            {(['Single Verification', 'Bulk Verification', 'History'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
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
        <VerificationHeroGraphic />
      </div>

      {activeTab === 'Single Verification' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* Left Column: Input Card + Result Card */}
          <div className="lg:col-span-7 space-y-4">
            {/* Verify an Email Address Card */}
            <div className="gold-card p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-sm font-semibold text-[#f7edd9]">Verify an Email Address</h2>
                <span className="text-[11px] text-[#d4c5a9] flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3 h-3 text-[#eab95c]" />
                  SLA &lt;1.0s ({currentResult.processing.durationMs}ms)
                </span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleVerify();
                }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
              >
                <input
                  type="text"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter email address (e.g. john.doe@company.com)..."
                  className="flex-1 gold-card-inset rounded-lg px-3.5 py-2.5 text-sm text-[#fff7e6] placeholder-[#9c8d73] focus:outline-none focus:border-[#eab95c]"
                />
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="gold-btn px-6 py-2.5 rounded-lg text-sm cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isVerifying ? 'Checking...' : 'Verify'}
                </button>
              </form>

              {!compact && (
                <div className="space-y-2.5 mt-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-[#c7b99e] mr-1 font-medium">Instant test presets:</span>
                    {PRESET_TEST_EMAILS.map((preset) => (
                      <button
                        key={preset.email}
                        type="button"
                        onClick={() => {
                          setEmailInput(preset.email);
                          void handleVerify(preset.email);
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-[#1b1711] border border-[#d8a84e]/30 text-[#e4d5b7] hover:border-[#eab95c] hover:text-white transition cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] text-[#b9ab90] pt-1">
                    <span>✓ Zero-Log PII Redaction (NFA-39) • Immutable Versioned Record</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('Bulk Verification')}
                      className="text-[#f5d07e] font-semibold hover:underline cursor-pointer"
                    >
                      Have a CSV list? Bulk Verify →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Verification Result Card */}
            <div className="gold-card p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#d4c5a9]">
                  Verification Result
                </h3>
                <span className="text-[11px] font-mono text-[#c7b99e] truncate">
                  Model: {currentResult.processing.modelVersion ?? 'deterministic-v1'}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-3.5 border-b border-[#d8a84e]/20">
                <span className="text-sm sm:text-lg font-bold text-white break-all">
                  {currentResult.email}
                </span>
                {renderStatusPill(currentResult.displayBadge)}
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="flex items-center gap-2.5 text-xs sm:text-sm text-[#dfd3bc]">
                    <Terminal className="w-4 h-4 text-[#d8a84e]" />
                    Syntax
                  </span>
                  {renderCheckValue(currentResult.checks.syntax)}
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="flex items-center gap-2.5 text-xs sm:text-sm text-[#dfd3bc]">
                    <Globe className="w-4 h-4 text-[#d8a84e]" />
                    Domain (DNS)
                  </span>
                  {renderCheckValue(currentResult.checks.domainDns)}
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="flex items-center gap-2.5 text-xs sm:text-sm text-[#dfd3bc]">
                    <Server className="w-4 h-4 text-[#d8a84e]" />
                    MX Record
                  </span>
                  {renderCheckValue(currentResult.checks.mxRecord)}
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="flex items-center gap-2.5 text-xs sm:text-sm text-[#dfd3bc]">
                    <ShieldCheck className="w-4 h-4 text-[#d8a84e]" />
                    SMTP
                  </span>
                  {renderCheckValue(currentResult.checks.smtp)}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-2.5 text-xs sm:text-sm text-[#dfd3bc]">
                    <ShieldAlert className="w-4 h-4 text-[#d8a84e]" />
                    Risk Score
                  </span>
                  <span className="text-sm font-bold text-[#fff8eb]">
                    {currentResult.riskLabel} ({currentResult.riskScore100}/100)
                  </span>
                </div>
              </div>

              {/* High-Converting Next Best Action Footer */}
              {!compact && (
                <div className="mt-4 pt-3.5 border-t border-[#d8a84e]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <span className="text-xs text-[#d4c5a9]">
                    {currentResult.displayBadge === 'Valid'
                      ? 'Recommended Action: Safe for outbound campaigns & CRM sync.'
                      : 'Recommended Action: Suppress address to protect sender reputation.'}
                  </span>
                  <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto shrink-0">
                    {currentResult.displayBadge === 'Valid' ? (
                      <button
                        type="button"
                        onClick={() =>
                          setNextActionNotice(
                            `Synced "${currentResult.email}" (Valid • ${currentResult.riskScore100}/100) to HubSpot & Salesforce CRM!`
                          )
                        }
                        className="gold-btn px-3 py-2 sm:py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 shrink-0" />
                        <span>Sync to CRM</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setNextActionNotice(
                            `Added "${currentResult.email}" (${currentResult.displayBadge}) to Global Suppression List!`
                          )
                        }
                        className="gold-btn px-3 py-2 sm:py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Ban className="w-3.5 h-3.5 shrink-0" />
                        <span>Suppress</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setActiveTab('Bulk Verification')}
                      className="gold-btn-outline px-3 py-2 sm:py-1.5 rounded-lg text-xs font-medium flex items-center justify-center cursor-pointer"
                    >
                      Bulk Verify
                    </button>
                  </div>
                </div>
              )}

              {nextActionNotice && (
                <div className="mt-3 px-3 py-2 rounded-lg bg-[#194d33]/55 border border-[#28c76f]/50 text-xs text-[#6ce8a0] flex items-center justify-between">
                  <span>{nextActionNotice}</span>
                  <button
                    type="button"
                    onClick={() => setNextActionNotice(null)}
                    className="text-xs text-[#d4c5a9] hover:text-white ml-2 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Verification Stats Card */}
          <div className="lg:col-span-5">
            <div className="gold-card p-5 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[#f7edd9] mb-4">Verification Stats</h2>

                {/* Glowing Gold Donut Gauge */}
                <div className="relative w-40 h-40 mx-auto my-2 flex items-center justify-center">
                  <div className="absolute inset-2 rounded-full bg-[#eab95c]/15 blur-xl" />
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <defs>
                      <linearGradient id="VerifyRingGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fff3d1" />
                        <stop offset="55%" stopColor="#eab95c" />
                        <stop offset="100%" stopColor="#b88228" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="60"
                      cy="60"
                      r="46"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="11"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="46"
                      fill="none"
                      stroke="url(#VerifyRingGold)"
                      strokeWidth="11"
                      strokeDasharray={`${2 * Math.PI * 46 * 0.992} ${2 * Math.PI * 46}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-extrabold text-[#fff9ec]">99.2%</span>
                    <span className="text-[11px] text-[#dfd3bc]">Accuracy</span>
                  </div>
                </div>

                {/* Breakdown Legend */}
                <div className="space-y-2.5 mt-5 px-1">
                  {VERIFICATION_STATS_BREAKDOWN.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="flex items-center gap-2.5 text-[#dfd3bc]">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.dotClass}`} />
                        {item.label}
                      </span>
                      <span className="font-semibold text-[#fff8eb]">{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('Bulk Verification')}
                  className="gold-btn w-full py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Bulk CSV List</span>
                </button>
                <Link
                  href="/batch-jobs"
                  className="gold-btn-outline w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <span>View Active Batch Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#eab95c]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Bulk Verification' && (
        <div className="gold-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#fff8eb]">
                Streaming Bulk List Verification (CSV / TXT / XLSX)
              </h2>
              <p className="text-xs text-[#d4c5a9] mt-0.5">
                Untrusted files are sanitized (NFA-50) and streamed into 10,000-record worker partitions (NFA-08).
              </p>
            </div>
            <UploadCloud className="w-8 h-8 text-[#eab95c]" />
          </div>

          <div className="border-2 border-dashed border-[#d8a84e]/40 rounded-xl p-8 text-center bg-[#0d0b09]/70">
            <p className="text-sm text-[#f3e5c8] font-medium">
              Drop your CSV, TXT, or XLSX contact list here (up to 1,000,000 records)
            </p>
            <p className="text-xs text-[#c7b99e] mt-1">
              Automatic duplicate removal • Syntax → DNS/MX → SMTP → Risk → Catch-All ML
            </p>
            <button
              type="button"
              onClick={() =>
                setBulkUploadNotice(
                  'Batch Job BJ-2025-00124 queued! Partitioned 250,000 records into 25 worker chunks on enterprise.syntax.'
                )
              }
              className="gold-btn mt-4 px-5 py-2 rounded-lg text-xs cursor-pointer"
            >
              Simulate 250k Enterprise CSV Upload
            </button>
          </div>

          {bulkUploadNotice && (
            <div className="p-3 rounded-lg bg-[#194d33]/50 border border-[#28c76f]/50 text-xs text-[#6ce8a0] flex items-center justify-between">
              <span>{bulkUploadNotice}</span>
              <Link href="/batch-jobs" className="underline font-semibold">
                Inspect Job →
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'History' && (
        <div className="gold-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#fff8eb] flex items-center gap-2">
              <History className="w-4 h-4 text-[#eab95c]" />
              Immutable Verification Ledger (NFA-52 &amp; NFA-32 Model Versioning)
            </h2>
            <span className="text-xs text-[#d4c5a9]">{historyList.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#d8a84e]/20 text-[#d4c5a9]">
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Risk Score</th>
                  <th className="py-2.5 px-3">Latency</th>
                  <th className="py-2.5 px-3">Model Version</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {historyList.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 font-medium text-white">{item.email}</td>
                    <td className="py-2.5 px-3">{renderStatusPill(item.displayBadge)}</td>
                    <td className="py-2.5 px-3 text-[#e0d2b8]">
                      {item.riskLabel} ({item.riskScore100}/100)
                    </td>
                    <td className="py-2.5 px-3 text-[#d4c5a9]">{item.processing.durationMs}ms</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#eab95c]">
                      {item.processing.modelVersion ?? 'deterministic-v1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
