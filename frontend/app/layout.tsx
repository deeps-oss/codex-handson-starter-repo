import './globals.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import { LayoutShell } from '@/components/layout-shell';
import { AppProviders } from '@/components/providers';

export const metadata: Metadata = {
  title: 'HistoryLens',
  description: 'AI-guided history learning for secondary students'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-sand text-stone">
        <AppProviders>
          <LayoutShell>{children}</LayoutShell>
        </AppProviders>
      </body>
    </html>
  );
}
