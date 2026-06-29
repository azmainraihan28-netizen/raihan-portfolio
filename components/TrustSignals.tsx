'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock3, Globe2 } from 'lucide-react';

const items = [
  {
    icon: Clock3,
    label: 'Average turnaround',
    value: '5–7 days',
    desc: 'From signed scope to deployed workflow.',
  },
  {
    icon: CheckCircle2,
    label: 'Shipped this year',
    value: '30 / 30',
    desc: 'Full public build challenge — all 30 workflows live.',
  },
  {
    icon: Globe2,
    label: 'Working with',
    value: 'Worldwide · remote',
    desc: 'Async-first. Loom over meetings. EST → BST overlap.',
  },
];

export function TrustSignals() {
  return (
    <div className="grid sm:grid-cols-3 gap-4 md:gap-5">
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="
              group relative rounded-xl border border-border bg-surface p-6
              hover:border-accent/30 transition-colors
            "
          >
            <div className="flex items-center gap-3">
              <span
                className="
                  w-9 h-9 rounded-lg grid place-items-center
                  bg-accent/10 text-accent border border-accent/20
                  group-hover:bg-accent/15 transition-colors
                "
              >
                <Icon size={16} strokeWidth={1.8} />
              </span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-muted font-mono">
                {it.label}
              </span>
            </div>
            <div className="mt-4 text-xl font-semibold tracking-tight">{it.value}</div>
            <p className="mt-1.5 text-sm text-muted leading-relaxed">{it.desc}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
