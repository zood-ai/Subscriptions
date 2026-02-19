import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, Geist_Mono } from 'next/font/google';
import { QueryClient } from '@tanstack/react-query';
import './globals.css';
import { ReactQueryProvider } from './ReactQueryProvider';
import { Toaster } from 'react-hot-toast';
import { NavigationProvider, NavigationProgress } from 'next-progressbar-link';

const mainFont = IBM_Plex_Sans_Arabic({
  variable: '--font-main',
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Subscriptions',
  description: 'Created by (Moemen & Abdelrahman)',
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mainFont.variable} ${geistMono.variable} antialiased`}
      >
        <NavigationProvider>
          <NavigationProgress color="#7272F6" />
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </NavigationProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
