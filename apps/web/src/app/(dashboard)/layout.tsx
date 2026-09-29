'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopHeader } from '@/components/layout/TopHeader';
import { SixPanelShowcase } from '@/components/views/SixPanelShowcase';

export default function DashboardShellLayout({ children }: { children: React.ReactNode }) {
  const [showcaseMode, setShowcaseMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (showcaseMode) {
    return (
      <div className="min-h-screen mailcare-shell-bg p-4 sm:p-6">
        <SixPanelShowcase onExitShowcase={() => setShowcaseMode(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen mailcare-shell-bg p-2 sm:p-4 flex items-center justify-center">
      <div className="w-full max-w-[1440px] min-h-[92vh] gold-frame rounded-2xl overflow-hidden flex shadow-[0_25px_70px_rgba(0,0,0,0.9)] relative">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:flex" />

        {/* Mobile / Tablet Slide-Over Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 flex h-full">
              <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} className="h-full" />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <TopHeader
            showcaseMode={showcaseMode}
            onToggleShowcase={() => setShowcaseMode((v) => !v)}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
