import React from 'react';

export function VerificationHeroGraphic() {
  return (
    <div className="relative flex items-center justify-center w-36 h-24 select-none pointer-events-none">
      <div className="absolute inset-0 rounded-full bg-[#d8a84e]/20 blur-2xl" />
      <svg viewBox="0 0 180 120" className="w-full h-full drop-shadow-[0_0_12px_rgba(235,186,92,0.55)]">
        <defs>
          <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff3d1" />
            <stop offset="50%" stopColor="#eab95c" />
            <stop offset="100%" stopColor="#9c6c1e" />
          </linearGradient>
        </defs>
        {/* Orbital rings */}
        <ellipse cx="90" cy="64" rx="72" ry="30" fill="none" stroke="url(#goldGrad1)" strokeWidth="1" strokeDasharray="4 4" opacity="0.55" transform="rotate(-10 90 64)" />
        <ellipse cx="90" cy="64" rx="58" ry="22" fill="none" stroke="url(#goldGrad1)" strokeWidth="1" opacity="0.35" transform="rotate(8 90 64)" />
        {/* Envelope body */}
        <rect x="42" y="30" width="84" height="58" rx="8" fill="rgba(22,17,10,0.85)" stroke="url(#goldGrad1)" strokeWidth="2.2" />
        <path d="M44 34 L84 64 L124 34" fill="none" stroke="url(#goldGrad1)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M44 86 L72 60 M124 86 L96 60" fill="none" stroke="url(#goldGrad1)" strokeWidth="1.4" opacity="0.5" />
        {/* Checkmark badge */}
        <circle cx="124" cy="78" r="18" fill="#120e09" stroke="url(#goldGrad1)" strokeWidth="2.2" />
        <circle cx="124" cy="78" r="14" fill="none" stroke="url(#goldGrad1)" strokeWidth="0.8" opacity="0.6" />
        <path d="M116 78 L122 84 L133 72" fill="none" stroke="#fff4d4" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        {/* Sparkle nodes */}
        <circle cx="28" cy="42" r="2.5" fill="#fff3d1" />
        <circle cx="152" cy="36" r="2" fill="#eab95c" />
        <circle cx="146" cy="96" r="1.8" fill="#fff3d1" />
      </svg>
    </div>
  );
}

export function InboxHeroGraphic() {
  return (
    <div className="relative flex items-center justify-center w-36 h-24 select-none pointer-events-none">
      <div className="absolute inset-0 rounded-full bg-[#d8a84e]/20 blur-2xl" />
      <svg viewBox="0 0 180 120" className="w-full h-full drop-shadow-[0_0_12px_rgba(235,186,92,0.55)]">
        <defs>
          <linearGradient id="goldGradInbox" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff4d6" />
            <stop offset="55%" stopColor="#eab95c" />
            <stop offset="100%" stopColor="#9c6c1e" />
          </linearGradient>
        </defs>
        <path d="M18 82 Q65 20 164 48" fill="none" stroke="url(#goldGradInbox)" strokeWidth="1.2" opacity="0.5" />
        <path d="M24 94 Q90 45 158 76" fill="none" stroke="url(#goldGradInbox)" strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />
        <g transform="rotate(-12 92 58)">
          <rect x="46" y="28" width="90" height="60" rx="8" fill="rgba(22,17,10,0.85)" stroke="url(#goldGradInbox)" strokeWidth="2.2" />
          <path d="M48 32 L91 64 L134 32" fill="none" stroke="url(#goldGradInbox)" strokeWidth="2.2" />
          <path d="M48 86 L76 58 M134 86 L106 58" fill="none" stroke="url(#goldGradInbox)" strokeWidth="1.3" opacity="0.55" />
        </g>
        <circle cx="38" cy="40" r="2.5" fill="#fff4d6" />
        <circle cx="148" cy="30" r="3" fill="#eab95c" />
        <circle cx="154" cy="70" r="2" fill="#fff4d6" />
      </svg>
    </div>
  );
}

