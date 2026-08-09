'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer'

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideGlobalLayout = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');
 

  return (
    <>
      {!hideGlobalLayout && <Header />}
      <main className="flex-1">{children}</main>
      {!hideGlobalLayout && <Footer />}

      
    </>
  );
}
