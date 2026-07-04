'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { site } from '@/content/site';
import { cn } from '@/lib/cn';

const ACCENT: Record<string, string> = {
  orange: 'from-orange-500/25 to-orange-500/0 text-orange-400',
  blue: 'from-sky-500/25 to-sky-500/0 text-sky-400',
  sky: 'from-cyan-500/25 to-cyan-500/0 text-cyan-400',
  violet: 'from-violet-500/25 to-violet-500/0 text-violet-300',
  green: 'from-emerald-500/25 to-emerald-500/0 text-emerald-400',
  red: 'from-rose-500/25 to-rose-500/0 text-rose-400',
};

export function Testimonials() {
  const items = site.testimonials;
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((t, i) => (
        <motion.figure
          key={t.name}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'relative rounded-2xl border border-border bg-surface p-6 md:p-7 overflow-hidden',
            'hover:border-accent/30 transition-colors',
          )}
        >
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-70',
              'bg-gradient-to-br',
              ACCENT[t.accent]?.split(' ').slice(0, 2).join(' ') ?? 'from-accent/20 to-accent/0',
            )}
          />
          <Quote size={18} className={cn('relative', ACCENT[t.accent]?.split(' ')[2] ?? 'text-accent')} strokeWidth={1.5} />
          <blockquote className="relative mt-4 text-[15px] leading-relaxed text-text/90">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption className="relative mt-6 flex items-center gap-3 pt-4 border-t border-dashed border-border">
            <span className="w-9 h-9 rounded-full bg-accent/10 border border-accent/20 grid place-items-center font-mono text-sm text-accent">
              {t.name.split(' ').map((s) => s[0]).slice(0, 2).join('')}
            </span>
            <span>
              <span className="block text-sm font-medium">{t.name}</span>
              <span className="block text-xs text-muted">{t.role}</span>
            </span>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
