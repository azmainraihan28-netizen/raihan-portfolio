'use client';

import {
  motion,
  type HTMLMotionProps,
  type Variants,
  useReducedMotion,
} from 'framer-motion';
import { type ReactNode } from 'react';

/* ---------------- shared transitions ---------------- */

export const EASE = [0.22, 1, 0.36, 1] as const; // gentle out-expo

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/* ---------------- helpers ---------------- */

function useMotionSafeVariants(v: Variants): Variants {
  const reduce = useReducedMotion();
  if (!reduce) return v;
  // Replace transforms with opacity-only for reduced motion
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  };
}

/* ---------------- components ---------------- */

type DivMotionProps = HTMLMotionProps<'div'> & { children?: ReactNode; delay?: number };

export function FadeUp({ children, delay = 0, ...rest }: DivMotionProps) {
  const variants = useMotionSafeVariants(fadeUpVariants);
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: '-40px' }}
      transition={delay ? { delay } : undefined}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, delay = 0, ...rest }: DivMotionProps) {
  const variants = useMotionSafeVariants(fadeInVariants);
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={delay ? { delay } : undefined}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, ...rest }: DivMotionProps) {
  const variants = useMotionSafeVariants(staggerParent);
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: '-40px' }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* Same stagger orchestration but triggers on mount instead of scroll.
   Use for above-the-fold hero content where the InView observer
   may never fire in pre-paint contexts. */
export function StaggerOnMount({ children, ...rest }: DivMotionProps) {
  const variants = useMotionSafeVariants(staggerParent);
  return (
    <motion.div variants={variants} initial="hidden" animate="visible" {...rest}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...rest }: DivMotionProps) {
  const variants = useMotionSafeVariants(staggerItem);
  return (
    <motion.div variants={variants} {...rest}>
      {children}
    </motion.div>
  );
}

/* Card with a subtle hover lift + soft glow.
   Used to wrap server-rendered card markup without breaking layout. */
export function HoverCard({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      whileHover={reduce ? undefined : { y: -4, transition: { duration: 0.25, ease: EASE } }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* Tap-scale wrapper for CTAs and inputs. */
export function TapShrink({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* Re-export raw motion for ad-hoc uses (page-level orchestration). */
export { motion, useReducedMotion };
