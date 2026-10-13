import type { Metadata } from 'next';
import { Source_Serif_4, Source_Sans_3, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

// Headings use the serif, body text uses the sans. To change a font, swap the import here.
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif' });
const sans = Source_Sans_3({ subsets: ['latin'], variable: '--font-sans' });
const deva = Noto_Sans_Devanagari({ subsets: ['devanagari'], weight: ['400', '500'], variable: '--font-deva' });

export const metadata: Metadata = {
  title: 'Swayambhu Stories',
  description: 'An oral-history archive.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${deva.variable}`}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}