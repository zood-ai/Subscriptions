import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { QueryClient } from '@tanstack/react-query';
import './globals.css';
import { ReactQueryProvider } from './ReactQueryProvider';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