export function BatchJobsHeroGraphic() {
  return (
    <div className="relative flex items-center justify-center w-36 h-24 select-none pointer-events-none">
      <div className="absolute inset-0 rounded-full bg-[#d8a84e]/20 blur-2xl" />
      <svg viewBox="0 0 180 120" className="w-full h-full drop-shadow-[0_0_12px_rgba(235,186,92,0.55)]">
        <defs>
          <linearGradient id="goldGradJobs" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff4d6" />
            <stop offset="55%" stopColor="#eab95c" />
            <stop offset="100%" stopColor="#9c6c1e" />
          </linearGradient>
        </defs>
        <ellipse cx="92" cy="70" rx="68" ry="24" fill="none" stroke="url(#goldGradJobs)" strokeWidth="1.1" opacity="0.45" />
        {/* Server Stack Back */}
        <rect x="86" y="22" width="52" height="64" rx="5" fill="rgba(20,16,10,0.85)" stroke="url(#goldGradJobs)" strokeWidth="1.8" />
        <line x1="94" y1="36" x2="130" y2="36" stroke="url(#goldGradJobs)" strokeWidth="1.5" />
        <line x1="94" y1="50" x2="130" y2="50" stroke="url(#goldGradJobs)" strokeWidth="1.5" />
        <line x1="94" y1="64" x2="130" y2="64" stroke="url(#goldGradJobs)" strokeWidth="1.5" />
        {/* Database Cylinder Front */}
        <ellipse cx="68" cy="38" rx="28" ry="10" fill="#18130c" stroke="url(#goldGradJobs)" strokeWidth="2" />
        <path d="M40 38 V82 C40 88 96 88 96 82 V38" fill="rgba(22,17,10,0.92)" stroke="url(#goldGradJobs)" strokeWidth="2" />
        <path d="M40 53 C40 59 96 59 96 53" fill="none" stroke="url(#goldGradJobs)" strokeWidth="1.6" />
        <path d="M40 68 C40 74 96 74 96 68" fill="none" stroke="url(#goldGradJobs)" strokeWidth="1.6" />
        <ellipse cx="68" cy="38" rx="28" ry="10" fill="none" stroke="url(#goldGradJobs)" strokeWidth="2" />
      </svg>
    </div>
  );
}

export function AnalyticsHeroGraphic() {
  return (
    <div className="relative flex items-center justify-center w-36 h-24 select-none pointer-events-none">
      <div className="absolute inset-0 rounded-full bg-[#d8a84e]/20 blur-2xl" />
      <svg viewBox="0 0 180 120" className="w-full h-full drop-shadow-[0_0_12px_rgba(235,186,92,0.55)]">
        <defs>
          <linearGradient id="goldGradChart" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff4d6" />
            <stop offset="50%" stopColor="#eab95c" />
            <stop offset="100%" stopColor="#855814" />
          </linearGradient>
        </defs>
        {/* Rising Bars */}
        <rect x="38" y="68" width="16" height="30" rx="2" fill="url(#goldGradChart)" opacity="0.65" />
        <rect x="62" y="54" width="16" height="44" rx="2" fill="url(#goldGradChart)" opacity="0.75" />
        <rect x="86" y="40" width="16" height="58" rx="2" fill="url(#goldGradChart)" opacity="0.88" />
        <rect x="110" y="24" width="18" height="74" rx="2" fill="url(#goldGradChart)" />
        {/* Trend Line & Arrow */}
        <path d="M26 74 Q72 52 138 18" fill="none" stroke="#fff5d6" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M128 16 L140 16 L138 28" fill="none" stroke="#fff5d6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="24" y1="98" x2="152" y2="98" stroke="url(#goldGradChart)" strokeWidth="1.5" opacity="0.6" />
      </svg>
    </div>
  );
}

