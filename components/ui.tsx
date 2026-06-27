'use client';

import { cn } from '@/lib/cn';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('max-w-container mx-auto px-6', className)}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted font-mono">
      <span className="w-6 h-px bg-border" />
      {children}
    </div>
  );
}

export function ToolChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-surface border border-border text-muted">
      {children}
    </span>
  );
}

const WEEK_COLORS: Record<number, string> = {
  1: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10',
  2: 'border-sky-500/30 text-sky-300 bg-sky-500/10',
  3: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
  4: 'border-violet-500/30 text-violet-300 bg-violet-500/10',
};

export function WeekBadge({ week, className }: { week: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border', WEEK_COLORS[week], className)}>
      W{week}
    </span>
  );
}

export function PriceRange({ low, high }: { low: number; high: number }) {
  const fmt = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`);
  return <span className="font-mono text-text">{fmt(low)}<span className="text-muted">–</span>{fmt(high)}</span>;
}

export function CTAButton({
  href, children, variant = 'primary', size = 'md',
}: { href: string; children: ReactNode; variant?: 'primary' | 'ghost'; size?: 'md' | 'lg' }) {
  const reduce = useReducedMotion();
  const styles =
    variant === 'primary'
      ? 'bg-accent text-white hover:bg-accent-hover shadow-[0_8px_24px_-12px_rgba(124,92,255,0.6)]'
      : 'bg-transparent text-text border border-border hover:bg-surface hover:border-accent/40';
  const sz = size === 'lg' ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm';
  return (
    <motion.span
      whileHover={reduce ? undefined : { y: -1 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="inline-block"
    >
      <Link href={href} className={cn('inline-flex items-center gap-2 rounded-md transition-colors', styles, sz)}>
        {children}
      </Link>
    </motion.span>
  );
}

export function SectionTitle({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="mb-12">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
      {sub && <p className="mt-3 text-muted max-w-2xl">{sub}</p>}
    </div>
  );
}
