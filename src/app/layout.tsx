import type { Metadata } from 'next';
import { Cinzel, Crimson_Pro } from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cinzel',
});

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-crimson',
});

export const metadata: Metadata = {
  title: 'Royal Chess — Game of Kings',
  description: 'A premium chess game with AI opponent featuring 5 difficulty levels from Easy to Insane.',
  keywords: ['chess', 'game', 'AI', 'strategy', 'board game'],
  openGraph: {
    title: 'Royal Chess — Game of Kings',
    description: 'Play chess against an intelligent AI with 5 difficulty levels.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${cinzel.variable} ${crimsonPro.variable}`}>
      <body className="bg-[#0d0600] min-h-screen antialiased">{children}</body>
    </html>
  );
}
