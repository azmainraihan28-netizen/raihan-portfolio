'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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
      {/* Ambient background: hairline grid + one slow bloom */}
      <div aria-hidden className="absolute inset-0 tech-grid opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[10%] w-[46rem] h-[46rem] rounded-full blur-[140px] bg-accent/[0.14] animate-drift"
      />

      {/* One stage, everything is absolutely positioned inside it so nothing collides. */}
      <div className="relative mx-auto w-full max-w-[92rem] px-5 md:px-8 min-h-[calc(100dvh-5rem)] h-[54rem] md:h-[56rem] lg:h-[62rem]">
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

        {/* Giant editorial wordmark. Sits behind everything. */}
        <BackgroundWordmark reduce={!!reduce} />

        {/* Portrait — main focal point, cropped to section bottom. */}
        <Portrait reduce={!!reduce} />

        {/* Floating glass chip clusters, outside the portrait silhouette. */}
        <LeftChips reduce={!!reduce} />
        <RightChips reduce={!!reduce} />

        {/* Hover-to-cycle "Who am I?" prompt, tucked in the left mid-band. */}
        <WhoAmI reduce={!!reduce} />

        {/* Bottom headline + CTAs, pinned. */}
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
      initial={reduce ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: EASE }}
      className="pointer-events-none absolute inset-x-0 top-[3rem] md:top-[4rem] z-10 flex justify-center px-4"
    >
      <span
        className="font-wordmark text-accent select-none whitespace-nowrap leading-[0.86]"
        style={{
          fontSize: 'clamp(8rem, 24vw, 26rem)',
          letterSpacing: '-0.05em',
          fontWeight: 700,
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
      initial={reduce ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center"
    >
      {/* Portrait bumped so head lands inside the VERTEX caps, shoulders anchor the base. */}
      <div className="relative h-[34rem] md:h-[42rem] lg:h-[50rem] aspect-[1208/1302]">
        <Image
          src="/hero-portrait.png"
          alt="Vertex Studio founder"
          fill
          priority
          sizes="(max-width: 768px) 88vw, 42rem"
          className="object-contain object-bottom drop-shadow-[0_40px_60px_rgba(0,0,0,0.35)]"
        />
      </div>
    </motion.div>
  );
}

function LeftChips({ reduce }: { reduce: boolean }) {
  return (
    <div className="absolute left-4 md:left-8 top-[16rem] md:top-[18rem] lg:top-[21rem] z-30 flex flex-col gap-3">
      <StatCard glyph="V" value="35+" label="Projects" delay={0.32} reduce={reduce} />
      <StatCard glyph="◐" value="92%" label="Retention" delay={0.4} reduce={reduce} />
    </div>
  );
}

function RightChips({ reduce }: { reduce: boolean }) {
  return (
    <motion.ul
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.44, ease: EASE }}
      className={GLASS + ' absolute right-4 md:right-8 top-[16rem] md:top-[18rem] lg:top-[21rem] z-30 flex flex-col gap-1.5 p-2.5 rounded-[18px]'}
    >
      {attributes.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-2.5 pl-1.5 pr-4 py-1.5">
          <span className="grid place-items-center w-5 h-5 rounded-[6px] bg-accent/20 text-accent">
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
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={GLASS + ' inline-flex items-center gap-3 pr-4 pl-2.5 py-2.5 rounded-[16px]'}
    >
      <span className="grid place-items-center w-9 h-9 rounded-[10px] bg-accent text-on-accent font-display text-[15px] font-semibold shadow-[0_10px_25px_-10px_rgb(var(--accent)/0.7)]">
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

const HEADLINE_LINES = ['Web & AI,', 'Applied Differently.'];

/* Split in two: headline sits on the right of the portrait, CTAs sit
   center-bottom where they used to. Keeps the typing effect visible while
   restoring the original CTA placement. */
function BottomBlock({ reduce }: { reduce: boolean }) {
  return (
    <>
      <motion.h1
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.5, ease: EASE }}
        className="absolute right-4 md:right-8 bottom-[9rem] md:bottom-[10rem] lg:bottom-[11rem] z-40 max-w-[32rem] pl-4 text-right font-display font-semibold tracking-[-0.035em] leading-[1.02] text-[clamp(2rem,4.4vw,3.4rem)] text-text"
      >
        <TypedHeadline lines={HEADLINE_LINES} reduce={reduce} />
      </motion.h1>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.62, ease: EASE }}
        className="absolute inset-x-0 bottom-8 md:bottom-12 z-40 flex flex-wrap gap-3 justify-center px-4"
      >
        <CTAButton href="/contact" variant="primary" size="lg">
          Book a Call <ArrowRight size={17} strokeWidth={2} />
        </CTAButton>
        <CTAButton href="/work" variant="ghost" size="lg">
          See Our Work
        </CTAButton>
      </motion.div>
    </>
  );
}

