'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
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
    body: 'We start with the outcome, not the deliverable. What does the site need to sell, or the automation need to remove from your week? One doc, one clear scope, one fixed price.',
    bullets: [
      'Goals, audience, and success metrics on a single page',
      'Current-state mapping across tools, data sources, workflows',
      'Fixed-price scope, not an estimate',
    ],
    meta: 'Week 0',
  },
  {
    num: '02',
    title: 'Design and Build',
    body: 'For sites and apps: high-fidelity design first, then production build. For automations: an n8n canvas wired to real credentials from day one. You see progress on the actual thing, not a Figma stand-in.',
    bullets: [
      'Designed in Figma, engineered in Next.js or React Native',
      'n8n workflows on your stack, with real APIs and real data',
      'Weekly async demos on Loom, live builds you can click through',
    ],
    meta: 'Week 1 to 3',
  },
  {
    num: '03',
    title: 'Ship and Support',
    body: 'We deploy to your infrastructure, hand off documentation, walk your team through it, and stay on to tune. Optional retainer if you want us on tap for the next iteration.',
    bullets: [
      'Deployed to Vercel, Supabase, your n8n, or your app store',
      'Written runbook plus a Loom walkthrough for the team',
      '30-day support, with a monthly retainer optional',
    ],
    meta: 'Week 3 to 4',
  },
];

export function Protocol() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section className="relative border-b border-border">
      <Container className="pt-24 md:pt-32 pb-12">
        <div className="grid md:grid-cols-[1fr,1.35fr] gap-12 md:gap-16 items-start">
          <div className="md:sticky md:top-28">
            <Eyebrow className="mb-6">How we work</Eyebrow>
            <h2 className="font-display text-[2rem] md:text-[3rem] font-semibold tracking-[-0.035em] leading-[1.03]">
              From a 30-minute call to something live in your business.
            </h2>
            <p className="mt-6 text-muted leading-relaxed max-w-[44ch]">
              The same three-step protocol we run across marketing sites, SaaS products,
              mobile apps, and n8n automations. No discovery theatre, no scope creep, no
              consulting hours without shipping.
            </p>
            <div className="mt-9 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              Typical turnaround: 2 to 4 weeks
            </div>
          </div>

          {/* Sticky stack. Each card pins, then recedes as the next arrives. */}
          <div ref={wrapRef} className="relative" style={{ minHeight: reduce ? 'auto' : '190vh' }}>
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
  const start = index / total;
  const end = (index + 1) / total;
  // The final card is the one the reader is meant to land on, so it never recedes.
  const isLast = index === total - 1;

  const scale = useTransform(progress, [start, end, 1], [1, 1, 0.9]);
  const opacity = useTransform(progress, [start, end, 1], [1, 1, 0.4]);
  const blur = useTransform(progress, [start, end, 1], [0, 0, 5]);
  const filter = useTransform(blur, (b: number) => (b > 0.05 ? `blur(${b}px)` : 'none'));

  return (
    <motion.div
      style={reduce || isLast ? undefined : ({ scale, opacity, filter } as any)}
      className="sticky top-28 mb-8 rounded-card border border-border bg-surface p-8 md:p-11 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.85)] origin-top"
    >
      <div className="flex items-start justify-between mb-7">
        <span className="font-display text-5xl md:text-6xl font-semibold tracking-[-0.05em] text-accent/25 leading-none">
          {step.num}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted pt-2">
          {step.meta}
        </span>
      </div>
      <h3 className="font-display text-[1.75rem] md:text-4xl font-semibold tracking-[-0.03em]">
        {step.title}
      </h3>
      <p className="mt-4 text-muted leading-relaxed max-w-[52ch]">{step.body}</p>
      {/* Hairline-indexed, not bulleted. Dots on every row are filler. */}
      <ul className="mt-8 border-t border-border">
        {step.bullets.map((b) => (
          <li key={b} className="py-3 border-b border-border text-sm text-text/85 leading-relaxed">
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
