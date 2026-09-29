import type { Metadata } from 'next';
import '@/styles/globals.css';
import { OfflinePwaRegistrar } from '@/components/layout/OfflinePwaRegistrar';

export const metadata: Metadata = {
  title: 'MailCare — Cleaner Inboxes. Healthier Data.',
  description:
    'Cloud-native Consumer Inbox Management & Enterprise B2B Email Verification Platform (99.2% Accuracy, 99.99% Availability)',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="min-h-screen bg-[#060608] text-[#f4efe6] antialiased"
        suppressHydrationWarning
      >
        <OfflinePwaRegistrar />
        {children}
      </body>
    </html>
  );
}
