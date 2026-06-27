'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { PriceRange, ToolChip, WeekBadge } from './ui';
import type { Workflow } from '@/lib/work';

export function WorkflowCard({ w }: { w: Workflow }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
    <Link
      href={`/work/${w.slug}`}
      className="group block rounded-xl border border-border bg-surface hover:bg-surface2 hover:border-accent/30 transition-colors overflow-hidden h-full"
    >
      {w.screenshot && (
        <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-bg">
          <img
            src={w.screenshot}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/70 via-transparent to-transparent" />
        </div>
      )}
      <div className="p-5 flex flex-col h-full min-h-[200px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted">Day {String(w.day).padStart(2, '0')}</span>
            <WeekBadge week={w.week} />
          </div>
          <motion.div
            whileHover={reduce ? undefined : { x: 2, y: -2 }}
            transition={{ duration: 0.2 }}
            className="text-muted group-hover:text-accent transition-colors"
          >
            <ArrowUpRight size={16} />
          </motion.div>
        </div>
        <h3 className="mt-3 text-lg font-medium tracking-tight leading-snug group-hover:text-white">
          {w.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted leading-relaxed line-clamp-2">{w.tagline}</p>
        <div className="mt-auto pt-4 flex flex-wrap items-center gap-1.5">
          {w.tools.slice(0, 4).map((t) => (
            <ToolChip key={t}>{t}</ToolChip>
          ))}
          {w.tools.length > 4 && <span className="text-[11px] text-muted font-mono">+{w.tools.length - 4}</span>}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span className="font-mono">{w.nodes || '—'} nodes</span>
          <PriceRange low={w.priceLow} high={w.priceHigh} />
        </div>
      </div>
    </Link>
    </motion.div>
  );
}