/* Types the headline character-by-character, one line after the next.
   The blinking caret sits at the end of the current line while typing and
   at the end of the last line once it settles. Reduced-motion users get
   the finished string with no caret. */
function TypedHeadline({ lines, reduce }: { lines: string[]; reduce: boolean }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce || done) return;
    const current = lines[lineIdx];
    if (charIdx < current.length) {
      const id = setTimeout(() => setCharIdx((c) => c + 1), 55);
      return () => clearTimeout(id);
    }
    if (lineIdx < lines.length - 1) {
      const id = setTimeout(() => {
        setLineIdx((i) => i + 1);
        setCharIdx(0);
      }, 380);
      return () => clearTimeout(id);
    }
    setDone(true);
  }, [charIdx, lineIdx, lines, done, reduce]);

  if (reduce) {
    return (
      <>
        {lines.map((l, i) => (
          <span key={i} className={i === lines.length - 1 ? 'block text-accent' : 'block'}>
            {l}
          </span>
        ))}
      </>
    );
  }

  return (
    <>
      {lines.map((l, i) => {
        const isCurrent = i === lineIdx;
        const finished = i < lineIdx;
        const text = finished ? l : isCurrent ? l.slice(0, charIdx) : '';
        const showCaret = (isCurrent && !done) || (done && i === lines.length - 1);
        return (
          <span
            key={i}
            className={i === lines.length - 1 ? 'block text-accent' : 'block'}
          >
            {text}
            {/* Reserve trailing space so line-two doesn't reflow when the caret shows up */}
            {!finished && !isCurrent && '​'}
            {showCaret && <Caret settled={done} />}
          </span>
        );
      })}
    </>
  );
}

function Caret({ settled }: { settled: boolean }) {
  return (
    <span
      aria-hidden
      className={
        'inline-block align-baseline ml-[0.06em] w-[0.06em] h-[0.9em] bg-accent translate-y-[0.1em] ' +
        (settled ? 'animate-caret-blink' : 'opacity-90')
      }
    />
  );
}

/* "Who am I?" prompt. Idle it reads as a hint; on hover it cycles through
   the identity lines every second and returns to the prompt on leave. */
const WHOAMI_LINES = [
  'Sometime Web developer.',
  'Sometime AI expert.',
  'Sometime gamer.',
  'Sometime lazy.',
  'Sometime creator.',
];

function WhoAmI({ reduce }: { reduce: boolean }) {
  const [hovering, setHovering] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!hovering) {
      setIdx(0);
      return;
    }
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % WHOAMI_LINES.length);
    }, 1000);
    return () => clearInterval(id);
  }, [hovering]);

  const shown = hovering ? WHOAMI_LINES[idx] : 'Who am I?';

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.5, ease: EASE }}
      className="absolute left-4 md:left-8 bottom-[9rem] md:bottom-[10.5rem] lg:bottom-[12rem] z-40 max-w-[34rem]"
    >
      <div
        role="button"
        tabIndex={0}
        aria-label="Cycle who I am"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        className="group inline-flex items-baseline gap-3 cursor-pointer select-none outline-none"
      >
        <span aria-hidden className="font-mono text-[12px] md:text-[13px] uppercase tracking-[0.22em] text-muted">
          /
        </span>
        <span className="relative inline-block min-h-[1.4em] font-display font-semibold tracking-[-0.025em] leading-[1.1] text-text text-[1.75rem] md:text-[2.25rem] lg:text-[2.75rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={shown}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: EASE }}
              className={hovering ? 'text-accent' : 'text-text'}
            >
              {shown}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
      <div className="mt-3 pl-6 font-mono text-[11px] uppercase tracking-[0.22em] text-muted/70">
        Hover to peek
      </div>
    </motion.div>
  );
}

/* Shared glass surface. Very transparent, heavy blur, thin edge, soft drop.
   Reads glassy in both light and dark themes because it leans on
   `bg-surface/40` (white/40 in light, near-black/40 in dark) plus a
   translucent white inset that catches the accent bloom behind it. */
const GLASS =
  'bg-surface/40 backdrop-blur-2xl border border-white/15 ring-1 ring-inset ring-white/10 ' +
  'shadow-[0_30px_60px_-30px_rgba(0,0,0,0.55)]';
