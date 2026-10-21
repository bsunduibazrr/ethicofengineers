import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, PT_Serif } from 'next/font/google';
import './globals.css';

const serif = PT_Serif({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});

const sans = IBM_Plex_Sans({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Амьдрал 3.0 — Макс Тегмарк',
  description: 'Макс Тегмаркийн «Амьдрал 3.0» номын эхний хоёр бүлгийн танилцуулга',
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
