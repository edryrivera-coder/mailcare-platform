'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  CheckCircle2,
  CloudCog,
  Home,
  Inbox,
  Link2,
  Mail,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useUserProfile } from '@/lib/user-profile-store';

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: Home, badge: 'Command' },
  { label: 'Consumer Inbox', href: '/consumer-inbox', icon: Inbox, badge: '342' },
  { label: 'Email Verification', href: '/email-verification', icon: ShieldCheck, badge: '99.2%' },
  { label: 'Batch Jobs', href: '/batch-jobs', icon: CloudCog },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Integrations', href: '/integrations', icon: Link2, badge: '6 Live' },
  { label: 'Settings', href: '/settings', icon: Settings },
] as const;

export function Sidebar({
  activeOverride,
  onCloseMobile,
  className = '',
}: {
  activeOverride?: string;
  onCloseMobile?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const currentPath = activeOverride ?? pathname;
  const { profile } = useUserProfile();

  return (
    <aside
      className={`w-64 shrink-0 flex flex-col justify-between p-4 border-r border-[#d8a84e]/25 bg-gradient-to-b from-[#110e0a]/98 via-[#0b0a0c]/98 to-[#120e09]/98 select-none ${className}`}
    >
      <div>
        {/* Brand Header matching dashboard.png with higher WCAG contrast */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#d8a84e]/25">
          <Link
            href="/dashboard"
            onClick={onCloseMobile}
            className="block group focus:outline-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#2c2213] to-[#141009] border border-[#eab95c]/60 flex items-center justify-center shadow-[0_0_12px_rgba(234,185,92,0.28)] group-hover:border-[#fff3d1] transition">
                <Mail className="w-4 h-4 text-[#f5d07e]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight gold-text-gradient">
                MailCare
              </span>
            </div>
            <p className="text-[10.5px] font-semibold tracking-[0.12em] uppercase text-[#d8cab0] mt-1.5 pl-0.5">
              CLEANER INBOXES. HEALTHIER DATA.
            </p>
          </Link>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close navigation menu"
              className="lg:hidden w-7 h-7 rounded-lg bg-white/5 border border-[#d8a84e]/30 flex items-center justify-center text-[#f5d07e] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Links with Scannable Micro-Badges */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath === item.href ||
              (item.href !== '/dashboard' && currentPath?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'gold-sidebar-active font-semibold'
                    : 'text-[#dfd3bc] hover:text-[#fff8eb] hover:bg-white/[0.05]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#f5d07e]' : 'text-[#c9b592]'
                    }`}
                  />
                  <span>{item.label}</span>
                </span>
                {'badge' in item && item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                      isActive
                        ? 'bg-[#161108]/60 text-[#f5d07e] border border-[#f5d07e]/40'
                        : 'bg-white/[0.04] text-[#c7b99e]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Trust & Connected Mailbox Stack */}
      <div className="mt-6 pt-4 border-t border-[#d8a84e]/20 space-y-2.5">
        {/* Connected Google OAuth 2.0 Pill */}
        <Link
          href="/integrations"
          onClick={onCloseMobile}
          className="gold-card-inset rounded-xl p-2.5 flex items-center justify-between hover:border-[#eab95c]/50 transition group"
        >
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#5ce69b]">
              <CheckCircle2 className="w-3 h-3 text-[#28c76f] shrink-0" />
              <span>OAuth 2.0 Linked</span>
            </div>
            <div className="text-[11px] font-medium text-[#fff8eb] truncate mt-0.5">
              {profile.email}
            </div>
          </div>
          <span className="text-[10px] text-[#eab95c] group-hover:underline shrink-0">
            Manage
          </span>
        </Link>

        {/* Compliance Card matching dashboard.png */}
        <div className="gold-card-inset rounded-xl p-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#d8a84e]/15 border border-[#eab95c]/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#f5d07e]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#fff8eb]">Secure &amp; Compliant</div>
            <div className="text-[10.5px] text-[#d4c5a9] tracking-wide font-medium">
              SOC 2 • GDPR • ISO 27001
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
