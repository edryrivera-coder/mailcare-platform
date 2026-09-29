'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  LayoutGrid,
  Maximize2,
  Menu,
  Search,
  Settings,
  Sparkles,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';
import { useUserProfile } from '@/lib/user-profile-store';
import { evaluateEmailPipeline } from '@/lib/mailcare-data';
import type { VerificationResult } from '@mailcare/shared-types';

export function TopHeader({
  showcaseMode,
  onToggleShowcase,
  onOpenMobileMenu,
}: {
  showcaseMode?: boolean;
  onToggleShowcase?: () => void;
  onOpenMobileMenu?: () => void;
}) {
  const router = useRouter();
  const [showNotif, setShowNotif] = useState(false);
  const [quickEmail, setQuickEmail] = useState('');
  const [quickResult, setQuickResult] = useState<VerificationResult | null>(null);
  const [isQuickChecking, setIsQuickChecking] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const { profile, rawProfile, updateProfile } = useUserProfile();

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  async function handleQuickVerify(e: React.FormEvent) {
    e.preventDefault();
    const target = quickEmail.trim() || 'john.doe@company.com';
    setIsQuickChecking(true);

    if (isOffline) {
      setQuickResult(evaluateEmailPipeline(target));
      setIsQuickChecking(false);
      return;
    }

    try {
      const res = await fetch('/api/v1/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: target }),
      });
      if (res.ok) {
        const data = (await res.json()) as VerificationResult;
        setQuickResult(data);
      } else {
        setQuickResult(evaluateEmailPipeline(target));
      }
    } catch {
      setQuickResult(evaluateEmailPipeline(target));
    } finally {
      setIsQuickChecking(false);
    }
  }

  return (
    <header className="min-h-14 px-4 sm:px-6 py-2 border-b border-[#d8a84e]/20 flex flex-wrap items-center justify-between gap-3 bg-[#0c0a08]/90 backdrop-blur-md relative z-30">
      {/* Left: Mobile Drawer Trigger + SLA / Offline Status + Portfolio Privacy Shield + Showcase Toggle */}
      <div className="flex items-center gap-2">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="lg:hidden w-8 h-8 rounded-lg gold-btn-outline flex items-center justify-center text-[#eab95c] cursor-pointer"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsOffline((v) => !v)}
          title="Click to toggle Offline Engine simulation"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
            isOffline
              ? 'bg-[#4d3819]/80 border border-[#f5b041]/60 text-[#ffca6b]'
              : 'bg-[#194d33]/55 border border-[#28c76f]/45 text-[#6ce8a0]'
          }`}
        >
          {isOffline ? (
            <>
              <WifiOff className="w-3 h-3 text-[#f5b041]" />
              <span>Offline Mode Active</span>
            </>
          ) : (
            <>
              <Wifi className="w-3 h-3 text-[#28c76f]" />
              <span>99.99% SLA Healthy</span>
            </>
          )}
        </button>

        {onToggleShowcase && (
          <button
            type="button"
            onClick={() =>
              updateProfile({ portfolioPrivacyMode: !rawProfile.portfolioPrivacyMode })
            }
            title="Toggle Portfolio Safe Mode (masks personal email from public scrapers)"
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer border ${
              rawProfile.portfolioPrivacyMode
                ? 'bg-[#d8a84e]/15 border-[#eab95c]/50 text-[#f5d07e]'
                : 'bg-white/5 border-white/15 text-[#d4c5a9]'
            }`}
          >
            {rawProfile.portfolioPrivacyMode ? (
              <>
                <EyeOff className="w-3 h-3 text-[#eab95c]" />
                <span className="hidden sm:inline">Portfolio Safe (Email Masked)</span>
                <span className="sm:hidden">Safe Mode</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3 text-[#eab95c]" />
                <span className="hidden sm:inline">Full Email Visible</span>
                <span className="sm:hidden">Unmasked</span>
              </>
            )}
          </button>
        )}

        {onToggleShowcase && (
          <button
            type="button"
            onClick={onToggleShowcase}
            className="gold-btn-outline px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            {showcaseMode ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-[#eab95c]" />
                <span>Single Screen View</span>
              </>
            ) : (
              <>
                <LayoutGrid className="w-3.5 h-3.5 text-[#eab95c]" />
                <span className="hidden xl:inline">6-Panel Grid (dashboard.png View)</span>
                <span className="xl:hidden">6-Panel Grid</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Center: High-Converting Instant Quick-Verify Bar */}
      {onToggleShowcase && (
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-2 relative">
          <form onSubmit={handleQuickVerify} className="w-full flex items-center gap-1.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#c7b99e] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={quickEmail}
                onChange={(e) => {
                  setQuickEmail(e.target.value);
                  if (quickResult) setQuickResult(null);
                }}
                placeholder="Quick verify email (e.g. john.doe@company.com)..."
                aria-label="Quick verify email address"
                className="w-full gold-card-inset rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#fff8eb] placeholder-[#9c8d73] focus:outline-none focus:border-[#eab95c]"
              />
            </div>
            <button
              type="submit"
              disabled={isQuickChecking}
              className="gold-btn px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Zap className="w-3 h-3" />
              <span>{isQuickChecking ? '...' : 'Verify'}</span>
            </button>
          </form>

          {quickResult && (
            <div className="absolute left-0 top-11 w-full gold-card p-3 z-50 text-xs shadow-2xl border-[#eab95c]/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-[#28c76f] shrink-0" />
                  <span className="font-bold text-white truncate">{quickResult.email}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${
                    quickResult.displayBadge === 'Valid'
                      ? 'bg-[#194d33] text-[#4be38d] border border-[#28c76f]/50'
                      : quickResult.displayBadge === 'Risky'
                        ? 'bg-[#4d3819] text-[#ffca6b] border border-[#f5b041]/50'
                        : 'bg-[#4d191e] text-[#ff7a7b] border border-[#ea5455]/50'
                  }`}
                >
                  {quickResult.displayBadge} • {quickResult.riskScore100}/100
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-[11px] text-[#d4c6ad]">
                <span>
                  Syntax: <strong>{quickResult.checks.syntax}</strong> • MX:{' '}
                  <strong>{quickResult.checks.mxRecord}</strong> ({quickResult.processing.durationMs}
                  ms)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setQuickResult(null);
                      router.push('/email-verification');
                    }}
                    className="text-[#f5d07e] font-semibold hover:underline cursor-pointer"
                  >
                    Full Report →
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickResult(null)}
                    className="text-[#a89b82] hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Right: Live Value/Quota Pill + Notifications + Settings + User Profile */}
      <div className="flex items-center gap-2.5 relative">
        {onToggleShowcase && (
          <Link
            href="/consumer-inbox"
            className="hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#d8a84e]/12 border border-[#d8a84e]/35 text-[11px] text-[#f5d07e] hover:border-[#eab95c] transition"
            title="Storage reclaimed and active verification credits"
          >
            <Sparkles className="w-3 h-3 text-[#eab95c]" />
            <span>2.48 GB Reclaimed • 94.2k Credits</span>
          </Link>
        )}

        <button
          type="button"
          onClick={() => setShowNotif((v) => !v)}
          aria-label="Notifications"
          className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#eab95c] transition relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#eab95c] absolute top-1.5 right-2" />
        </button>

        <Link
          href="/settings"
          aria-label="Settings"
          className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#eab95c] transition"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {/* Profile Pill */}
        <Link
          href="/settings"
          className="flex items-center gap-2.5 pl-2 pr-2.5 py-1 rounded-full bg-[#16120c] border border-[#d8a84e]/35 hover:border-[#eab95c] transition"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#f5d07e] to-[#9b6f23] p-[1px] overflow-hidden">
            {profile.avatarDataUrl ? (
              <img
                src={profile.avatarDataUrl}
                alt={profile.fullName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#18130c] flex items-center justify-center text-[10px] font-extrabold text-[#f5d07e]">
                {profile.initials}
              </div>
            )}
          </div>
          <div className="leading-tight text-left hidden sm:block">
            <div className="text-xs font-semibold text-[#fff8eb]">{profile.fullName}</div>
            <div className="text-[10.5px] text-[#d4c5a9]">{profile.role}</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#d4c5a9]" />
        </Link>

        {showNotif && (
          <div className="absolute right-0 top-12 w-80 gold-card p-3.5 z-50 text-xs space-y-2">
            <div className="font-bold text-[#fff8eb] pb-1.5 border-b border-[#d8a84e]/20">
              Platform Event Stream (Sec. 24)
            </div>
            <div className="text-[#dfd3bc]">
              <span className="text-[#28c76f] font-semibold">● verification.completed:</span> Batch
              BJ-2025-00120 finished (99.2% accuracy).
            </div>
            <div className="text-[#dfd3bc]">
              <span className="text-[#eab95c] font-semibold">● unsubscribe.completed:</span> RFC
              8058 HTTP POST sent to mailer.netflix.com.
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
