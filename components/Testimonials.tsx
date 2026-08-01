'use client';

import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { site } from '@/content/site';

/* A rail rather than a grid: six quotes in a 3-column grid is another
   card wall, and this page already has one. Horizontal scroll keeps the
   section short and signals there is more than fits. */
export function Testimonials() {
  const railRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  function nudge(dir: -1 | 1) {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: reduce ? 'auto' : 'smooth' });
  }

  return (
    <div>
      <div
        ref={railRef}
        className="rail flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5 sm:-mx-8 sm:px-8"
      >
        {site.testimonials.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: Math.min(i, 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
            /* Narrower than a third of the container so the next card peeks
               and the rail reads as scrollable without a scroll cue. */
            className="snap-start shrink-0 w-[82vw] sm:w-[340px] rounded-card border border-border bg-surface p-7 flex flex-col hover:border-accent/35 transition-colors"
          >
            <span aria-hidden className="font-display text-5xl leading-none text-accent/35 select-none">
              &ldquo;
            </span>
            <blockquote className="mt-3 text-[15.5px] leading-[1.6] text-text/90">
              {t.quote}
            </blockquote>
            <figcaption className="mt-auto pt-7 flex items-center gap-3">
              <span className="w-9 h-9 rounded-pill bg-accent/10 border border-accent/25 grid place-items-center font-mono text-[12px] text-accent shrink-0">
                {t.name.split(' ').map((s) => s[0]).slice(0, 2).join('')}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium truncate">{t.name}</span>
                <span className="block text-xs text-muted truncate">{t.role}</span>
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-2">
        <RailButton label="Previous testimonials" onClick={() => nudge(-1)}>
          <ArrowLeft size={16} strokeWidth={2} />
        </RailButton>
        <RailButton label="More testimonials" onClick={() => nudge(1)}>
          <ArrowRight size={16} strokeWidth={2} />
        </RailButton>
      </div>
    </div>
  );
}

function RailButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="w-10 h-10 grid place-items-center rounded-pill border border-border bg-surface text-muted hover:text-text hover:border-accent/40 active:scale-95 transition-all"
    >
      {children}
    </button>
  );
}
