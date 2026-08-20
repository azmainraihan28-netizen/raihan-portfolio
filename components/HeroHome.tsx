'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Compass, Wrench, ShieldCheck } from 'lucide-react';
import { Container, CTAButton } from './ui';
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
      {/* Hairline grid + slow drift bloom, same tokens as the rest of the site */}
      <div aria-hidden className="absolute inset-0 tech-grid" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[10%] w-[42rem] h-[42rem] rounded-full blur-[130px] bg-accent/[0.16] animate-drift"
      />

      {/* The stage. Everything below stacks on top of one another. */}
      <div className="relative min-h-[calc(100dvh-5rem)] md:min-h-[calc(100dvh-3rem)] flex flex-col">
        {/* --- Giant background wordmark --- */}
        <BackgroundWordmark reduce={!!reduce} />

        {/* --- Portrait, cropped to the section bottom --- */}
        <Portrait reduce={!!reduce} />

        {/* --- Foreground content sits above the portrait/wordmark --- */}
        <Container className="relative z-30 flex-1 flex flex-col pt-24 md:pt-28 pb-16 md:pb-20">
          {/* Top row: eyebrow left, descriptor right */}
          <div className="grid md:grid-cols-2 gap-y-8 md:gap-8">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="max-w-[22ch]"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
                Vertex Studio
              </div>
              <p className="mt-4 font-display text-[1.35rem] md:text-[1.6rem] font-semibold tracking-[-0.02em] leading-tight text-text">
                The web-and-AI studio.
                <span className="block text-muted">Built like it matters.</span>
              </p>
            </motion.div>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
              className="md:justify-self-end md:text-right text-[15px] leading-relaxed text-muted max-w-[38ch]"
            >
              Working closely with founders to ship marketing sites, SaaS builds, and n8n
              automations that stay useful long after launch.
            </motion.p>
          </div>

          {/* Floating badge cluster - stat chips */}
          <div className="mt-10 md:mt-14 grid md:grid-cols-2 gap-6 md:gap-8 pointer-events-none">
            <div className="flex flex-wrap gap-3 md:justify-start">
              <StatCard glyph="V" value="35+" label="Projects shipped" delay={0.2} reduce={!!reduce} />
              <StatCard glyph="◐" value="92%" label="Client retention" delay={0.3} reduce={!!reduce} />
            </div>
            <div className="md:justify-self-end">
              <AttributesCard delay={0.35} reduce={!!reduce} />
            </div>
          </div>

          {/* Spacer pushes the headline block toward the bottom on tall screens */}
          <div className="flex-1 min-h-[8rem] md:min-h-[14rem]" />

          {/* Bottom center: headline + CTAs */}
          <div className="text-center md:text-left md:pl-[38%] lg:pl-[42%] max-w-[42rem] mx-auto md:mx-0">
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
              className="font-display font-semibold tracking-[-0.035em] leading-[1.02] text-[clamp(2rem,4.6vw,3.6rem)] text-text"
            >
              Web &amp; AI,
              <span className="block">Applied Differently.</span>
            </motion.h1>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
              className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start"
            >
              <CTAButton href="/contact" variant="primary" size="lg">
                Book a Call <ArrowRight size={17} strokeWidth={2} />
              </CTAButton>
              <CTAButton href="/work" variant="ghost" size="lg">
                See Our Work
              </CTAButton>
            </motion.div>
          </div>
        </Container>
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
      className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center"
    >
      <span
        className="font-display font-semibold text-accent select-none whitespace-nowrap"
        style={{
          fontSize: 'clamp(9rem, 26vw, 26rem)',
          lineHeight: 0.82,
          letterSpacing: '-0.06em',
          // Slight top clip so the caps line hugs the very top edge like the reference
          marginTop: '-0.08em',
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
      <div className="relative h-[75vh] md:h-[86vh] max-h-[860px] aspect-[7/8]">
        <Image
          src="/hero-portrait.png"
          alt="Vertex Studio founder"
          fill
          priority
          sizes="(max-width: 768px) 90vw, 60vw"
          className="object-contain object-bottom"
        />
      </div>
    </motion.div>
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
      className="pointer-events-auto inline-flex items-center gap-3 pr-4 pl-3 py-2.5 rounded-[14px] border border-white/10 bg-surface/70 backdrop-blur-md shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]"
    >
      <span className="grid place-items-center w-9 h-9 rounded-[10px] bg-accent text-on-accent font-display text-[15px] font-semibold">
        {glyph}
      </span>
      <div className="leading-none">
        <div className="font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-text">
          {value}
        </div>
        <div className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

function AttributesCard({ delay, reduce }: { delay: number; reduce: boolean }) {
  return (
    <motion.ul
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className="pointer-events-auto inline-flex flex-col gap-2 p-3 rounded-[14px] border border-white/10 bg-surface/70 backdrop-blur-md shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]"
    >
      {attributes.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="flex items-center gap-2.5 pl-1 pr-3 py-1"
        >
          <span className="grid place-items-center w-5 h-5 rounded-[6px] bg-accent/15 text-accent">
            <Icon size={12} strokeWidth={2.2} />
          </span>
          <span className="font-display text-[15px] font-semibold tracking-[-0.01em] text-text">
            {label}
          </span>
        </li>
      ))}
    </motion.ul>
  );
}
