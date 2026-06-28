'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { PriceRange, ToolChip, WeekBadge } from './ui';
import type { Workflow } from '@/lib/work';

const CATEGORY_OF_WEEK: Record<number, string> = {
  1: 'Foundations',
  2: 'Marketing & Sales',
  3: 'Internal Ops',
  4: 'Advanced & Agentic',
};

export function WorkflowCard({ w }: { w: Workflow }) {
  const reduce = useReducedMotion();
  const dd = String(w.day).padStart(2, '0');

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        href={`/work/${w.slug}`}
        className="
          group relative block h-full rounded-2xl border border-border bg-surface overflow-hidden
          hover:border-accent/40 transition-colors duration-300
          before:absolute before:inset-x-6 before:top-0 before:h-px
          before:bg-gradient-to-r before:from-transparent before:via-accent/50 before:to-transparent
          before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
        "
      >
        {/* Oversized issue number — decorative typographic anchor */}
        <span
          aria-hidden
          className="
            pointer-events-none absolute -bottom-8 -right-3 select-none
            font-mono font-semibold leading-none tracking-tighter
            text-[140px] text-text/[0.035]
            group-hover:text-accent/[0.10] transition-colors duration-700
          "
        >
          {dd}
        </span>

        {/* Status row */}
        <div className="relative flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-accent/60 animate-ping" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-accent" />
            </span>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted font-mono">
              Day {dd} · Shipped
            </span>
          </div>
          <WeekBadge week={w.week} />
        </div>

        {/* Image plate — inset framed with hover sheen */}
        {w.screenshot ? (
          <div
            className="
              relative mx-5 mt-4 rounded-lg overflow-hidden border border-border
              shadow-[0_10px_30px_-18px_rgba(0,0,0,0.55)]
            "
          >
            <div className="aspect-[16/10] bg-bg overflow-hidden">
              <img
                src={w.screenshot}
                alt=""
                loading="lazy"
                className="
                  block w-full h-full object-cover object-top
                  transition-transform duration-[900ms] ease-out
                  group-hover:scale-[1.045]
                "
              />
            </div>
            {/* Soft inner-bezel highlight */}
            <span
              aria-hidden
              className="
                pointer-events-none absolute inset-0 rounded-lg
                bg-gradient-to-b from-white/[0.06] via-transparent to-black/[0.10] mix-blend-overlay
              "
            />
            {/* Hover sheen sweep */}
            <span
              aria-hidden
              className="
                pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 -skew-x-12
                bg-gradient-to-r from-transparent via-white/[0.10] to-transparent
                translate-x-[-150%] group-hover:translate-x-[350%]
                transition-transform duration-[1100ms] ease-out
              "
            />
          </div>
        ) : (
          <div
            className="
              relative mx-5 mt-4 rounded-lg border border-dashed border-border
              aspect-[16/10] grid place-items-center bg-bg/40
            "
          >
            <span className="font-mono font-semibold text-5xl text-text/10 tracking-tighter">
              {dd}.
            </span>
          </div>
        )}

        {/* Content body */}
        <div className="relative px-6 pt-5 pb-6">
          {/* Vertical accent rule — grows + shifts to accent on hover */}
          <span
            aria-hidden
            className="
              absolute left-6 top-5 w-px bg-border
              group-hover:bg-accent group-hover:w-[2px]
              transition-all duration-300
            "
            style={{ bottom: '5.5rem' }}
          />

          {/* Category caps */}
          <div className="pl-4 text-[10.5px] uppercase tracking-[0.22em] text-muted font-mono">
            {CATEGORY_OF_WEEK[w.week]}
          </div>

          {/* Title */}
          <h3 className="pl-4 mt-2 text-[19px] leading-[1.25] font-semibold tracking-tight">
            {w.title}
          </h3>

          {/* Tagline */}
          <p className="pl-4 mt-3 text-[13.5px] text-muted leading-relaxed line-clamp-2">
            {w.tagline}
          </p>

          {/* Tool chips */}
          {w.tools.length > 0 && (
            <div className="pl-4 mt-4 flex flex-wrap items-center gap-1.5">
              {w.tools.slice(0, 4).map((t) => (
                <ToolChip key={t}>{t}</ToolChip>
              ))}
              {w.tools.length > 4 && (
                <span className="text-[10.5px] text-muted font-mono">+{w.tools.length - 4}</span>
              )}
            </div>
          )}

          {/* Spec footer */}
          <div className="mt-5 flex items-center justify-between border-t border-dashed border-border pt-4">
            <div className="font-mono text-[11px] tracking-wide flex items-center gap-3">
              <span className="text-muted">
                <span className="text-text">{w.nodes || '—'}</span>
                <span className="opacity-60"> N</span>
              </span>
              <span className="text-muted opacity-30">·</span>
              <span className="text-muted">
                <PriceRange low={w.priceLow} high={w.priceHigh} />
              </span>
            </div>
            <ArrowUpRight
              size={16}
              className="
                text-muted group-hover:text-accent
                transition-all duration-300
                group-hover:translate-x-0.5 group-hover:-translate-y-0.5
              "
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
