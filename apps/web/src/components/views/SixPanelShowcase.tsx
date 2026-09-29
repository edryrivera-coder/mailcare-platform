'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopHeader } from '@/components/layout/TopHeader';
import { EmailVerificationView } from '@/components/views/EmailVerificationView';
import { ConsumerInboxView } from '@/components/views/ConsumerInboxView';
import { BatchJobsView } from '@/components/views/BatchJobsView';
import { AnalyticsView } from '@/components/views/AnalyticsView';
import { IntegrationsView } from '@/components/views/IntegrationsView';
import { SettingsView } from '@/components/views/SettingsView';

const PANELS = [
  {
    id: 'panel-verification',
    activeRoute: '/email-verification',
    Component: EmailVerificationView,
  },
  {
    id: 'panel-inbox',
    activeRoute: '/consumer-inbox',
    Component: ConsumerInboxView,
  },
  {
    id: 'panel-jobs',
    activeRoute: '/batch-jobs',
    Component: BatchJobsView,
  },
  {
    id: 'panel-analytics',
    activeRoute: '/analytics',
    Component: AnalyticsView,
  },
  {
    id: 'panel-integrations',
    activeRoute: '/integrations',
    Component: IntegrationsView,
  },
  {
    id: 'panel-settings',
    activeRoute: '/settings',
    Component: SettingsView,
  },
] as const;

export function SixPanelShowcase({ onExitShowcase }: { onExitShowcase?: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-lg font-bold text-[#fff8eb]">
            MailCare 6-Module Architecture Showcase (Matches dashboard.png 2×3 Layout)
          </h2>
          <p className="text-xs text-[#b9ab90]">
            All 6 panels below are live and interactive. Click any sidebar item inside a panel to open its dedicated full-screen view.
          </p>
        </div>
        {onExitShowcase && (
          <button
            type="button"
            onClick={onExitShowcase}
            className="gold-btn px-4 py-2 rounded-lg text-xs cursor-pointer"
          >
            Return to Single-Screen Mode
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 sm:gap-6">
        {PANELS.map(({ id, activeRoute, Component }) => (
          <div
            key={id}
            className="gold-frame rounded-xl sm:rounded-2xl overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          >
            <div className="flex flex-1 min-h-[460px] sm:min-h-[540px]">
              <Sidebar activeOverride={activeRoute} className="hidden md:flex" />
              <div className="flex-1 flex flex-col min-w-0 mailcare-shell-bg">
                <TopHeader />
                <div className="p-3 sm:p-5 flex-1 overflow-y-auto overflow-x-hidden">
                  <Component compact />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
