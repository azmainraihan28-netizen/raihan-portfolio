/**
 * Spring presets, named after intent rather than physics.
 *
 * Apple's Designing Fluid Interfaces replaced the mass/stiffness/damping
 * triplet with two designer-friendly numbers: a damping ratio (`bounce`)
 * and a response (`duration`). Framer Motion's `type: 'spring'` accepts
 * the same pair, so these presets translate directly.
 *
 * Rule of thumb:
 * - Default UI motion is critically damped (bounce 0), so nothing
 *   overshoots when it settles.
 * - Bounce only appears where a gesture carried momentum: a flick, a
 *   drag release, a physical throw. Overshoot on something that just
 *   faded in reads as gratuitous; overshoot on something you flung
 *   reads as physical.
 */

import type { ValueAnimationTransition } from 'framer-motion';

/* Presets are typed as ValueAnimationTransition<number>, the exact shape
   `animate(MotionValue<number>, number, T)` wants. They still work as
   plain `transition={...}` props on <motion.*> because that field
   accepts the same union. */
type Spring = ValueAnimationTransition<number>;

/** Critically damped, snappy. The default for repositioning UI. */
export const springDefault: Spring = {
  type: 'spring',
  bounce: 0,
  duration: 0.42,
};

/** Same character, shorter — for pressed states and small toggles. */
export const springSnap: Spring = {
  type: 'spring',
  bounce: 0,
  duration: 0.28,
};

/** Under-damped. Only for gesture-released motion (drag ends, flicks). */
export const springMomentum: Spring = {
  type: 'spring',
  bounce: 0.22,
  duration: 0.5,
};

/** Drawer / sheet. Slight give at rest so it feels physical, not stuck. */
export const springDrawer: Spring = {
  type: 'spring',
  bounce: 0.18,
  duration: 0.42,
};

/** Rotation / small orbit. Matches Apple's rotation values. */
export const springRotate: Spring = {
  type: 'spring',
  bounce: 0.18,
  duration: 0.4,
};

/** Standing easing curve for the rare non-spring transition
 *  (opacity fades, colour transitions where no position moves). */
export const easeOut = [0.16, 1, 0.3, 1] as const;

/**
 * Momentum projection — Apple's exponential-decay estimate of where a
 * gesture will come to rest given its release velocity. Use it to pick
 * the snap target from the projected landing point, not the release point.
 *
 * `initialVelocity` is in px/s. `decelerationRate` matches iOS: 0.998
 * for a normal scroll feel, 0.99 for a snappier one.
 */
export function projectDeceleration(
  initialVelocity: number,
  decelerationRate = 0.998,
): number {
  return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}

/**
 * Rubber-band resistance at a soft boundary. `overshoot` is how far past
 * the bound the pointer has travelled; `dimension` is the axis length
 * (viewport width for a horizontal rail, sheet height for a drawer).
 * Result is the on-screen displacement to apply — always less than the
 * raw overshoot, with the ratio falling off the further past the bound.
 */
export function rubberband(
  overshoot: number,
  dimension: number,
  constant = 0.55,
): number {
  if (dimension <= 0) return 0;
  const abs = Math.abs(overshoot);
  const sign = overshoot < 0 ? -1 : 1;
  return sign * (abs * dimension * constant) / (dimension + constant * abs);
}
