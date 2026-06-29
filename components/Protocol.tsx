'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Container, Eyebrow } from './ui';

type Step = {
  num: string;
  title: string;
  body: string;
  bullets: string[];
  meta: string;
};

const steps: Step[] = [
  {
    num: '01',
    title: 'Discovery',
    body: 'We start with the actual pain — what manual ops are eating your week, what data lives where, what the success metric is. No slide decks, just a doc.',
    bullets: [
      'Current-state mapping (tools, data sources, who does what)',
      'ROI math (manual hours saved × cost) on day one',
      'One-page scope and price quote — fixed, not estimated',
    ],
    meta: 'Day 0 — 1',
  },
  {
    num: '02',
    title: 'Architecture',
    body: 'I draft the workflow in n8n, wire real credentials, and run it on your data. You see the canvas, not a Figma. Revisions happen on the actual flow.',
    bullets: [
      'n8n canvas built against your stack — Gmail, Sheets, Slack, etc.',
      'Cost per run measured and published — typically <$0.01',
      'Iteration on Loom + live test runs, not async screenshots',
    ],
    meta: 'Day 2 — 5',
  },
  {
    num: '03',
    title: 'Delivery',
    body: 'Workflow deployed to your n8n, credentials migrated, team walkthrough on Loom. 30-day support for tuning. Optional retainer if you want me on tap.',
    bullets: [
      'Deploy to your n8n (cloud or self-hosted)',
      'Loom walkthrough + written runbook',
      '30-day support · monthly retainer optional ($200–$500/mo)',
    ],
    meta: 'Day 5 — 7',
  },
];

export function Protocol() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Scroll progress through the whole sticky stack
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section className="relative border-y border-border bg-bg/40">
      <Container className="pt-24 pb-10">
        <div className="grid md:grid-cols-[1fr,1.4fr] gap-10 md:gap-16 items-start">
          <div className="md:sticky md:top-24">
            <Eyebrow>How a build happens</Eyebrow>
            <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
              From a 30-minute call
              <br />
              to a workflow{' '}
              <span className="font-serif italic font-normal text-accent">live in your stack</span>.
            </h2>
            <p className="mt-5 text-muted leading-relaxed max-w-md">
              The same three-step protocol I ran 30 times during the build challenge — refined
              from public, repeated execution. No discovery decks, no scope creep, no monthly
              "consulting" without code shipping.
            </p>
            <div className="mt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              Typical turnaround: 5–7 working days
            </div>
          </div>

          {/* Sticky stack scrub track */}
          <div ref={wrapRef} className="relative" style={{ minHeight: reduce ? 'auto' : '180vh' }}>
            {steps.map((s, i) => (
              <StickyStep
                key={s.num}
                step={s}
                index={i}
                total={steps.length}
                progress={scrollYProgress}
                reduce={!!reduce}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function StickyStep({
  step,
  index,
  total,
  progress,
  reduce,
}: {
  step: Step;
  index: number;
  total: number;
  progress: any;
  reduce: boolean;
}) {
  // Each card owns a slice of overall progress. As progress passes index/total
  // for the NEXT card, this one scales down + blurs + fades.
  const start = index / total;
  const end = (index + 1) / total;
  const next = (index + 1.0) / total;

  const scale = useTransform(progress, [start, end, next, 1], [1, 1, 0.94, 0.9]);
  const blur = useTransform(progress, [start, end, next, 1], [0, 0, 3, 6]);
  const opacity = useTransform(progress, [start, end, next], [1, 1, 0.55]);
  const y = useTransform(progress, [start, end], [0, 0]);

  const filter = useTransform(blur, (b) => (b > 0.05 ? `blur(${b}px)` : 'none'));

  const style = reduce
    ? {}
    : {
        scale,
        opacity,
        filter,
        y,
      };

  return (
    <motion.div
      style={style as any}
      className={
        'sticky top-28 mb-8 rounded-2xl border border-border bg-surface p-8 md:p-10 ' +
        'shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)] origin-top'
      }
    >
      <div className="flex items-start justify-between mb-6">
        <span className="font-mono text-5xl md:text-6xl font-semibold tracking-tighter text-text/[0.08]">
          {step.num}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted pt-3">
          {step.meta}
        </span>
      </div>
      <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">{step.title}</h3>
      <p className="mt-4 text-muted leading-relaxed max-w-lg">{step.body}</p>
      <ul className="mt-6 space-y-2.5">
        {step.bullets.map((b) => (
          <li key={b} className="flex items-start gap-3 text-sm">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            <span className="text-text/85">{b}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
