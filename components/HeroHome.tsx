'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Compass, Wrench, ShieldCheck } from 'lucide-react';
import { CTAButton } from './ui';
import { easeOut } from '@/lib/springs';

const EASE = easeOut;

const attributes = [
  { icon: Sparkles, label: 'Creative' },
  { icon: ShieldCheck, label: 'Reliable' },
  { icon: Compass, label: 'Strategic' },
  { icon: Wrench, label: 'Engineered' },
  { icon: Zap, label: 'Fast' },
];

export function HeroHome() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-border bg-bg">
      {/* Ambient background: hairline grid + one slow bloom, same tokens as the rest of the site */}
      <div aria-hidden className="absolute inset-0 tech-grid opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[10%] w-[42rem] h-[42rem] rounded-full blur-[130px] bg-accent/[0.14] animate-drift"
      />

      {/* One stage. Everything is absolutely positioned inside it so nothing collides. */}
      <div className="relative mx-auto w-full max-w-[86rem] px-5 md:px-8 min-h-[calc(100dvh-6rem)] h-[46rem] md:h-[44rem] lg:h-[48rem]">
        {/* Top row: eyebrow left, one-line descriptor right */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative z-40 pt-8 md:pt-10 flex items-start justify-between gap-6"
        >
          <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-accent">
            Vertex Studio
          </div>
          <div className="hidden md:block font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted max-w-[24rem] text-right leading-[1.6]">
            Web development · AI automation
            <br />
            Built for founders, in weeks not quarters
          </div>
        </motion.div>

        {/* Background wordmark: absolute, tucked behind the portrait, no overlap with side chips */}
        <BackgroundWordmark reduce={!!reduce} />

        {/* Portrait: absolute bottom-centered, main visual anchor */}
        <Portrait reduce={!!reduce} />

        {/* Floating chip clusters, positioned outside the portrait silhouette */}
        <LeftChips reduce={!!reduce} />
        <RightChips reduce={!!reduce} />

        {/* Bottom headline + CTAs, centered under portrait */}
        <BottomBlock reduce={!!reduce} />
      </div>
    </section>
  );
}

/* ---------- pieces ---------- */

function BackgroundWordmark({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      aria-hidden
      initial={reduce ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, ease: EASE }}
      className="pointer-events-none absolute inset-x-0 top-[3rem] md:top-[3.5rem] z-10 flex justify-center px-8"
    >
      <span
        className="font-display font-semibold text-accent select-none whitespace-nowrap leading-none"
        style={{
          fontSize: 'clamp(6rem, 16vw, 15rem)',
          letterSpacing: '-0.055em',
        }}
      >
        VERTEX
      </span>
    </motion.div>
  );
}

function Portrait({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2, ease: EASE }}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center"
    >
      {/* Fixed portrait height per breakpoint keeps the wordmark clearance predictable */}
      <div className="relative h-[26rem] md:h-[30rem] lg:h-[34rem] aspect-[1208/1302]">
        <Image
          src="/hero-portrait.png"
          alt="Vertex Studio founder"
          fill
          priority
          sizes="(max-width: 768px) 80vw, 34rem"
          className="object-contain object-bottom"
        />
      </div>
    </motion.div>
  );
}

function LeftChips({ reduce }: { reduce: boolean }) {
  return (
    <div className="absolute left-4 md:left-8 top-[14rem] md:top-[15rem] lg:top-[17rem] z-30 flex flex-col gap-3">
      <StatCard glyph="V" value="35+" label="Projects" delay={0.3} reduce={reduce} />
      <StatCard glyph="◐" value="92%" label="Retention" delay={0.38} reduce={reduce} />
    </div>
  );
}

function RightChips({ reduce }: { reduce: boolean }) {
  return (
    <motion.ul
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.42, ease: EASE }}
      className="absolute right-4 md:right-8 top-[14rem] md:top-[15rem] lg:top-[17rem] z-30 flex flex-col gap-1.5 p-2 rounded-[16px] border border-border bg-surface/85 backdrop-blur-md shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]"
    >
      {attributes.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5">
          <span className="grid place-items-center w-5 h-5 rounded-[6px] bg-accent/15 text-accent">
            <Icon size={12} strokeWidth={2.2} />
          </span>
          <span className="font-display text-[14px] md:text-[15px] font-semibold tracking-[-0.01em] text-text">
            {label}
          </span>
        </li>
      ))}
    </motion.ul>
  );
}

function StatCard({
  glyph,
  value,
  label,
  delay,
  reduce,
}: {
  glyph: string;
  value: string;
  label: string;
  delay: number;
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className="inline-flex items-center gap-3 pr-4 pl-2.5 py-2.5 rounded-[14px] border border-border bg-surface/85 backdrop-blur-md shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]"
    >
      <span className="grid place-items-center w-9 h-9 rounded-[10px] bg-accent text-on-accent font-display text-[15px] font-semibold">
        {glyph}
      </span>
      <div className="leading-none">
        <div className="font-display text-[1.25rem] font-semibold tracking-[-0.02em] text-text">
          {value}
        </div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

function BottomBlock({ reduce }: { reduce: boolean }) {
  return (
    <div className="absolute inset-x-0 bottom-6 md:bottom-10 z-30 flex flex-col items-center gap-6 text-center px-4">
      <motion.h1
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
        className="font-display font-semibold tracking-[-0.035em] leading-[1.02] text-[clamp(1.9rem,4.2vw,3.2rem)] text-text max-w-[22ch]"
      >
        Web &amp; AI, <span className="text-muted">Applied Differently.</span>
      </motion.h1>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <CTAButton href="/contact" variant="primary" size="lg">
          Book a Call <ArrowRight size={17} strokeWidth={2} />
        </CTAButton>
        <CTAButton href="/work" variant="ghost" size="lg">
          See Our Work
        </CTAButton>
      </motion.div>
    </div>
  );
}
