'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

type Stat = { label: string; value: string };

/**
 * Parses a stat value like "30", "$0.002", "6+", "$100–$6k" into:
 *  { prefix, num, suffix }
 * — only animates the leading numeric portion. Non-numeric stats fade in plain.
 */
function parse(value: string): { prefix: string; num: number | null; suffix: string } {
  const m = value.match(/^([^\d-]*)(-?\d+(?:\.\d+)?)(.*)$/);
  if (!m) return { prefix: value, num: null, suffix: '' };
  return { prefix: m[1], num: parseFloat(m[2]), suffix: m[3] };
}

function format(num: number, original: number): string {
  // Preserve decimal count of the original
  const orig = String(original);
  if (orig.includes('.')) {
    const decimals = orig.split('.')[1].length;
    return num.toFixed(decimals);
  }
  return Math.round(num).toString();
}

function CountUpNumber({ target, decimalOf }: { target: number; decimalOf: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? target : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target]);

  return <span ref={ref}>{format(val, decimalOf)}</span>;
}

export function CountUpStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((s, i) => {
        const parsed = parse(s.value);
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="font-mono text-3xl md:text-4xl tracking-tight text-text">
              {parsed.num === null ? (
                s.value
              ) : (
                <>
                  {parsed.prefix}
                  <CountUpNumber target={parsed.num} decimalOf={parsed.num} />
                  {parsed.suffix}
                </>
              )}
            </div>
            <div className="text-xs text-muted mt-1 uppercase tracking-wider">{s.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
