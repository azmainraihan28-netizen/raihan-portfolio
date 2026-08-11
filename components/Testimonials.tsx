'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { site } from '@/content/site';
import { projectDeceleration, rubberband, springMomentum } from '@/lib/springs';

/**
 * Testimonial rail with real momentum physics.
 *
 * A plain `overflow-x-auto snap-x` rail scrolls but does not *throw*.
 * Apple's fluid-interfaces model instead:
 *
 *   1. Pointer-down grabs the track and pins to the finger 1:1.
 *   2. Every pointermove updates x live and records a rolling velocity
 *      sample, so we know the throw speed at release.
 *   3. Past either boundary the follow ratio falls off progressively
 *      (rubber-band) rather than clamping — the surface reads as "there
 *      is nothing more here" instead of "frozen".
 *   4. On release, we project where the finger would coast to using
 *      exponential decay (the same curve iOS uses for scroll) and snap
 *      to the nearest card from *that* projected point, not from the
 *      release point. That is what makes a flick feel like a throw.
 *   5. Velocity is handed off to the settle spring so there is no seam
 *      between dragging and animating.
 *
 * The whole thing is interruptible: another pointer-down mid-flight
 * kills the running animation and starts from the current on-screen x.
 */
export function Testimonials() {
  const railRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const [bounds, setBounds] = useState({ min: 0, max: 0, step: 340 });
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  // Measure the difference between the track and the viewport, plus the
  // per-card step so buttons and snapping share a single source of truth.
  useLayoutEffect(() => {
    const rail = railRef.current;
    const track = trackRef.current;
    if (!rail || !track) return;

    function measure() {
      if (!rail || !track) return;
      const first = track.firstElementChild as HTMLElement | null;
      const second = track.children[1] as HTMLElement | undefined;
      const gap = 20; // matches the Tailwind gap-5 below
      const step = first
        ? first.offsetWidth + (second ? second.offsetLeft - first.offsetLeft - first.offsetWidth : gap)
        : 340;
      const min = -(track.scrollWidth - rail.clientWidth);
      setBounds({ min: Math.min(0, min), max: 0, step });
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(rail);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  // Track which end we are near so we can hint the buttons.
  useEffect(() => {
    const unsub = x.on('change', (v) => {
      setCanLeft(v < -1);
      setCanRight(v > bounds.min + 1);
    });
    return unsub;
  }, [x, bounds.min]);

  /* ------------ pointer + momentum ------------ */

  const drag = useRef({
    active: false,
    startX: 0,
    startVal: 0,
    running: null as ReturnType<typeof animate> | null,
    samples: [] as { t: number; x: number }[],
  });

  const applyWithRubberband = useCallback(
    (raw: number) => {
      const rail = railRef.current;
      const dim = rail?.clientWidth || 600;
      if (raw > bounds.max) {
        return bounds.max + rubberband(raw - bounds.max, dim);
      }
      if (raw < bounds.min) {
        return bounds.min + rubberband(raw - bounds.min, dim);
      }
      return raw;
    },
    [bounds.min, bounds.max],
  );

  const settleTo = useCallback(
    (target: number, velocity: number) => {
      const clamped = Math.max(bounds.min, Math.min(bounds.max, target));
      drag.current.running?.stop();
      // Hand the release velocity to the settle spring so drag→animate
      // has no perceptible seam.
      drag.current.running = animate(x, clamped, {
        ...springMomentum,
        velocity,
      });
    },
    [x, bounds.min, bounds.max],
  );

  function nearestSnap(projected: number) {
    if (bounds.step <= 0) return projected;
    const clampedProjection = Math.max(bounds.min, Math.min(bounds.max, projected));
    return Math.round(clampedProjection / bounds.step) * bounds.step;
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (reduce) return;
    // Ignore secondary buttons and non-primary contacts.
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const el = railRef.current;
    if (!el) return;
    // Interrupt any running settle so we start from the *presentation* value.
    drag.current.running?.stop();
    el.setPointerCapture(e.pointerId);
    drag.current.active = true;
    drag.current.startX = e.clientX;
    drag.current.startVal = x.get();
    drag.current.samples = [{ t: performance.now(), x: e.clientX }];
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    const raw = drag.current.startVal + dx;
    x.set(applyWithRubberband(raw));
    // Keep a short window of samples so the release velocity is honest.
    drag.current.samples.push({ t: performance.now(), x: e.clientX });
    if (drag.current.samples.length > 6) drag.current.samples.shift();
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    try {
      railRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
    // px/s velocity from the rolling window
    const samples = drag.current.samples;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const dt = Math.max(1, last.t - first.t);
    const vRaw = ((last.x - first.x) / dt) * 1000; // px/s of finger travel
    // Drag inverts naturally when we translate the track along with it.
    const vTrack = vRaw;
    const projected = x.get() + projectDeceleration(vTrack);
    const target = nearestSnap(projected);
    settleTo(target, vTrack);
  };

  function nudge(dir: -1 | 1) {
    const target = nearestSnap(x.get() + dir * -bounds.step);
    settleTo(target, 0);
  }

  const trackStyle = useMemo(() => ({ x, touchAction: 'pan-y' as const }), [x]);

  return (
    <div>
      <div
        ref={railRef}
        className="relative overflow-hidden select-none -mx-5 sm:-mx-8 px-5 sm:px-8"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <motion.div
          ref={trackRef}
          style={reduce ? undefined : trackStyle}
          className="flex gap-5 pb-2 cursor-grab active:cursor-grabbing"
        >
          {site.testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: Math.min(i, 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0 w-[82vw] sm:w-[340px] rounded-card border border-border bg-surface p-7 flex flex-col hover:border-accent/35 transition-colors"
            >
              <span aria-hidden className="font-display text-5xl leading-none text-accent/35 select-none">
                &ldquo;
              </span>
              <blockquote className="mt-3 text-[15.5px] leading-[1.6] text-text/90">
                {t.quote}
              </blockquote>
              <figcaption className="mt-auto pt-7 flex items-center gap-3">
                <span className="w-9 h-9 rounded-pill bg-accent/10 border border-accent/25 grid place-items-center font-mono text-[12px] text-accent shrink-0">
                  {t.name.split(' ').map((s) => s[0]).slice(0, 2).join('')}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium truncate">{t.name}</span>
                  <span className="block text-xs text-muted truncate">{t.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>

      <div className="mt-8 flex items-center gap-2">
        <RailButton label="Previous testimonials" onClick={() => nudge(-1)} disabled={!canLeft}>
          <ArrowLeft size={16} strokeWidth={2} />
        </RailButton>
        <RailButton label="More testimonials" onClick={() => nudge(1)} disabled={!canRight}>
          <ArrowRight size={16} strokeWidth={2} />
        </RailButton>
      </div>
    </div>
  );
}

function RailButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      data-press="pill"
      className="w-10 h-10 grid place-items-center rounded-pill border border-border bg-surface text-muted hover:text-text hover:border-accent/40 disabled:opacity-40 disabled:pointer-events-none transition-colors"
    >
      {children}
    </button>
  );
}
