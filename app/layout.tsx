import type { Metadata } from 'next';
import { Lora, Inter, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const serif = Lora({ subsets: ['latin'], variable: '--font-serif' });
const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const deva = Noto_Sans_Devanagari({ subsets: ['devanagari'], weight: ['400', '500'], variable: '--font-deva' });

export const metadata: Metadata = {
  title: 'Swayambhu Stories',
  description: 'An archive of voices, memories and lived heritage from Swayambhu, Kathmandu.',
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
