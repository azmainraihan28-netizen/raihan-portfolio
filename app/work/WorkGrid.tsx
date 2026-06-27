'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { WorkflowCard } from '@/components/WorkflowCard';
import { cn } from '@/lib/cn';
import type { Workflow } from '@/lib/work';

const WEEKS = [
  { v: 0, label: 'All' },
  { v: 1, label: 'W1 · Foundations' },
  { v: 2, label: 'W2 · Marketing & Sales' },
  { v: 3, label: 'W3 · Internal Ops' },
  { v: 4, label: 'W4 · Advanced & Agentic' },
];

export function WorkGrid({ items }: { items: Workflow[] }) {
  const [week, setWeek] = useState(0);
  const [tool, setTool] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const allTools = useMemo(() => {
    const s = new Set<string>();
    items.forEach((i) => i.tools.forEach((t) => s.add(t)));
    return [...s].sort();
  }, [items]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((i) => {
      if (week && i.week !== week) return false;
      if (tool && !i.tools.includes(tool)) return false;
      if (needle && !(`${i.title} ${i.tagline} ${i.tools.join(' ')}`.toLowerCase().includes(needle))) return false;
      return true;
    });
  }, [items, week, tool, q]);

  return (
    <>
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {WEEKS.map((w) => (
            <button
              key={w.v}
              onClick={() => setWeek(w.v)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm border transition-colors',
                week === w.v
                  ? 'bg-accent text-white border-accent'
                  : 'bg-surface text-muted border-border hover:text-text',
              )}
            >
              {w.label}
            </button>
          ))}
          <div className="ml-auto relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search workflows…"
              className="pl-9 pr-3 py-2 rounded-md bg-surface border border-border text-sm placeholder-muted focus:outline-none focus:border-accent w-64"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted mr-1">Tools:</span>
          {allTools.map((t) => (
            <button
              key={t}
              onClick={() => setTool(tool === t ? null : t)}
              className={cn(
                'px-2 py-0.5 rounded text-[11px] font-mono border transition-colors',
                tool === t
                  ? 'bg-accent/15 border-accent/40 text-accent'
                  : 'bg-surface border-border text-muted hover:text-text',
              )}
            >
              {t}
            </button>
          ))}
          {(week !== 0 || tool || q) && (
            <button
              onClick={() => { setWeek(0); setTool(null); setQ(''); }}
              className="ml-2 inline-flex items-center gap-1 text-xs text-muted hover:text-text"
            >
              <X size={12} /> reset
            </button>
          )}
        </div>
        <div className="text-xs text-muted font-mono">{filtered.length} of {items.length} workflows</div>
      </div>

      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((w) => (
            <motion.div
              key={w.slug}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <WorkflowCard w={w} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted">No workflows match these filters.</div>
      )}
    </>
  );
}
