import type { Metadata } from 'next';
import { Inter, Noto_Sans_Thai } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { RootProviders } from '@/components/providers/root-providers';
import { PageTransition } from '@/components/page-transition';
import './globals.css';

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  variable: '--font-noto-sans-thai',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Concert Ticket Booking',
  description: 'Book free concert tickets online',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSansThai.variable} ${inter.variable} font-sans antialiased`}
      >
        <RootProviders>
          <PageTransition>{children}</PageTransition>
        </RootProviders>
        <Toaster
          position="top-right"
          containerStyle={{ top: 52, right: 16 }}
          toastOptions={{ duration: 4000 }}
        />
      </body>
    </html>
  );
}
