'use client';

import { useState, useEffect } from 'react';

export interface UserProfileData {
  fullName: string;
  role: string;
  email: string;
  linkedGmailAccount: string;
  oauthStatus: 'CONNECTED' | 'DISCONNECTED';
  initials: string;
  avatarDataUrl?: string;
  organizationName: string;
  organizationPlan: string;
  twoFactorEnabled: boolean;
  language: string;
  timeZone: string;
  portfolioPrivacyMode?: boolean;
}

export const DEFAULT_USER_PROFILE: UserProfileData = {
  fullName: 'Edry de Guzman',
  role: 'Administrator',
  email: 'edryrivera@gmail.com',
  linkedGmailAccount: 'edryrivera@gmail.com',
  oauthStatus: 'CONNECTED',
  initials: 'EG',
  organizationName: 'Your Organization',
  organizationPlan: 'Enterprise Plan',
  twoFactorEnabled: true,
  language: 'English (US)',
  timeZone: '(GMT+08:00) Manila',
  portfolioPrivacyMode: true,
};

const STORAGE_KEY = 'mailcare_user_profile_v2';
const EVENT_NAME = 'mailcare:profile-updated';

export function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'MC';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
}

export function formatPortfolioEmail(rawEmail: string, privacyMode?: boolean): string {
  if (!privacyMode) return rawEmail;
  const [local = '', domain = ''] = rawEmail.split('@');
  if (!domain) return rawEmail;
  const visiblePrefix = local.slice(0, Math.min(4, Math.max(2, local.length - 3)));
  return `${visiblePrefix}***@${domain}`;
}

export function loadUserProfile(): UserProfileData {
  if (typeof window === 'undefined') return DEFAULT_USER_PROFILE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER_PROFILE;
    return { ...DEFAULT_USER_PROFILE, ...(JSON.parse(raw) as Partial<UserProfileData>) };
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

export function saveUserProfile(nextProfile: UserProfileData): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: nextProfile }));
  } catch {
    // Ignore storage quota errors
  }
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfileData>(DEFAULT_USER_PROFILE);

  useEffect(() => {
    setProfile(loadUserProfile());

    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<UserProfileData>;
      if (custom.detail) {
        setProfile(custom.detail);
      } else {
        setProfile(loadUserProfile());
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    return () => window.removeEventListener(EVENT_NAME, handleUpdate);
  }, []);

  const updateProfile = (patch: Partial<UserProfileData>) => {
    const current = loadUserProfile();
    const merged: UserProfileData = {
      ...current,
      ...patch,
    };
    if (patch.fullName !== undefined && patch.initials === undefined) {
      merged.initials = computeInitials(patch.fullName);
    }
    if (patch.email !== undefined && patch.linkedGmailAccount === undefined) {
      merged.linkedGmailAccount = patch.email;
    }
    setProfile(merged);
    saveUserProfile(merged);
    return merged;
  };

  const displayEmail = formatPortfolioEmail(profile.email, profile.portfolioPrivacyMode);

  return {
    profile: {
      ...profile,
      email: displayEmail,
      linkedGmailAccount: displayEmail,
    },
    rawProfile: profile,
    updateProfile,
  };
}
