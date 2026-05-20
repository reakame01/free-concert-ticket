import type { Metadata } from 'next';
import { Inter, Noto_Sans_Thai } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
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
    <html lang="th">
      <body
        className={`${notoSansThai.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
