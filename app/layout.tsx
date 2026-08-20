import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Bricolage_Grotesque, Space_Grotesk } from 'next/font/google';
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

/* Wordmark face, kept off the critical body path. Used for the giant
   VERTEX on the home hero and nothing else. Space Grotesk 700 gives a
   modern, tech-forward wordmark that reads as a real brand logotype
   at poster size — professional rather than editorial-cute. */
const wordmark = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-wordmark',
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafb' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable} ${wordmark.variable}`} suppressHydrationWarning>
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
