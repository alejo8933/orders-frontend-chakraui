import type { Metadata } from 'next';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const ibm = IBM_Plex_Mono({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-ibm' });

export const metadata: Metadata = {
  title: 'Orders Dashboard',
  description: 'Gestión de pedidos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${ibm.variable}`}>
      <body style={{ fontFamily: 'var(--font-inter), sans-serif', margin: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
