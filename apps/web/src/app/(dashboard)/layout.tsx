'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  CloudCog,
  Home,
  Inbox,
  Menu,
  ShieldCheck,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopHeader } from '@/components/layout/TopHeader';
import { SixPanelShowcase } from '@/components/views/SixPanelShowcase';

const MOBILE_BOTTOM_TABS = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Inbox', href: '/consumer-inbox', icon: Inbox },
  { label: 'Verify', href: '/email-verification', icon: ShieldCheck },
  { label: 'Batches', href: '/batch-jobs', icon: CloudCog },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
] as const;

export default function DashboardShellLayout({ children }: { children: React.ReactNode }) {
  const [showcaseMode, setShowcaseMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  if (showcaseMode) {
    return (
      <div className="min-h-screen mailcare-shell-bg p-2 sm:p-6">
        <SixPanelShowcase onExitShowcase={() => setShowcaseMode(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-dvh mailcare-shell-bg p-0 sm:p-3 lg:p-4 flex items-stretch sm:items-center justify-center">
      <div className="w-full max-w-[1440px] min-h-dvh sm:min-h-[92vh] gold-frame rounded-none sm:rounded-2xl border-0 sm:border overflow-x-hidden flex shadow-[0_25px_70px_rgba(0,0,0,0.9)] relative">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:flex" />

        {/* Mobile / Tablet Slide-Over Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 flex h-full max-w-[85vw]">
              <Sidebar
                onCloseMobile={() => setMobileMenuOpen(false)}
                className="h-full overflow-y-auto"
              />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0 w-full">
          <TopHeader
            showcaseMode={showcaseMode}
            onToggleShowcase={() => setShowcaseMode((v) => !v)}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />
          <main className="flex-1 p-3 sm:p-5 lg:p-7 pb-24 lg:pb-7 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>

        {/* Sticky Mobile Bottom Tab Bar (< lg) for 1-Thumb Native App Navigation */}
        <nav
          aria-label="Mobile Bottom Navigation"
          className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#0b0907]/95 backdrop-blur-md border-t border-[#d8a84e]/30 px-1.5 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-[0_-10px_30px_rgba(0,0,0,0.85)]"
        >
          {MOBILE_BOTTOM_TABS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl min-w-[52px] transition ${
                  isActive
                    ? 'text-[#f5d07e] bg-[#d8a84e]/15 border border-[#eab95c]/35 font-semibold'
                    : 'text-[#c7b99e] hover:text-[#fff8eb]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#f5d07e]' : 'text-[#c7b99e]'}`} />
                <span className="text-[10px] mt-0.5 leading-tight">{item.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl min-w-[52px] text-[#c7b99e] hover:text-[#fff8eb] cursor-pointer"
          >
            <Menu className="w-4 h-4 text-[#eab95c]" />
            <span className="text-[10px] mt-0.5 leading-tight">More</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

