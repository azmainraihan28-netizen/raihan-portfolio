'use client';

import { useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { springRotate } from '@/lib/springs';

type Theme = 'dark' | 'light';

function readTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}

/* View Transitions are still Chromium-only at time of writing. When they
   are available we use them so the theme swap radiates outward from the
   toggle button itself — the visual origin of the interaction — instead
   of the whole viewport flipping colours at once. Elsewhere we fall back
   to the plain class swap, which the body's colour transition still
   softens without any visible flash. */
type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    setTheme(readTheme());
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';

    const commit = () => {
      document.documentElement.classList.toggle('light', next === 'light');
      try {
        localStorage.setItem('theme', next);
      } catch {}
      setTheme(next);
    };

    const doc = document as ViewTransitionDoc;
    const canView = typeof doc.startViewTransition === 'function' && !reduce;
    if (!canView) {
      commit();
      return;
    }

    // Origin = the toggle's centre. The new theme paints in a circle
    // that expands from there to cover the viewport, so the change reads
    // as radiating out from the surface you touched — Apple's "anchored
    // to source" rule for popovers and menus applied to a full-viewport
    // effect.
    const rect = btnRef.current?.getBoundingClientRect();
    const originX = rect ? rect.left + rect.width / 2 : window.innerWidth - 32;
    const originY = rect ? rect.top + rect.height / 2 : 32;
    const radius = Math.hypot(
      Math.max(originX, window.innerWidth - originX),
      Math.max(originY, window.innerHeight - originY),
    );

    const transition = doc.startViewTransition!(() => commit());
    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${originX}px ${originY}px)`,
              `circle(${radius}px at ${originX}px ${originY}px)`,
            ],
          },
          {
            duration: 420,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      })
      .catch(() => {
        /* transition already applied via commit(); nothing to fix up */
      });
  }

  if (!mounted) {
    return <div aria-hidden className="w-9 h-9" />;
  }

  return (
    <motion.button
      ref={btnRef}
      onClick={toggle}
      whileHover={{ y: -1 }}
      transition={springRotate}
      data-press="pill"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="relative w-9 h-9 grid place-items-center rounded-pill border border-border bg-surface text-muted hover:text-text hover:border-accent/40 transition-colors"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.span
            key="sun"
            initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 45, opacity: 0, scale: 0.7 }}
            transition={springRotate}
            className="absolute inset-0 grid place-items-center"
          >
            <Sun size={14} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 45, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -45, opacity: 0, scale: 0.7 }}
            transition={springRotate}
            className="absolute inset-0 grid place-items-center"
          >
            <Moon size={14} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
