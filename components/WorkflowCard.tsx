'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { PriceRange, ToolChip, WeekBadge } from './ui';
import type { Workflow } from '@/lib/work';

const CATEGORY_OF_WEEK: Record<number, string> = {
  1: 'Foundations',
  2: 'Marketing and Sales',
  3: 'Internal Ops',
  4: 'Advanced and Agentic',
  5: 'Web and Product',
};

export function WorkflowCard({
  w,
  variant = 'default',
  priority,
}: {
  w: Workflow;
  variant?: 'default' | 'wide';
  priority?: boolean;
}) {
  const reduce = useReducedMotion();
  const dd = String(w.day).padStart(2, '0');
  const wide = variant === 'wide';

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link
        href={`/work/${w.slug}`}
        className={cn(
          'edge-lit group relative flex h-full overflow-hidden rounded-card border border-border bg-surface',
          'hover:border-accent/40 transition-colors duration-300',
          wide ? 'flex-col md:flex-row' : 'flex-col',
        )}
      >
        {/* Oversized index numeral, the card's typographic anchor. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-9 -right-3 select-none font-display font-semibold leading-none tracking-[-0.06em] text-[150px] text-text/[0.035] group-hover:text-accent/[0.10] transition-colors duration-700"
        >
          {dd}
        </span>

        {/* ---- Media ---- */}
        <div className={cn('relative shrink-0', wide ? 'md:w-[55%] md:self-stretch' : '')}>
          {w.screenshot ? (
            <div
              className={cn(
                'relative overflow-hidden bg-bg',
                wide ? 'h-full min-h-[220px] md:min-h-[340px]' : 'aspect-[16/10]',
              )}
            >
              <Image
                src={w.screenshot}
                alt={`${w.title} preview`}
                fill
                priority={priority}
                sizes={wide ? '(max-width: 768px) 100vw, 46vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw'}
                className="object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
              />
              {/* Sheen sweep on hover. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent translate-x-[-150%] group-hover:translate-x-[350%] transition-transform duration-[1100ms] ease-out"
              />
            </div>
          ) : (
            <div
              className={cn(
                'grid place-items-center bg-surface2',
                wide ? 'h-full min-h-[220px] md:min-h-[340px]' : 'aspect-[16/10]',
              )}
            >
              <span className="font-display font-semibold text-6xl text-text/10 tracking-[-0.05em]">{dd}</span>
            </div>
          )}
          <span aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.05]" />
        </div>

        {/* ---- Body ---- */}
        <div className={cn('relative flex flex-col flex-1 px-6 pt-5 pb-6', wide && 'md:px-9 md:py-9 md:justify-center')}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10.5px] uppercase tracking-[0.2em] text-muted font-mono truncate">
              {w.kind === 'webdev'
                ? (w.client ? `${w.client} · Shipped` : 'Case study')
                : `Day ${dd} · ${CATEGORY_OF_WEEK[w.week]}`}
            </span>
            <WeekBadge week={w.week} />
          </div>

          <h3
            className={cn(
              'font-display font-semibold tracking-[-0.03em] leading-[1.15]',
              wide ? 'mt-4 text-2xl md:text-[2rem]' : 'mt-3 text-xl',
            )}
          >
            {w.title}
          </h3>

          <p className={cn('mt-3 text-muted leading-relaxed', wide ? 'text-[15px] max-w-[46ch]' : 'text-[13.5px] line-clamp-2')}>
            {w.tagline}
          </p>

          {w.tools.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-1.5">
              {w.tools.slice(0, wide ? 5 : 3).map((t) => (
                <ToolChip key={t}>{t}</ToolChip>
              ))}
              {w.tools.length > (wide ? 5 : 3) && (
                <span className="text-[10.5px] text-muted font-mono">+{w.tools.length - (wide ? 5 : 3)}</span>
              )}
            </div>
          )}

          <div className="mt-auto pt-6 flex items-center justify-between">
            <span className="font-mono text-[11.5px] tracking-wide">
              <PriceRange low={w.priceLow} high={w.priceHigh} />
            </span>
            <ArrowUpRight
              size={17}
              strokeWidth={2}
              className="text-muted group-hover:text-accent transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
