'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown, Download, MailCheck, Sparkles } from 'lucide-react';
import { ANALYTICS_CATEGORIES, ANALYTICS_TREND_7D } from '@/lib/mailcare-data';
import { AnalyticsHeroGraphic } from '@/components/illustrations/HeroGraphics';
import { useUserProfile } from '@/lib/user-profile-store';

type RangeKey = 'Last 7 days' | 'Last 30 days' | 'Last 90 days';

const RANGE_DATASETS: Record<
  RangeKey,
  {
    dateLabel: string;
    totalProcessed: string;
    totalDelta: string;
    accuracy: string;
    accuracyDelta: string;
    activeUsers: string;
    usersDelta: string;
    uptime: string;
    uptimeDelta: string;
    maxAxis: number;
    axisLabels: { label: string; val: number }[];
    points: { date: string; volume: number }[];
  }
> = {
  'Last 7 days': {
    dateLabel: 'Apr 21, 2025 - Apr 27, 2025',
    totalProcessed: '2,847,392',
    totalDelta: '↑ 12.4% vs prior 7d',
    accuracy: '99.2%',
    accuracyDelta: '↑ 0.6% precision',
    activeUsers: '8,421',
    usersDelta: '↑ 14.2% active seats',
    uptime: '99.99%',
    uptimeDelta: 'Multi-AZ Healthy',
    maxAxis: 400000,
    axisLabels: [
      { label: '400K', val: 400000 },
      { label: '300K', val: 300000 },
      { label: '200K', val: 200000 },
      { label: '100K', val: 100000 },
      { label: '0', val: 0 },
    ],
    points: ANALYTICS_TREND_7D,
  },
  'Last 30 days': {
    dateLabel: 'Mar 29, 2025 - Apr 27, 2025',
    totalProcessed: '11,940,810',
    totalDelta: '↑ 19.8% vs prior 30d',
    accuracy: '99.4%',
    accuracyDelta: '↑ 0.8% precision',
    activeUsers: '14,290',
    usersDelta: '↑ 22.1% active seats',
    uptime: '99.99%',
    uptimeDelta: '0 SLA Breaches',
    maxAxis: 1600000,
    axisLabels: [
      { label: '1.6M', val: 1600000 },
      { label: '1.2M', val: 1200000 },
      { label: '800K', val: 800000 },
      { label: '400K', val: 400000 },
      { label: '0', val: 0 },
    ],
    points: [
      { date: 'Wk 1', volume: 820000 },
      { date: 'Wk 2', volume: 960000 },
      { date: 'Wk 3', volume: 1120000 },
      { date: 'Wk 4', volume: 1050000 },
      { date: 'Wk 5', volume: 1290000 },
      { date: 'Wk 6', volume: 1440000 },
      { date: 'Now', volume: 1560000 },
    ],
  },
  'Last 90 days': {
    dateLabel: 'Jan 28, 2025 - Apr 27, 2025',
    totalProcessed: '34,612,500',
    totalDelta: '↑ 38.5% YoY growth',
    accuracy: '99.5%',
    accuracyDelta: '↑ 1.1% precision',
    activeUsers: '24,850',
    usersDelta: '↑ 31.4% active seats',
    uptime: '99.995%',
    uptimeDelta: 'Enterprise Tier-1',
    maxAxis: 4000000,
    axisLabels: [
      { label: '4.0M', val: 4000000 },
      { label: '3.0M', val: 3000000 },
      { label: '2.0M', val: 2000000 },
      { label: '1.0M', val: 1000000 },
      { label: '0', val: 0 },
    ],
    points: [
      { date: 'Feb 1', volume: 1900000 },
      { date: 'Feb 15', volume: 2250000 },
      { date: 'Mar 1', volume: 2600000 },
      { date: 'Mar 15', volume: 2890000 },
      { date: 'Apr 1', volume: 3240000 },
      { date: 'Apr 15', volume: 3580000 },
      { date: 'Apr 27', volume: 3890000 },
    ],
  },
};

