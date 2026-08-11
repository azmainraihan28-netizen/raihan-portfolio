'use client';

import { cn } from '@/lib/cn';
import Link from 'next/link';
import { useRef, type ReactNode } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { springSnap } from '@/lib/springs';

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('max-w-container mx-auto px-5 sm:px-8', className)}>{children}</div>;
}

/* Eyebrow is rationed on purpose: at most one per three sections.
   Most sections carry their headline alone. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] text-muted font-mono',
        className,
      )}
    >
      <span className="w-8 h-px bg-accent/60" />
      {children}
    </div>
  );
}

export function ToolChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-pill text-[11px] font-mono bg-surface2 border border-border text-muted">
      {children}
    </span>
  );
}

/* One accent, one shape. Week is data (which track a project came from),
   so it stays -- but it is not a colour-coded rainbow any more. */
export function WeekBadge({ week, className }: { week: number; className?: string }) {
  const label = week === 5 ? 'WEB' : `W${week}`;
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-pill text-[10px] font-mono tracking-wider',
        'border border-accent/25 bg-accent/10 text-accent',
        className,
      )}
    >
      {label}
    </span>
  );
}

export function PriceRange({ low, high }: { low: number; high: number }) {
  const fmt = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`);
  return (
    <span className="font-mono text-text">
      {fmt(low)}
      <span className="text-muted">-</span>
      {fmt(high)}
    </span>
  );
}

/* ------------------------------------------------------------------
   CTAButton

   variant "primary" is an inverted neutral fill (off-white on dark,
   ink on light). That clears WCAG AA in both themes, which a violet
   fill with white text does not.
   variant "ghost" is a hairline-stroked pill.

   Magnetic pull runs on motion values, never React state, so pointer
   movement does not re-render the tree.
   ------------------------------------------------------------------ */
type CTAProps = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  size?: 'md' | 'lg';
  className?: string;
  external?: boolean;
};

export function CTAButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className,
  external,
}: CTAProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  // Magnetic pull runs through springs so cursor motion never re-renders.
  // The spring itself is critically damped in each axis (no overshoot),
  // matching the "move / reposition" values Apple ships for repositioning
  // interactions (damping 1.0, response 0.4).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 26, mass: 0.4 });
  const y = useSpring(my, { stiffness: 260, damping: 26, mass: 0.4 });

  // Press-in is a separate spring on scale that starts from the *live*
  // presentation value on interruption, so a fast press-release-press
  // does not visibly jump. `animate()` on the motion value handles that
  // for us: calling it again mid-flight retargets from the current value
  // and carries velocity forward.
  const scale = useMotionValue(1);

  function onMove(e: React.PointerEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.14);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.14);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }
  function onPointerDown() {
    if (reduce) return;
    animate(scale, 0.955, springSnap);
  }
  function onPointerUp() {
    if (reduce) return;
    animate(scale, 1, springSnap);
  }

  const styles =
    variant === 'primary'
      ? 'bg-primary text-primary-on hover:bg-primary-hover font-medium'
      : 'bg-transparent text-text border border-border hover:border-accent/50 hover:bg-surface';

  const sz = size === 'lg' ? 'px-6 py-3 text-[15px]' : 'px-5 py-2.5 text-sm';

  const inner = (
    <motion.span
      style={reduce ? undefined : { scale }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-pill whitespace-nowrap',
        styles,
        sz,
      )}
    >
      {children}
    </motion.span>
  );

  return (
    <motion.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={reduce ? undefined : { x, y }}
      className={cn('inline-block', className)}
    >
      {external ? (
        <a href={href} target="_blank" rel="noopener" className="inline-block">
          {inner}
        </a>
      ) : (
        <Link href={href} className="inline-block">
          {inner}
        </Link>
      )}
    </motion.span>
  );
}

/* Section headline. Stacked vertically -- no big-headline-left /
   small-paragraph-floating-right split headers. */
export function SectionTitle({
  eyebrow,
  title,
  sub,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={cn('mb-14', className)}>
      {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
      <h2 className="font-display text-[2rem] md:text-[2.9rem] font-semibold tracking-[-0.03em] leading-[1.08] max-w-3xl">
        {title}
      </h2>
      {sub && <p className="mt-5 text-muted leading-relaxed max-w-[62ch]">{sub}</p>}
    </div>
  );
}

/* Full-bleed hairline used to separate bands without boxing them in cards. */
export function Rule({ className }: { className?: string }) {
  return <div aria-hidden className={cn('h-px w-full bg-border', className)} />;
}
