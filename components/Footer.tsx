import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { site } from '@/content/site';

const studio = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-container mx-auto px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-[1.4fr,1fr,1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/logo-mark.png" alt="" width={30} height={30} className="w-[26px] h-[26px] object-contain" />
            <span className="font-display font-semibold tracking-[-0.02em]">{site.name}</span>
          </div>
          <p className="text-muted text-sm mt-5 max-w-[42ch] leading-relaxed">
            A boutique studio pairing product-grade web development with production-grade AI
            automation. We build the systems your business ships on.
          </p>
        </div>

        <nav aria-label="Studio">
          <div className="text-muted mb-4 uppercase tracking-[0.2em] text-[11px] font-mono">Studio</div>
          <ul className="space-y-2.5 text-sm">
            {studio.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-text/80 hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <div className="text-muted mb-4 uppercase tracking-[0.2em] text-[11px] font-mono">Elsewhere</div>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1 text-text/80 hover:text-accent"
              >
                LinkedIn <ArrowUpRight size={13} strokeWidth={2} />
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="text-text/80 hover:text-accent break-all">
                {site.email}
              </a>
            </li>
            <li className="text-muted pt-1">{site.location}</li>
          </ul>
        </div>
      </div>

      {/* Oversized wordmark as the closing note. */}
      <div className="max-w-container mx-auto px-5 sm:px-8">
        <div
          aria-hidden
          className="font-display font-semibold tracking-[-0.055em] text-text/[0.055] leading-[0.8] text-[clamp(3.5rem,15vw,11rem)] select-none pb-4"
        >
          Vertex Studio
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-container mx-auto px-5 sm:px-8 py-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
          <div>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <span className="text-border">·</span>
            <span className="font-mono">Web development and AI automation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
