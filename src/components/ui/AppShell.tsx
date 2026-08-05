'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import Header from '@/components/ui/Header';

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideGlobalLayout = pathname?.startsWith('/dashboard');

  return (
    <>
      {!hideGlobalLayout && <Header />}
      <main className="flex-1">{children}</main>
      
    </>
  );
}
