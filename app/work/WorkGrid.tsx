'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { WorkflowCard } from '@/components/WorkflowCard';
import { cn } from '@/lib/cn';
import type { Workflow, WorkKind } from '@/lib/work';

const KINDS: { v: WorkKind | 'all'; label: string }[] = [
  { v: 'all', label: 'All work' },
  { v: 'webdev', label: 'Web & Product' },
  { v: 'automation', label: 'AI Automation' },
];

const VISIBLE_TOOLS = 12;

export function WorkGrid({ items }: { items: Workflow[] }) {
  const [kind, setKind] = useState<WorkKind | 'all'>('all');
  const [tool, setTool] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [showAllTools, setShowAllTools] = useState(false);

  // Ranked by how often a tool actually appears, so the first row is useful.
  const rankedTools = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((i) => i.tools.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t);
  }, [items]);

  const shownTools = showAllTools ? rankedTools : rankedTools.slice(0, VISIBLE_TOOLS);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((i) => {
      if (kind !== 'all' && i.kind !== kind) return false;
      if (tool && !i.tools.includes(tool)) return false;
      if (
        needle &&
        !`${i.title} ${i.tagline} ${i.client || ''} ${i.tools.join(' ')}`.toLowerCase().includes(needle)
      )
        return false;
      return true;
    });
  }, [items, kind, tool, q]);

  const dirty = kind !== 'all' || !!tool || !!q;

  return (
    <>
      <div className="flex flex-col gap-5 mb-10">
        <div className="flex flex-wrap items-center gap-2">
          {KINDS.map((k) => (
            <button
              key={k.v}
              onClick={() => setKind(k.v)}
              aria-pressed={kind === k.v}
              className={cn(
                'px-4 py-2 rounded-pill text-sm border transition-colors',
                kind === k.v
                  ? 'bg-accent/12 text-accent border-accent/40'
                  : 'bg-surface text-muted border-border hover:text-text hover:border-accent/25',
              )}
            >
              {k.label}
            </button>
          ))}

          <div className="w-full sm:w-auto sm:ml-auto relative">
            <label htmlFor="work-search" className="sr-only">
              Search projects by name, client, or stack
            </label>
            <Search
              size={15}
              aria-hidden
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
            <input
              id="work-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects"
              className="w-full sm:w-72 pl-10 pr-3 py-2.5 rounded-input bg-surface border border-border text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted mr-1.5">
            <SlidersHorizontal size={13} aria-hidden /> Stack
          </span>
          {shownTools.map((t) => (
            <button
              key={t}
              onClick={() => setTool(tool === t ? null : t)}
              aria-pressed={tool === t}
              className={cn(
                'px-2.5 py-1 rounded-pill text-[11px] font-mono border transition-colors',
                tool === t
                  ? 'bg-accent/12 border-accent/40 text-accent'
                  : 'bg-surface border-border text-muted hover:text-text',
              )}
            >
              {t}
            </button>
          ))}
          {rankedTools.length > VISIBLE_TOOLS && (
            <button
              onClick={() => setShowAllTools((v) => !v)}
              className="px-2.5 py-1 rounded-pill text-[11px] font-mono border border-dashed border-border text-muted hover:text-text"
            >
              {showAllTools ? 'Show less' : `+${rankedTools.length - VISIBLE_TOOLS} more`}
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-muted font-mono">
            {filtered.length} of {items.length} projects
          </span>
          {dirty && (
            <button
              onClick={() => {
                setKind('all');
                setTool(null);
                setQ('');
              }}
              className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
            >
              <X size={12} aria-hidden /> Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length > 0 ? (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((w) => (
              <motion.div
                key={w.slug}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <WorkflowCard w={w} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty state tells you how to get back to content, it does not just apologise. */
        <div className="rounded-card border border-dashed border-border bg-surface/50 py-20 px-6 text-center">
          <h3 className="font-display text-xl font-semibold tracking-[-0.025em]">
            Nothing matches those filters.
          </h3>
          <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
            Try a broader stack filter, or clear everything to see all {items.length} projects.
          </p>
          <button
            onClick={() => {
              setKind('all');
              setTool(null);
              setQ('');
            }}
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-pill text-sm bg-primary text-primary-on hover:bg-primary-hover"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
