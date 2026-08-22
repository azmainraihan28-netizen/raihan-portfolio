'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Bubble = { text: string; bold?: boolean };

const BUBBLES: Bubble[] = [
  { text: 'Have Any idea?' },
  { text: "Let's Talk", bold: true },
];

const DOTS_MS = 1000;
const REVEAL_MS = 500;

export function TypingChat() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || started) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setStarted(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    if (reduce) {
      setStage(BUBBLES.length * 2);
      return;
    }
    let cancelled = false;
    const run = async () => {
      for (let i = 0; i < BUBBLES.length; i++) {
        if (cancelled) return;
        setStage(i * 2 + 1);
        await wait(DOTS_MS);
        if (cancelled) return;
        setStage(i * 2 + 2);
        await wait(REVEAL_MS);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [started, reduce]);

  return (
    <div
      ref={wrapRef}
      className="flex flex-col items-start gap-3 min-h-[120px]"
      aria-label="Chat prompt"
    >
      {BUBBLES.map((b, i) => {
        const dotsVisible = stage >= i * 2 + 1;
        const textVisible = stage >= i * 2 + 2;
        if (!dotsVisible) return null;
        return <ChatBubble key={i} bubble={b} showText={textVisible} />;
      })}
    </div>
  );
}

function ChatBubble({ bubble, showText }: { bubble: Bubble; showText: boolean }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="relative px-4 py-2.5 rounded-2xl rounded-bl-md bg-surface border border-border min-h-[42px] flex items-center"
    >
      {showText ? (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className={
            'text-[15px] leading-none whitespace-nowrap text-text/95 ' +
            (bubble.bold ? 'font-bold' : '')
          }
        >
          {bubble.text}
        </motion.span>
      ) : (
        <TypingDots />
      )}
    </motion.div>
  );
}

function TypingDots() {
  const reduce = useReducedMotion();
  return (
    <span className="inline-flex items-center gap-1" aria-label="typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-muted"
          animate={reduce ? undefined : { opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={
            reduce
              ? undefined
              : { duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }
          }
        />
      ))}
    </span>
  );
}

function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
