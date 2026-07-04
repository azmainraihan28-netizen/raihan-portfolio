'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { WorkflowCard } from '@/components/WorkflowCard';
import { cn } from '@/lib/cn';
import type { Workflow, WorkKind } from '@/lib/work';

const KINDS: { v: WorkKind | 'all'; label: string }[] = [
  { v: 'all', label: 'All work' },
  { v: 'webdev', label: 'Web & Product' },
  { v: 'automation', label: 'AI Automation' },
];

export function WorkGrid({ items }: { items: Workflow[] }) {
  const [kind, setKind] = useState<WorkKind | 'all'>('all');
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
      if (kind !== 'all' && i.kind !== kind) return false;
      if (tool && !i.tools.includes(tool)) return false;
      if (needle && !(`${i.title} ${i.tagline} ${i.client || ''} ${i.tools.join(' ')}`.toLowerCase().includes(needle))) return false;
      return true;
    });
  }, [items, kind, tool, q]);

  return (
    <>
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {KINDS.map((k) => (
            <button
              key={k.v}
              onClick={() => setKind(k.v)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm border transition-colors',
                kind === k.v
                  ? 'bg-accent text-white border-accent'
                  : 'bg-surface text-muted border-border hover:text-text',
              )}
            >
              {k.label}
            </button>
          ))}
          <div className="ml-auto relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects…"
              className="pl-9 pr-3 py-2 rounded-md bg-surface border border-border text-sm placeholder-muted focus:outline-none focus:border-accent w-64"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted mr-1">Stack:</span>
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
          {(kind !== 'all' || tool || q) && (
            <button
              onClick={() => { setKind('all'); setTool(null); setQ(''); }}
              className="ml-2 inline-flex items-center gap-1 text-xs text-muted hover:text-text"
            >
              <X size={12} /> reset
            </button>
          )}
        </div>
        <div className="text-xs text-muted font-mono">{filtered.length} of {items.length} projects</div>
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
        <div className="text-center py-20 text-muted">No projects match these filters.</div>
      )}
    </>
  );
}
