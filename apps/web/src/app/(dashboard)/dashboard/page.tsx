'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  CloudCog,
  Inbox,
  LayoutGrid,
  Link2,
  Settings,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { SixPanelShowcase } from '@/components/views/SixPanelShowcase';
import { useUserProfile } from '@/lib/user-profile-store';

const MODULE_CARDS = [
  {
    title: 'Email Verification',
    subtitle: 'Single & bulk verification (99.2% accuracy, <1s SLA)',
    href: '/email-verification',
    metric: '99.2% Valid',
    cta: 'Verify Addresses',
    icon: ShieldCheck,
  },
  {
    title: 'Consumer Inbox',
    subtitle: 'Smart filters, bulk archive/delete & RFC 8058 unsubscribe',
    href: '/consumer-inbox',
    metric: '342 Unread • 1.84 GB Saved',
    cta: 'Clean Inbox',
    icon: Inbox,
  },
  {
    title: 'Batch Jobs',
    subtitle: 'Checkpointed 10k-partition async processing & DLQ replay',
    href: '/batch-jobs',
    metric: '23 Running • 198 Done',
    cta: 'Manage Batches',
    icon: CloudCog,
  },
  {
    title: 'Analytics',
    subtitle: 'Throughput trends, category breakdown & 99.99% uptime SLA',
    href: '/analytics',
    metric: '2,847,392 Processed',
    cta: 'Explore Insights',
    icon: BarChart3,
  },
  {
    title: 'Integrations',
    subtitle: 'OAuth Mail Providers (Gmail, M365) & CRM/ESP connectors',
    href: '/integrations',
    metric: '6 Connected',
    cta: 'Configure Sync',
    icon: Link2,
  },
  {
    title: 'Settings',
    subtitle: 'Multi-tenant organization, 2FA, KMS API keys & preferences',
    href: '/settings',
    metric: 'SOC 2 • GDPR',
    cta: 'Security & API',
    icon: Settings,
  },
];

export default function ExecutiveDashboardPage() {
  const { profile } = useUserProfile();
  const [showSixPanelGrid, setShowSixPanelGrid] = useState(false);

  return (
    <div className="space-y-6">
      {/* Above-the-Fold High-Converting Value Hero & Activation Funnel */}
      <div className="gold-card p-4 sm:p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
          <div className="space-y-2 max-w-2xl min-w-0">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-[#194d33]/55 border border-[#28c76f]/50 text-[11px] sm:text-xs text-[#6ce8a0] font-medium max-w-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#28c76f] shrink-0" />
              <span className="truncate">
                <span className="hidden sm:inline">Primary OAuth 2.0 Mailbox Active: </span>
                <span className="sm:hidden">Linked: </span>
                <strong>{profile.email}</strong>
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-[#fff8eb] tracking-tight leading-tight">
              Welcome back, <span className="gold-text-gradient">{profile.fullName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#dfd3bc] leading-relaxed">
              Your multi-tenant hygiene engine is running at <strong>99.2% accuracy</strong> with{' '}
              <strong>2.48 GB</strong> of mailbox storage reclaimed and <strong>142</strong> spy
              pixels neutralized.
            </p>
          </div>

          {/* Primary High-Contrast Conversion CTAs */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0">
            <Link
              href="/email-verification"
              className="gold-btn px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 text-center"
            >
              <Zap className="w-4 h-4 shrink-0" />
              <span>Verify Emails</span>
            </Link>
            <Link
              href="/consumer-inbox"
              className="gold-btn-outline px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 sm:gap-2 text-center"
            >
              <Inbox className="w-4 h-4 text-[#eab95c] shrink-0" />
              <span>Clean 342 Unread</span>
            </Link>
          </div>
        </div>

        {/* 3-Step Guided Activation Progress Bar */}
        <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-[#d8a84e]/20 grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
          <Link
            href="/integrations"
            className="gold-card-inset p-3 rounded-xl flex items-center justify-between border-[#28c76f]/40 hover:border-[#28c76f] transition"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-6 h-6 rounded-full bg-[#194d33] text-[#4be38d] flex items-center justify-center text-xs font-bold shrink-0">
                ✓
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#fff8eb] truncate">
                  1. Link OAuth 2.0 Mailbox
                </div>
                <div className="text-[11px] text-[#6ce8a0] truncate">
                  {profile.email} connected
                </div>
              </div>
            </div>
            <span className="text-[10.5px] font-semibold text-[#6ce8a0] shrink-0">Done</span>
          </Link>

          <Link
            href="/consumer-inbox"
            className="gold-card-inset p-3 rounded-xl flex items-center justify-between hover:border-[#eab95c] transition group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-6 h-6 rounded-full bg-[#d8a84e]/20 border border-[#eab95c] text-[#f5d07e] flex items-center justify-center text-xs font-bold shrink-0">
                2
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#fff8eb] truncate">
                  2. Triage Newsletter Clutter
                </div>
                <div className="text-[11px] text-[#d4c5a9] truncate">
                  342 unread • RFC 8058 Ready
                </div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#eab95c] group-hover:translate-x-0.5 transition shrink-0" />
          </Link>

          <Link
            href="/email-verification"
            className="gold-card-inset p-3 rounded-xl flex items-center justify-between hover:border-[#eab95c] transition group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-6 h-6 rounded-full bg-[#d8a84e]/20 border border-[#eab95c] text-[#f5d07e] flex items-center justify-center text-xs font-bold shrink-0">
                3
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#fff8eb] truncate">
                  3. Run Bulk CRM Hygiene
                </div>
                <div className="text-[11px] text-[#d4c5a9] truncate">
                  Up to 1M rows • 10k partitions
                </div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#eab95c] group-hover:translate-x-0.5 transition shrink-0" />
          </Link>
        </div>
      </div>

      {/* 6 Module Launchpad Cards */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#d8cab0] flex items-center gap-1.5 sm:gap-2">
            <Sparkles className="w-4 h-4 text-[#eab95c] shrink-0" />
            <span>Platform Modules &amp; Live Telemetry</span>
          </h2>
          <button
            type="button"
            onClick={() => setShowSixPanelGrid((v) => !v)}
            className="gold-btn-outline px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#eab95c] shrink-0" />
            <span className="hidden sm:inline">
              {showSixPanelGrid
                ? 'Hide 6-Panel Architecture Grid'
                : 'Preview All 6 Screens (dashboard.png 2×3 Grid)'}
            </span>
            <span className="sm:hidden">
              {showSixPanelGrid ? 'Hide 6-Panels' : '6-Panel Grid'}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="gold-card p-4.5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#d8a84e]/15 border border-[#eab95c]/40 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#f5d07e]" />
                      </div>
                      <span className="text-sm font-bold text-[#fff8eb] group-hover:text-[#f5d07e] transition">
                        {card.title}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#c7b99e] group-hover:text-[#f5d07e] transition shrink-0" />
                  </div>
                  <p className="text-xs text-[#d4c5a9] mt-2 leading-relaxed">{card.subtitle}</p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#d8a84e]/15 border border-[#d8a84e]/35 text-[11px] font-semibold text-[#f5d07e]">
                    {card.metric}
                  </span>
                  <span className="text-xs font-semibold text-[#eab95c] group-hover:underline flex items-center gap-1">
                    {card.cta} →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Optional On-Demand 6-Panel Showcase matching dashboard.png */}
      {showSixPanelGrid && (
        <div className="pt-2">
          <SixPanelShowcase onExitShowcase={() => setShowSixPanelGrid(false)} />
        </div>
      )}
    </div>
  );
}
