import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Bricolage_Grotesque } from 'next/font/google';
import './globals.css';

/* Display face for headlines only. Geist carries all UI and body copy.
   Bricolage has real character at large sizes without the editorial-serif
   cliche, and its tight optical sizing holds up at text-7xl. */
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
});
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ThemeScript } from '@/components/ThemeScript';
import { site } from '@/content/site';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: `${site.name} · ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.headline,
  icons: {
    icon: [
      { url: '/logo-mark.png', type: 'image/png' },
    ],
    apple: '/logo-mark.png',
  },
  openGraph: {
    title: `${site.name} · ${site.role}`,
    description: site.headline,
    type: 'website',
    url: '/',
    images: [{ url: '/logo.png', width: 1024, height: 1024, alt: site.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.name,
    description: site.headline,
    images: ['/logo.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-bg text-text font-sans antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
        {/* Grain sits on a fixed, non-scrolling layer so it never triggers repaints. */}
        <div aria-hidden className="grain-overlay" />
        <Analytics />
      </body>
    </html>
  );
}
