'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container, CTAButton, Eyebrow } from './ui';

const EASE = [0.16, 1, 0.3, 1] as const;

/* Headline is split so it can enter word by word. The reveal establishes
   reading order on first paint -- the eye lands on "build" before it lands
   on "system behind it". */
const LINE_ONE = ['We', 'build', 'the', 'site,'];
const LINE_TWO = ['and', 'the', 'system', 'behind', 'it.'];

export function HeroHome() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Plates drift at different rates as the hero leaves. Depth cue only.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const frontY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const backY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-border">
      {/* Hairline grid, masked so it fades before it reaches the copy. */}
      <div aria-hidden className="absolute inset-0 tech-grid" />
      {/* One slow accent bloom. Transform-only animation, no repaint cost. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[8%] w-[38rem] h-[38rem] rounded-full blur-[120px] bg-accent/[0.16] animate-drift"
      />

      {/* Slightly under the viewport so the next band peeks. No scroll cue needed. */}
      <Container className="relative pt-14 md:pt-16 pb-20 md:pb-20 min-h-[calc(100dvh-9rem)] flex items-center">
        <div className="grid lg:grid-cols-[1.12fr,0.88fr] gap-14 lg:gap-12 items-center w-full">
          {/* ---------------- Copy ---------------- */}
          <div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Eyebrow>Web development and AI automation</Eyebrow>
            </motion.div>

            {/* Scale is planned against the plate width so line two never wraps. */}
            <h1 className="mt-7 font-display font-semibold tracking-[-0.045em] leading-[1.0] text-[clamp(2.4rem,5vw,3.5rem)]">
              <Line words={LINE_ONE} start={0.1} reduce={!!reduce} />
              <Line words={LINE_TWO} start={0.28} reduce={!!reduce} muted />
            </h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
              className="mt-7 text-[17px] leading-relaxed text-muted max-w-[46ch]"
            >
              Marketing sites, SaaS products, and n8n automations for founders who
              need both shipped in weeks, not quarters.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.62, ease: EASE }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <CTAButton href="/work" variant="primary" size="lg">
                See our work <ArrowRight size={17} strokeWidth={2} />
              </CTAButton>
              <CTAButton href="/contact" variant="ghost" size="lg">
                Start a project
              </CTAButton>
            </motion.div>
          </div>

          {/* ---------------- Plates ---------------- */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.24, ease: EASE }}
            className="relative mx-auto w-full max-w-[38rem] lg:max-w-none"
          >
            {/* Back plate: the automation side of the studio. */}
            <motion.div
              style={reduce ? undefined : { y: backY }}
              className="absolute -bottom-14 -left-4 sm:-left-8 w-[58%] rounded-card overflow-hidden border border-border bg-surface shadow-[0_30px_70px_-40px_rgba(0,0,0,0.85)]"
            >
              <Image
                src="/work/expenseai.png"
                alt="ExpenseAI dashboard built by the studio"
                width={900}
                height={563}
                sizes="(max-width: 1024px) 40vw, 22vw"
                className="block w-full h-auto"
              />
            </motion.div>

            {/* Front plate carries the LCP. */}
            <motion.div
              style={reduce ? undefined : { y: frontY }}
              className="relative ml-auto w-[88%] rounded-card overflow-hidden border border-border bg-surface shadow-[0_50px_100px_-50px_rgba(0,0,0,0.9)]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent z-10"
              />
              <Image
                src="/work/trendybd.png"
                alt="TrendyBD storefront built by the studio"
                width={1400}
                height={875}
                priority
                sizes="(max-width: 1024px) 88vw, 42vw"
                className="block w-full h-auto"
              />
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function Line({
  words,
  start,
  reduce,
  muted,
}: {
  words: string[];
  start: number;
  reduce: boolean;
  muted?: boolean;
}) {
  return (
    <span className={muted ? 'block text-muted' : 'block'}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          {/* pb reserve keeps descenders clear of the clip edge */}
          <span className="inline-block overflow-hidden pb-[0.09em] align-bottom">
            <motion.span
              initial={reduce ? false : { y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.75, delay: start + i * 0.06, ease: EASE }}
              className="inline-block"
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  );
}
