'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

type Stat = { label: string; value: string; note?: string };

/**
 * Parses "35+", "92%", "2-4 wks" into { prefix, num, suffix } and animates
 * only the leading numeric portion. Non-numeric values render plain.
 */
function parse(value: string): { prefix: string; num: number | null; suffix: string } {
  const m = value.match(/^([^\d-]*)(-?\d+(?:\.\d+)?)(.*)$/);
  if (!m) return { prefix: value, num: null, suffix: '' };
  return { prefix: m[1], num: parseFloat(m[2]), suffix: m[3] };
}

function format(num: number, original: number): string {
  const orig = String(original);
  if (orig.includes('.')) return num.toFixed(orig.split('.')[1].length);
  return Math.round(num).toString();
}

function CountUpNumber({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? target : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const start = performance.now();
    const dur = 1100;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      setVal(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target]);

  return <span ref={ref}>{format(val, target)}</span>;
}

/* No card containers. Numbers breathe on hairlines -- boxing four metrics
   in four identical tiles is the same three-equal-cards move twice over. */
export function CountUpStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-border">
      {stats.map((s, i) => {
        const p = parse(s.value);
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-border py-8 pr-6 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:pl-8 lg:first:pl-0"
          >
            <div className="font-display text-[2.6rem] md:text-[3.4rem] font-semibold tracking-[-0.05em] leading-none">
              {p.num === null ? (
                s.value
              ) : (
                <>
                  {p.prefix}
                  <CountUpNumber target={p.num} />
                  {p.suffix}
                </>
              )}
            </div>
            <div className="mt-3 text-sm text-text/80">{s.label}</div>
            {s.note && <div className="mt-1 text-[13px] text-muted leading-relaxed">{s.note}</div>}
          </motion.div>
        );
      })}
    </div>
  );
}
