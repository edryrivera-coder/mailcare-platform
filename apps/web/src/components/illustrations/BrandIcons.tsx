import React from 'react';

export function SenderAvatarIcon({
  type,
}: {
  type: 'netflix' | 'amazon' | 'youtube' | 'spotify' | 'google' | 'facebook' | 'generic';
}) {
  switch (type) {
    case 'netflix':
      return (
        <div className="w-6 h-6 rounded bg-[#141414] border border-[#e50914]/50 flex items-center justify-center font-black text-xs text-[#e50914] shadow-sm">
          N
        </div>
      );
    case 'amazon':
      return (
        <div className="w-6 h-6 rounded bg-[#232f3e] border border-[#ff9900]/40 flex items-center justify-center font-bold text-xs text-white shadow-sm">
          a<span className="text-[#ff9900] -ml-0.5">_</span>
        </div>
      );
    case 'youtube':
      return (
        <div className="w-6 h-6 rounded bg-[#ff0000] flex items-center justify-center shadow-sm">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      );
    case 'spotify':
      return (
        <div className="w-6 h-6 rounded-full bg-[#1db954] flex items-center justify-center shadow-sm">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-black fill-none" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 9c4-1 8-1 12 1M7 13c3-1 6-1 9 1M8 17c2.5-.5 5-.5 7 .5" />
          </svg>
        </div>
      );
    case 'google':
      return (
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold text-xs text-[#4285F4] shadow-sm">
          G
        </div>
      );
    case 'facebook':
      return (
        <div className="w-6 h-6 rounded-full bg-[#1877F2] flex items-center justify-center font-bold text-xs text-white shadow-sm">
          f
        </div>
      );
    default:
      return (
        <div className="w-6 h-6 rounded-full bg-[#d8a84e]/20 border border-[#d8a84e]/50 flex items-center justify-center text-xs text-[#f5d07e]">
          @
        </div>
      );
  }
}

export function IntegrationBrandLogo({ id, size = 'md' }: { id: string; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'w-5 h-5' : 'w-11 h-11';
  switch (id) {
    case 'gmail':
      return (
        <div className={`${dim} rounded-xl bg-[#1a1612] border border-white/10 flex items-center justify-center p-1.5`}>
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z" />
            <path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z" />
            <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17" />
            <path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z" />
            <path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z" />
          </svg>
        </div>
      );
    case 'microsoft365':
      return (
        <div className={`${dim} rounded-xl bg-[#1a1612] border border-white/10 flex items-center justify-center p-2`}>
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <rect x="2" y="2" width="13" height="13" rx="2" fill="#f25022" />
            <rect x="17" y="2" width="13" height="13" rx="2" fill="#7fba00" />
            <rect x="2" y="17" width="13" height="13" rx="2" fill="#00a4ef" />
            <rect x="17" y="17" width="13" height="13" rx="2" fill="#ffb900" />
          </svg>
        </div>
      );
    case 'outlook':
      return (
        <div className={`${dim} rounded-xl bg-[#0078d4]/20 border border-[#0078d4]/40 flex items-center justify-center font-extrabold text-[#38a3ff]`}>
          <span className={size === 'sm' ? 'text-[10px]' : 'text-lg'}>O</span>
        </div>
      );
    case 'yahoo':
      return (
        <div className={`${dim} rounded-full bg-[#6001d2] flex items-center justify-center font-black text-white shadow`}>
          <span className={size === 'sm' ? 'text-[10px]' : 'text-base'}>Y!</span>
        </div>
      );
    case 'salesforce':
      return (
        <div className={`${dim} rounded-xl bg-[#00a1e0]/20 border border-[#00a1e0]/40 flex items-center justify-center p-1.5`}>
          <svg viewBox="0 0 48 34" className="w-full h-full">
            <path
              d="M14 29 H36 A8 8 0 0 0 37 13 A11 11 0 0 0 17 9 A9 9 0 0 0 6 19 A7 7 0 0 0 14 29 Z"
              fill="#00a1e0"
            />
          </svg>
        </div>
      );
    case 'hubspot':
      return (
        <div className={`${dim} rounded-xl bg-[#ff7a59]/15 border border-[#ff7a59]/40 flex items-center justify-center p-2`}>
          <svg viewBox="0 0 32 32" className="w-full h-full stroke-[#ff7a59] fill-none" strokeWidth="2.8">
            <circle cx="16" cy="16" r="5" />
            <circle cx="16" cy="4" r="2.2" fill="#ff7a59" />
            <circle cx="26" cy="22" r="2.2" fill="#ff7a59" />
            <circle cx="6" cy="22" r="2.2" fill="#ff7a59" />
            <line x1="16" y1="6" x2="16" y2="11" />
            <line x1="24" y1="20.5" x2="20" y2="18.5" />
            <line x1="8" y1="20.5" x2="12" y2="18.5" />
          </svg>
        </div>
      );
    case 'mailchimp':
      return (
        <div className={`${dim} rounded-full bg-[#ffe01b] text-[#241c15] flex items-center justify-center font-black shadow`}>
          <span className={size === 'sm' ? 'text-[10px]' : 'text-base'}>MC</span>
        </div>
      );
    case 'sendgrid':
      return (
        <div className={`${dim} rounded-xl bg-[#1a82e2]/15 border border-[#1a82e2]/40 flex items-center justify-center p-2`}>
          <svg viewBox="0 0 30 30" className="w-full h-full">
            <rect x="10" y="2" width="8" height="8" fill="#1a82e2" />
            <rect x="20" y="2" width="8" height="8" fill="#00b3e3" />
            <rect x="2" y="11" width="8" height="8" fill="#99e1f4" />
            <rect x="10" y="11" width="8" height="8" fill="#00b3e3" />
            <rect x="20" y="11" width="8" height="8" fill="#1a82e2" />
            <rect x="2" y="20" width="8" height="8" fill="#1a82e2" />
            <rect x="10" y="20" width="8" height="8" fill="#99e1f4" />
          </svg>
        </div>
      );
    default:
      return (
        <div className={`${dim} rounded-xl bg-[#d8a84e]/20 flex items-center justify-center text-[#f5d07e] font-bold`}>
          API
        </div>
      );
  }
}
