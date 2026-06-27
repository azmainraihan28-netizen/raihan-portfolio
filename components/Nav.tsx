'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { site } from '@/content/site';
import { ThemeToggle } from './ThemeToggle';

const links = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-bg/70 border-b border-border">
      <div className="max-w-container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-md bg-accent/15 border border-accent/30 grid place-items-center text-accent font-mono text-sm">R</span>
          <span className="font-medium tracking-tight">{site.shortName}</span>
          <span className="text-muted text-sm hidden sm:inline">/ {site.role.split('·')[0].trim()}</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-md text-sm text-muted hover:text-text hover:bg-surface transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <span className="ml-2"><ThemeToggle /></span>
          <motion.span whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }} className="inline-block">
            <Link
              href="/contact"
              className="ml-2 px-3 py-1.5 rounded-md text-sm bg-accent text-white hover:bg-accent-hover transition-colors inline-block"
            >
              Hire me
            </Link>
          </motion.span>
        </nav>
      </div>
    </header>
  );
}
