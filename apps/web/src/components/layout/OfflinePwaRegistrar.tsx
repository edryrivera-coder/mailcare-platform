'use client';

import { useEffect } from 'react';

export function OfflinePwaRegistrar() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Ignore registration errors in restricted environments
      });
    }
  }, []);

  return null;
}
