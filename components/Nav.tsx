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

  // Close the sheet on route change and lock the body while it is open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-colors duration-300',
        lifted ? 'bg-bg/80 backdrop-blur-xl border-b border-border' : 'bg-transparent border-b border-transparent',
      )}
    >
      {/* 64px desktop bar -- well under the 80px cap, single line at every width. */}
      <div className="max-w-container mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label={`${site.shortName} home`}>
          <Image src="/logo-mark.png" alt="" width={30} height={30} priority className="w-[26px] h-[26px] object-contain" />
          <span className="font-display font-semibold tracking-[-0.02em] text-[15px]">{site.shortName}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'relative px-3.5 py-2 rounded-pill text-sm transition-colors',
                  active ? 'text-text' : 'text-muted hover:text-text',
                )}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 -z-10 rounded-pill bg-surface2 border border-border"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center whitespace-nowrap px-4 py-2 rounded-pill text-sm font-medium bg-primary text-primary-on hover:bg-primary-hover active:scale-[0.97] transition-transform"
          >
            Start a project
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="md:hidden w-9 h-9 grid place-items-center rounded-pill border border-border text-text"
          >
            {open ? <X size={16} strokeWidth={1.8} /> : <Menu size={16} strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed inset-x-0 top-16 bottom-0 z-50 bg-bg border-t border-border px-5 pt-6"
          >
            <nav className="flex flex-col" aria-label="Mobile">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 + i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={l.href}
                    className="block py-4 border-b border-border font-display text-2xl font-semibold tracking-[-0.02em]"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <Link
              href="/contact"
              className="mt-8 flex items-center justify-center w-full px-5 py-3.5 rounded-pill bg-primary text-primary-on font-medium"
            >
              Start a project
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