export function IntegrationsHeroGraphic() {
  return (
    <div className="relative flex items-center justify-center w-40 h-24 select-none pointer-events-none">
      <div className="absolute inset-0 rounded-full bg-[#d8a84e]/20 blur-2xl" />
      <svg viewBox="0 0 190 120" className="w-full h-full drop-shadow-[0_0_12px_rgba(235,186,92,0.55)]">
        <defs>
          <linearGradient id="goldGradInt" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff4d6" />
            <stop offset="55%" stopColor="#eab95c" />
            <stop offset="100%" stopColor="#9c6c1e" />
          </linearGradient>
        </defs>
        {/* Connecting lines */}
        <line x1="56" y1="36" x2="112" y2="54" stroke="url(#goldGradInt)" strokeWidth="1.4" strokeDasharray="3 3" />
        <line x1="52" y1="84" x2="112" y2="62" stroke="url(#goldGradInt)" strokeWidth="1.4" />
        <line x1="146" y1="34" x2="118" y2="54" stroke="url(#goldGradInt)" strokeWidth="1.4" />
        {/* Cloud node */}
        <path d="M92 72 H136 A14 14 0 0 0 138 45 A18 18 0 0 0 104 38 A15 15 0 0 0 82 54 A12 12 0 0 0 92 72 Z" fill="rgba(22,17,10,0.9)" stroke="url(#goldGradInt)" strokeWidth="2" />
        {/* Orbiting CRM / ESP nodes */}
        <circle cx="46" cy="34" r="14" fill="#14100a" stroke="url(#goldGradInt)" strokeWidth="1.6" />
        <text x="46" y="38" textAnchor="middle" fill="#f5d07e" fontSize="9" fontWeight="700">CRM</text>
        <circle cx="154" cy="30" r="14" fill="#14100a" stroke="url(#goldGradInt)" strokeWidth="1.6" />
        <text x="154" y="34" textAnchor="middle" fill="#f5d07e" fontSize="9" fontWeight="700">ESP</text>
        <circle cx="44" cy="84" r="12" fill="#14100a" stroke="url(#goldGradInt)" strokeWidth="1.6" />
        <circle cx="44" cy="84" r="4" fill="#eab95c" />
      </svg>
    </div>
  );
}

export function SettingsHeroGraphic() {
  return (
    <div className="relative flex items-center justify-center w-36 h-24 select-none pointer-events-none">
      <div className="absolute inset-0 rounded-full bg-[#d8a84e]/20 blur-2xl" />
      <svg viewBox="0 0 180 120" className="w-full h-full drop-shadow-[0_0_12px_rgba(235,186,92,0.55)]">
        <defs>
          <linearGradient id="goldGradGear" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff4d6" />
            <stop offset="55%" stopColor="#eab95c" />
            <stop offset="100%" stopColor="#9c6c1e" />
          </linearGradient>
        </defs>
        {/* Main Gear */}
        <g transform="translate(82, 58)">
          <circle r="28" fill="rgba(20,15,9,0.9)" stroke="url(#goldGradGear)" strokeWidth="2.2" />
          <circle r="19" fill="none" stroke="url(#goldGradGear)" strokeWidth="1.2" strokeDasharray="5 3" />
          <circle r="10" fill="#120e09" stroke="url(#goldGradGear)" strokeWidth="2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <rect
              key={deg}
              x="-4"
              y="-35"
              width="8"
              height="8"
              rx="1.5"
              fill="url(#goldGradGear)"
              transform={`rotate(${deg})`}
            />
          ))}
        </g>
        {/* Secondary Gear */}
        <g transform="translate(132, 36)">
          <circle r="14" fill="rgba(20,15,9,0.9)" stroke="url(#goldGradGear)" strokeWidth="1.8" />
          <circle r="5" fill="#120e09" stroke="url(#goldGradGear)" strokeWidth="1.5" />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <rect
              key={deg}
              x="-2.5"
              y="-18"
              width="5"
              height="5"
              rx="1"
              fill="url(#goldGradGear)"
              transform={`rotate(${deg})`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
