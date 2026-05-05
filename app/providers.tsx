"use client";

import { ChakraProvider } from '@chakra-ui/react';
import { AppShell } from '../components/layout/AppShell';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/health').catch(console.error);
  }, []);

  return (
    <ChakraProvider>
      <AppShell>{children}</AppShell>
    </ChakraProvider>
  );
}
