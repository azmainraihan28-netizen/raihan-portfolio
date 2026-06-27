'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Theme = 'dark' | 'light';

function readTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(readTheme());
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('light', next === 'light');
    try { localStorage.setItem('theme', next); } catch {}
    setTheme(next);
  }

  // Render a stable placeholder during SSR/first paint to avoid hydration mismatch
  if (!mounted) {
    return <div aria-hidden className="w-8 h-8" />;
  }

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.92, rotate: 12 }}
      transition={{ duration: 0.18 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="relative w-8 h-8 grid place-items-center rounded-md border border-border bg-surface text-muted hover:text-text hover:border-accent/30 transition-colors"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.span
            key="sun"
            initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 45, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.18 }}
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
            transition={{ duration: 0.18 }}
            className="absolute inset-0 grid place-items-center"
          >
            <Moon size={14} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
