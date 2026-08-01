'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { site } from '@/content/site';
import { cn } from '@/lib/cn';
import { ThemeToggle } from './ThemeToggle';

const links = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);

  // Scroll state via Motion's scroll observer, not a raw scroll listener.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (v) => setLifted(v > 12));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    /* The header keeps its box in flow so nothing jumps, but only the pill
       itself is interactive -- the gutter around it lets the page through. */
    <header className="sticky top-0 z-40 px-4 sm:px-6 py-3 pointer-events-none">
      <div
        className={cn(
          'glass-bar pointer-events-auto max-w-container mx-auto h-16 rounded-pill',
          'pl-4 pr-2 sm:pl-5 sm:pr-2.5',
          'grid grid-cols-[auto,1fr,auto] items-center gap-4',
          'transition-shadow duration-300',
          lifted && 'shadow-[0_18px_44px_-16px_rgb(0_0_0/0.55)]',
        )}
      >
        {/* Left: mark + wordmark */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label={`${site.shortName} home`}>
          <span className="grid place-items-center w-9 h-9 rounded-pill bg-accent/15 border border-accent/25">
            <Image
              src="/logo-mark.png"
              alt=""
              width={30}
              height={30}
              priority
              className="w-[22px] h-[22px] object-contain"
            />
          </span>
          <span className="font-display font-semibold tracking-[-0.02em] text-[15px]">
            {site.shortName}
          </span>
        </Link>

        {/* Centre: links. Active state is a full-strength label plus an accent
            underline -- colour alone would not survive a bright plate passing
            under the glass. */}
        <nav className="hidden md:flex items-center justify-center gap-1" aria-label="Primary">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative px-3.5 py-2 text-sm whitespace-nowrap transition-colors',
                  active ? 'text-text font-medium' : 'text-text/70 hover:text-text',
                )}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute left-3.5 right-3.5 bottom-1 h-[2px] rounded-full bg-accent"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: controls */}
        <div className="flex items-center gap-2 justify-end">
          <ThemeToggle />
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center whitespace-nowrap px-5 py-2.5 rounded-pill text-sm font-medium bg-primary text-primary-on hover:bg-primary-hover active:scale-[0.97] transition-transform"
          >
            Start a project
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="md:hidden w-10 h-10 grid place-items-center rounded-pill border border-border/70 text-text"
          >
            {open ? <X size={17} strokeWidth={1.8} /> : <Menu size={17} strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      {/* Mobile sheet: a second floating glass panel, not a full-bleed overlay,
          so it reads as part of the same object. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="glass-bar pointer-events-auto md:hidden mt-3 rounded-card p-4 origin-top"
          >
            <nav className="flex flex-col" aria-label="Mobile">
              {links.map((l, i) => {
                const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
                return (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + i * 0.045, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={l.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-3 py-3.5 border-b border-border/60 font-display text-xl font-semibold tracking-[-0.02em]',
                        active ? 'text-text' : 'text-text/75',
                      )}
                    >
                      {active && <span aria-hidden className="w-1.5 h-5 rounded-full bg-accent" />}
                      {l.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
            <Link
              href="/contact"
              className="mt-5 flex items-center justify-center w-full px-5 py-3.5 rounded-pill bg-primary text-primary-on font-medium"
            >
              Start a project
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
