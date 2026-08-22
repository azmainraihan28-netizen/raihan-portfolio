'use client';

import {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useReducedMotion } from 'framer-motion';
import { site } from '@/content/site';

const GRADIENTS = [
  'linear-gradient(135deg, #5e6ad2, #8b5cf6)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ec4899, #d946ef)',
  'linear-gradient(135deg, #3b82f6, #6366f1)',
  'linear-gradient(135deg, #ef4444, #f97316)',
];

function initialsFor(name: string) {
  return name
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Testimonials({ visibleBehind = 2 }: { visibleBehind?: number }) {
  const items = site.testimonials;
  const total = items.length;
  const reduce = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartRef = useRef(0);

  const navigate = useCallback(
    (newIndex: number) => setActiveIndex(((newIndex % total) + total) % total),
    [total],
  );

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (reduce) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartRef.current = clientX;
  };

  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      setDragOffset(clientX - dragStartRef.current);
    },
    [isDragging],
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    if (Math.abs(dragOffset) > 60) {
      navigate(activeIndex + (dragOffset < 0 ? 1 : -1));
    }
    setIsDragging(false);
    setDragOffset(0);
  }, [isDragging, dragOffset, activeIndex, navigate]);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('touchmove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchend', handleDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  if (!total) return null;

  return (
    <section className="relative mx-auto w-full max-w-[640px] pb-12">
      <div className="relative h-[320px] sm:h-[300px]">
        {items.map((t, index) => {
          const displayOrder = (index - activeIndex + total) % total;
          const isActive = displayOrder === 0;

          const style: CSSProperties = {
            transitionProperty: 'transform, opacity',
            transitionDuration: isDragging && isActive ? '0ms' : '480ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          };

          if (isActive) {
            style.transform = `translateX(${dragOffset}px) rotate(${dragOffset * 0.02}deg)`;
            style.opacity = 1;
            style.zIndex = total;
          } else if (displayOrder <= visibleBehind) {
            const scale = 1 - 0.05 * displayOrder;
            const translateY = -14 * displayOrder;
            style.transform = `translateY(${translateY}px) scale(${scale})`;
            style.opacity = 1 - 0.28 * displayOrder;
            style.zIndex = total - displayOrder;
          } else {
            style.transform = 'translateY(-40px) scale(0.9)';
            style.opacity = 0;
            style.zIndex = 0;
          }

          const gradient = GRADIENTS[index % GRADIENTS.length];

          return (
            <article
              key={t.name}
              aria-hidden={!isActive}
              onMouseDown={isActive ? handleDragStart : undefined}
              onTouchStart={isActive ? handleDragStart : undefined}
              style={style}
              className={[
                'absolute inset-x-0 top-0 rounded-card border border-border',
                'bg-surface/80 backdrop-blur-xl',
                'shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)]',
                'p-7 md:p-8 select-none',
                isActive ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none',
              ].join(' ')}
            >
              <span
                aria-hidden
                className="font-display text-5xl leading-none text-accent/35 select-none"
              >
                &ldquo;
              </span>
              <blockquote className="mt-3 text-[15.5px] md:text-[16.5px] leading-[1.6] text-text/90">
                {t.quote}
              </blockquote>
              <figcaption className="mt-7 pt-5 border-t border-border flex items-center gap-3">
                <span
                  className="w-11 h-11 rounded-[12px] grid place-items-center font-display text-[13px] font-semibold text-white shrink-0"
                  style={{ background: gradient }}
                >
                  {initialsFor(t.name)}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium truncate">{t.name}</span>
                  <span className="block text-xs text-muted truncate">{t.role}</span>
                </span>
              </figcaption>
            </article>
          );
        })}
      </div>

      <div className="absolute left-0 right-0 bottom-0 flex justify-center gap-2">
        {items.map((_, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={i}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => navigate(i)}
              className={[
                'h-1.5 rounded-pill transition-all duration-300',
                active ? 'w-6 bg-accent' : 'w-1.5 bg-border hover:bg-muted',
              ].join(' ')}
            />
          );
        })}
      </div>
    </section>
  );
}
