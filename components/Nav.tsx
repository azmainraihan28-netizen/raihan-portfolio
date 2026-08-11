'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { site } from '@/content/site';
import { cn } from '@/lib/cn';
import { projectDeceleration, rubberband, springDrawer } from '@/lib/springs';
import { ThemeToggle } from './ThemeToggle';

const links = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);

  // Scroll state via Motion's scroll observer, not a raw scroll listener.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (v) => setLifted(v > 12));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    /* The header keeps its box in flow so nothing jumps, but only the pill
       itself is interactive -- the gutter around it lets the page through.
       `scroll-edge` fades a soft mask directly under the pill once the
       page has scrolled, so the seam between chrome and content softens
       instead of a hard 1px rule. */
    <header
      data-lifted={lifted}
      className="scroll-edge sticky top-0 z-40 px-4 sm:px-6 py-3 pointer-events-none"
    >
      <div
        className={cn(
          'glass-bar pointer-events-auto max-w-container mx-auto h-16 rounded-pill',
          'pl-4 pr-2 sm:pl-5 sm:pr-2.5',
          'grid grid-cols-[auto,1fr,auto] items-center gap-4',
          'transition-shadow duration-300',
          lifted && 'shadow-[0_18px_44px_-16px_rgb(0_0_0/0.55)]',
        )}
      >
        {/* Left: mark + wordmark */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label={`${site.shortName} home`}>
          <span className="grid place-items-center w-9 h-9 rounded-pill bg-accent/15 border border-accent/25">
            <Image
              src="/logo-mark.png"
              alt=""
              width={30}
              height={30}
              priority
              className="w-[22px] h-[22px] object-contain"
            />
          </span>
          <span className="font-display font-semibold tracking-[-0.02em] text-[15px]">
            {site.shortName}
          </span>
        </Link>

        {/* Centre: links. Active state is a full-strength label plus an accent
            underline -- colour alone would not survive a bright plate passing
            under the glass. */}
        <nav className="hidden md:flex items-center justify-center gap-1" aria-label="Primary">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative px-3.5 py-2 text-sm whitespace-nowrap transition-colors',
                  active ? 'text-text font-medium' : 'text-text/70 hover:text-text',
                )}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    transition={springDrawer}
                    className="absolute left-3.5 right-3.5 bottom-1 h-[2px] rounded-full bg-accent"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: controls */}
        <div className="flex items-center gap-2 justify-end">
          <ThemeToggle />
          <Link
            href="/contact"
            data-press="pill"
            className="hidden sm:inline-flex items-center whitespace-nowrap px-5 py-2.5 rounded-pill text-sm font-medium bg-primary text-primary-on hover:bg-primary-hover"
          >
            Start a project
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            data-press="pill"
            className="md:hidden w-10 h-10 grid place-items-center rounded-pill border border-border/70 text-text"
          >
            {open ? <X size={17} strokeWidth={1.8} /> : <Menu size={17} strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      {/* Mobile sheet: a second floating glass panel, not a full-bleed
          overlay, so it reads as part of the same object. Origin is the
          burger button so the sheet materialises *from* what triggered it,
          honouring Apple's spatial-consistency rule. */}
      <AnimatePresence>
        {open && (
          <MobileSheet pathname={pathname} onClose={() => setOpen(false)} />
        )}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------------------------------------------
   MobileSheet

   A translucent drop panel that behaves like a physical thing:
   - Drag it down and it follows the finger 1:1.
   - Drag it *up* past its rest and it resists progressively
     (rubber-band) instead of stopping — the panel reads as elastic,
     not frozen.
   - Release: velocity + position decide whether it flies away (close)
     or springs back (stay). We use the *sign* of release velocity so
     even a small downward flick commits, matching iOS sheet behaviour.
   - The drop-in itself springs down from the burger (origin-top) rather
     than cross-fading, so opening reads as materialising from source.
   ------------------------------------------------------------ */
function MobileSheet({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  // The panel gradually loses opacity as it is dragged away, so the
  // dismissal reads as intentional rather than accidental.
  const opacity = useTransform(y, [0, 240], [1, 0.35]);

  const drag = useRef({
    active: false,
    startY: 0,
    startVal: 0,
    running: null as ReturnType<typeof animate> | null,
    samples: [] as { t: number; y: number }[],
  });

  const runningRef = drag.current;

  const closeAway = useCallback(
    (velocity: number) => {
      runningRef.running?.stop();
      // Slide off from the presentation value, not a fixed target — so
      // interrupting a spring-back mid-flight and re-flicking still feels
      // continuous.
      const h = sheetRef.current?.offsetHeight ?? 320;
      runningRef.running = animate(y, h + 40, {
        ...springDrawer,
        velocity,
      });
      runningRef.running.then(() => onClose());
    },
    [y, onClose, runningRef],
  );

  const springHome = useCallback(
    (velocity: number) => {
      runningRef.running?.stop();
      runningRef.running = animate(y, 0, {
        ...springDrawer,
        velocity,
      });
    },
    [y, runningRef],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const el = sheetRef.current;
    if (!el) return;
    runningRef.running?.stop();
    el.setPointerCapture(e.pointerId);
    runningRef.active = true;
    runningRef.startY = e.clientY;
    runningRef.startVal = y.get();
    runningRef.samples = [{ t: performance.now(), y: e.clientY }];
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!runningRef.active) return;
    const dy = e.clientY - runningRef.startY;
    // Downward: 1:1 tracking. Upward past rest (dy < 0): rubber-band so
    // the surface reads as elastic and the user knows there is no more.
    const h = sheetRef.current?.offsetHeight ?? 320;
    const raw = runningRef.startVal + dy;
    const clamped = raw < 0 ? rubberband(raw, h) : raw;
    y.set(clamped);
    runningRef.samples.push({ t: performance.now(), y: e.clientY });
    if (runningRef.samples.length > 6) runningRef.samples.shift();
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!runningRef.active) return;
    runningRef.active = false;
    try {
      sheetRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
    const samples = runningRef.samples;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const dt = Math.max(1, last.t - first.t);
    const v = ((last.y - first.y) / dt) * 1000; // px/s
    // Project where the sheet would coast to. If it clears one-third of
    // its own height, commit; otherwise spring home.
    const h = sheetRef.current?.offsetHeight ?? 320;
    const projected = y.get() + projectDeceleration(v);
    if (projected > h / 3 || v > 500) {
      closeAway(v);
    } else {
      springHome(v);
    }
  };

  return (
    <motion.div
      ref={sheetRef}
      initial={{ y: -12, opacity: 0, scale: 0.985 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -12, opacity: 0, scale: 0.985 }}
      transition={springDrawer}
      style={{ y, opacity }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className="glass-bar pointer-events-auto md:hidden mt-3 rounded-card p-4 origin-top touch-none select-none"
    >
      {/* Drag affordance. Named a "grabber" in iOS sheets. */}
      <span
        aria-hidden
        className="mx-auto mb-3 block h-1 w-9 rounded-full bg-text/25"
      />
      <nav className="flex flex-col" aria-label="Mobile">
        {links.map((l, i) => {
          const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
          return (
            <motion.div
              key={l.href}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 + i * 0.04, ...springDrawer }}
            >
              <Link
                href={l.href}
                aria-current={active ? 'page' : undefined}
                data-press="card"
                className={cn(
                  'flex items-center gap-3 py-3.5 border-b border-border/60 font-display text-xl font-semibold tracking-[-0.02em]',
                  active ? 'text-text' : 'text-text/75',
                )}
              >
                {active && <span aria-hidden className="w-1.5 h-5 rounded-full bg-accent" />}
                {l.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>
      <Link
        href="/contact"
        data-press="pill"
        className="mt-5 flex items-center justify-center w-full px-5 py-3.5 rounded-pill bg-primary text-primary-on font-medium"
      >
        Start a project
      </Link>
    </motion.div>
  );
}