export function AnalyticsView({ compact = false }: { compact?: boolean }) {
  const { profile } = useUserProfile();
  const [rangeTab, setRangeTab] = useState<RangeKey>('Last 7 days');
  const [selectedPointIdx, setSelectedPointIdx] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [reportNotice, setReportNotice] = useState<string | null>(null);

  const currentDataset = RANGE_DATASETS[rangeTab];

  // Build SVG coordinates for the Email Processing Trend chart matching dashboard.png
  const chartWidth = 520;
  const chartHeight = 190;
  const padLeft = 42;
  const padRight = 18;
  const padTop = 18;
  const padBottom = 28;
  const innerW = chartWidth - padLeft - padRight;
  const innerH = chartHeight - padTop - padBottom;

  const points = currentDataset.points.map((d, idx) => {
    const x = padLeft + (idx / (currentDataset.points.length - 1)) * innerW;
    const y = padTop + innerH - (d.volume / currentDataset.maxAxis) * innerH;
    return { x, y, idx, ...d };
  });

  // Smooth cubic bezier curve path
  const linePath = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1]!;
    const cx1 = prev.x + (pt.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (pt.x - prev.x) / 2;
    const cy2 = pt.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1]!.x} ${padTop + innerH} L ${points[0]!.x} ${padTop + innerH} Z`;

  const activePoint =
    selectedPointIdx !== null && points[selectedPointIdx]
      ? points[selectedPointIdx]!
      : points[points.length - 1]!;

  // Donut chart segments for Email Categories
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  const focusedCat =
    ANALYTICS_CATEGORIES.find((c) => c.name === selectedCategory) ?? ANALYTICS_CATEGORIES[0]!;

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-[#d8a84e]/20">
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1
                className={`${
                  compact ? 'text-xl' : 'text-2xl sm:text-3xl'
                } font-bold text-[#fff8eb] tracking-tight`}
              >
                Analytics
              </h1>
              <p className="text-xs sm:text-sm text-[#d4c5a9] mt-1">
                Insights that help you make better decisions across consumer &amp; enterprise streams.
              </p>
            </div>

            {!compact && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setReportNotice(
                      `Executive Analytics Digest (${rangeTab}) sent to ${profile.email} and downloaded as CSV.`
                    )
                  }
                  className="gold-btn px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export &amp; Email Report</span>
                </button>
              </div>
            )}
          </div>

          {/* Controls Row: Time range tabs + Date Range Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#12100d] border border-[#d8a84e]/25">
              {(['Last 7 days', 'Last 30 days', 'Last 90 days'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setRangeTab(tab);
                    setSelectedPointIdx(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    rangeTab === tab
                      ? 'gold-tab-active font-semibold'
                      : 'text-[#c7b99e] hover:text-[#fff8eb]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#12100d] border border-[#d8a84e]/30 text-xs text-[#e2d6c1]">
              <Calendar className="w-3.5 h-3.5 text-[#eab95c]" />
              <span>{currentDataset.dateLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#c7b99e]" />
            </div>
          </div>
        </div>
        <AnalyticsHeroGraphic />
      </div>

      {reportNotice && (
        <div className="px-3.5 py-2 rounded-lg bg-[#194d33]/55 border border-[#28c76f]/50 text-xs text-[#6ce8a0] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MailCheck className="w-4 h-4 text-[#28c76f]" />
            <span>{reportNotice}</span>
          </span>
          <button
            type="button"
            onClick={() => setReportNotice(null)}
            className="text-xs text-[#d4c5a9] hover:text-white ml-3 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Reactive KPI Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 tabular-nums">
        <div className="gold-card p-4">
          <span className="text-xs text-[#dfd3bc] block">Total Emails Processed</span>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-extrabold text-white block">
              {currentDataset.totalProcessed}
            </span>
            <span className="text-xs font-semibold text-[#28c76f] mt-1 inline-block">
              {currentDataset.totalDelta}
            </span>
          </div>
        </div>

        <div className="gold-card p-4">
          <span className="text-xs text-[#dfd3bc] block">Verification Accuracy</span>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-extrabold text-white block">
              {currentDataset.accuracy}
            </span>
            <span className="text-xs font-semibold text-[#28c76f] mt-1 inline-block">
              {currentDataset.accuracyDelta}
            </span>
          </div>
        </div>

        <div className="gold-card p-4">
          <span className="text-xs text-[#dfd3bc] block">Active Users</span>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-extrabold text-white block">
              {currentDataset.activeUsers}
            </span>
            <span className="text-xs font-semibold text-[#28c76f] mt-1 inline-block">
              {currentDataset.usersDelta}
            </span>
          </div>
        </div>

        <div className="gold-card p-4">
          <span className="text-xs text-[#dfd3bc] block">System Uptime</span>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-extrabold text-white block">
              {currentDataset.uptime}
            </span>
            <span className="text-xs font-semibold text-[#28c76f] mt-1 inline-block">
              {currentDataset.uptimeDelta}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom 2-Column Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Email Processing Trend */}
        <div className="lg:col-span-7 gold-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h2 className="text-sm font-semibold text-[#fff8eb]">Email Processing Trend</h2>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d8a84e]/15 border border-[#eab95c]/40 text-[11px] text-[#f5d07e] tabular-nums">
              <Sparkles className="w-3 h-3 text-[#eab95c]" />
              <span>
                {activePoint.date}: <strong>{activePoint.volume.toLocaleString()}</strong> emails
              </span>
            </div>
          </div>

          <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
              <defs>
                <linearGradient id="goldAreaFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#eab95c" stopOpacity="0.4" />
                  <stop offset="85%" stopColor="#eab95c" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#eab95c" stopOpacity="0.0" />
                </linearGradient>
                <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Y-axis labels & horizontal grid lines */}
              {currentDataset.axisLabels.map((row) => {
                const y = padTop + innerH - (row.val / currentDataset.maxAxis) * innerH;
                return (
                  <g key={row.label}>
                    <line
                      x1={padLeft}
                      y1={y}
                      x2={chartWidth - padRight}
                      y2={y}
                      stroke="rgba(255,255,255,0.07)"
                      strokeWidth="1"
                    />
                    <text
                      x={padLeft - 8}
                      y={y + 3}
                      textAnchor="end"
                      fill="#c7b99e"
                      fontSize="9.5"
                    >
                      {row.label}
                    </text>
                  </g>
                );
              })}

              {/* Vertical drop lines & X-axis dates */}
              {points.map((pt) => (
                <g key={pt.date}>
                  <line
                    x1={pt.x}
                    y1={pt.y}
                    x2={pt.x}
                    y2={padTop + innerH}
                    stroke={
                      activePoint.date === pt.date
                        ? 'rgba(245,208,126,0.55)'
                        : 'rgba(234,185,92,0.18)'
                    }
                    strokeWidth={activePoint.date === pt.date ? '1.5' : '1'}
                  />
                  <text
                    x={pt.x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    fill={activePoint.date === pt.date ? '#fff8eb' : '#d4c5a9'}
                    fontWeight={activePoint.date === pt.date ? '700' : '400'}
                    fontSize="9.5"
                  >
                    {pt.date}
                  </text>
                </g>
              ))}

              {/* Area + Glowing Gold Line */}
              <path d={areaPath} fill="url(#goldAreaFill)" />
              <path
                d={linePath}
                fill="none"
                stroke="#f5d07e"
                strokeWidth="2.5"
                filter="url(#goldGlow)"
              />

              {/* Interactive Glowing Data Nodes */}
              {points.map((pt) => {
                const isSelected = activePoint.date === pt.date;
                return (
                  <g
                    key={`node-${pt.date}`}
                    onClick={() => setSelectedPointIdx(pt.idx)}
                    onMouseEnter={() => setSelectedPointIdx(pt.idx)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? '8' : '5.5'}
                      fill={isSelected ? 'rgba(245,208,126,0.4)' : 'rgba(245,208,126,0.22)'}
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? '4.2' : '3.2'}
                      fill="#fff6dd"
                      stroke="#eab95c"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: Email Categories Donut with Focal Center Metric */}
        <div className="lg:col-span-5 gold-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#fff8eb]">Email Categories</h2>
            <span className="text-[11px] text-[#d4c5a9]">Click segment to inspect</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 my-auto">
            {/* Multi-segment Donut with Focal Center Callout */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                {ANALYTICS_CATEGORIES.map((seg) => {
                  const strokeDasharray = `${(seg.percent / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((cumulativePercent / 100) * circumference);
                  cumulativePercent += seg.percent;
                  const isActive = focusedCat.name === seg.name;
                  return (
                    <circle
                      key={seg.name}
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth={isActive ? '17' : '14'}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      onClick={() => setSelectedCategory(seg.name)}
                      className="cursor-pointer transition-all duration-200"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-lg font-extrabold text-[#fff8eb] tabular-nums">
                  {focusedCat.percent}%
                </span>
                <span className="text-[10px] text-[#d4c5a9] font-medium truncate max-w-[76px]">
                  {focusedCat.name}
                </span>
              </div>
            </div>

            {/* Interactive Category Legend */}
            <div className="space-y-1.5 w-full sm:w-auto min-w-[150px] tabular-nums">
              {ANALYTICS_CATEGORIES.map((seg) => {
                const isActive = focusedCat.name === seg.name;
                return (
                  <button
                    key={seg.name}
                    type="button"
                    onClick={() => setSelectedCategory(seg.name)}
                    className={`w-full flex items-center justify-between gap-4 px-2 py-1 rounded-lg text-xs transition cursor-pointer ${
                      isActive ? 'bg-white/10 font-semibold text-white' : 'hover:bg-white/5 text-[#dfd3bc]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                        style={{ backgroundColor: seg.color }}
                      />
                      <span>{seg.name}</span>
                    </span>
                    <span className="font-semibold text-[#fff8eb]">{seg.percent}%</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
