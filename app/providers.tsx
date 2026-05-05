"use client";

import { ChakraProvider } from '@chakra-ui/react';
import { AppShell } from '../components/layout/AppShell';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const ping = () => fetch('/api/wake').catch(console.error);
    ping();
    const interval = setInterval(ping, 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ChakraProvider>
      <AppShell>{children}</AppShell>
    </ChakraProvider>
  );
}
