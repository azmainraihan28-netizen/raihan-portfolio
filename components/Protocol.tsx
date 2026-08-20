'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Container, Eyebrow } from './ui';
import { FileText, Image as ImageIcon, Figma } from 'lucide-react';

type Attachment = { icon: 'fig' | 'img' | 'doc'; name: string };
type Msg = {
  from: 'you' | 'vs';
  text?: string;
  attach?: Attachment;
  reactions?: string[];
  time: string;
};

type Section = {
  num: string;
  label: string;
  messages: Msg[];
};

const thread: Section[] = [
  {
    num: '01',
    label: 'Book the call',
    messages: [
      { from: 'you', text: 'saw your work. we need a site + something to auto-follow-up leads.', time: '10:02' },
      { from: 'vs', text: "you're in the right place. 30-min call tomorrow?", time: '10:03' },
      { from: 'you', text: 'sent 🙌', time: '10:04' },
    ],
  },
  {
    num: '02',
    label: 'Scope it together',
    messages: [
      { from: 'vs', text: 'call was great. sending scope + timeline now.', time: 'Day 1 · 15:20' },
      {
        from: 'vs',
        attach: { icon: 'doc', name: 'vertex-scope-v1.pdf' },
        time: 'Day 1 · 15:20',
      },
      { from: 'you', text: 'clean. signed. what do you need from us?', reactions: ['🔥 2'], time: 'Day 1 · 16:44' },
      { from: 'vs', text: 'brand assets, one login to your n8n, and a slack channel.', time: 'Day 1 · 16:46' },
    ],
  },
  {
    num: '03',
    label: 'Design & build',
    messages: [
      { from: 'vs', text: 'first hero direction is up 👇', time: 'Day 3 · 11:10' },
      { from: 'vs', attach: { icon: 'fig', name: 'homepage-v1.fig' }, time: 'Day 3 · 11:10' },
      { from: 'you', text: 'did you read my mind. bolder type though.', time: 'Day 3 · 12:02' },
      { from: 'vs', text: 'on it. change anything, as often as you want.', time: 'Day 3 · 12:04' },
      { from: 'vs', text: 'automation is live on staging btw. cold-email + lead scoring wired.', time: 'Day 6 · 09:31' },
      { from: 'vs', attach: { icon: 'img', name: 'n8n-lead-flow.png' }, time: 'Day 6 · 09:31' },
    ],
  },
  {
    num: '04',
    label: 'Ship it',
    messages: [
      { from: 'vs', text: 'pushed to prod. walkthrough loom in your inbox 📼', time: 'Day 14 · 18:22' },
      { from: 'you', text: 'first three leads already replied. wild.', reactions: ['🚀 3'], time: 'Day 15 · 09:47' },
      { from: 'vs', text: '30-day support is on. ping this thread anytime.', time: 'Day 15 · 09:49' },
    ],
  },
];

export function Protocol() {
  return (
    <section className="relative border-b border-border">
      <Container className="pt-24 md:pt-32 pb-24 md:pb-28">
        <div className="grid md:grid-cols-[1fr,1.35fr] gap-12 md:gap-16 items-start">
          {/* Left: intro column, sticky on desktop */}
          <div className="md:sticky md:top-28">
            <Eyebrow className="mb-6">How we work</Eyebrow>
            <h2 className="font-display text-[2rem] md:text-[3rem] font-semibold tracking-[-0.035em] leading-[1.03]">
              One thread. Zero back-and-forth.
            </h2>
            <p className="mt-6 text-muted leading-relaxed max-w-[44ch]">
              No portals to log into, no forms to chase. From the first hello to the day it ships,
              your project lives inside a single Slack thread with the people actually building it.
            </p>
            <div className="mt-9 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              Typical turnaround: 2 to 4 weeks
            </div>
          </div>

          {/* Right: chat window */}
          <ChatWindow />
        </div>
      </Container>
    </section>
  );
}

function ChatWindow() {
  return (
    <div className="relative rounded-card border border-border bg-surface overflow-hidden shadow-[0_40px_90px_-50px_rgba(0,0,0,0.85)]">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-border bg-surface2/60 backdrop-blur">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex -space-x-1.5">
            <span className="w-5 h-5 rounded-full bg-accent border border-surface2" />
            <span className="w-5 h-5 rounded-full bg-primary border border-surface2" />
          </span>
          <span className="font-mono text-[12px] text-text/85 truncate">
            <span className="text-accent">vertex-studio</span>
            <span className="text-muted mx-1.5">×</span>
            <span>your-brand</span>
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-emerald-400/70 animate-ping" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            live
          </span>
        </div>
      </div>

      {/* Thread body */}
      <div className="px-5 md:px-7 py-6 md:py-8 space-y-8">
        {thread.map((section, si) => (
          <SectionBlock key={section.num} section={section} sectionIndex={si} />
        ))}
        <TypingRow />
      </div>
    </div>
  );
}

function SectionBlock({ section, sectionIndex }: { section: Section; sectionIndex: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduce = useReducedMotion();

  return (
    <div ref={ref} className="space-y-4">
      {/* Section divider */}
      <div className="flex items-center gap-3 pt-2">
        <span className="h-px flex-1 bg-border" />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-accent whitespace-nowrap">
          {section.num} · {section.label}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {section.messages.map((m, i) => (
        <motion.div
          key={i}
          initial={reduce ? undefined : { opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.4,
            delay: reduce ? 0 : sectionIndex * 0.05 + i * 0.09,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <MessageRow msg={m} />
        </motion.div>
      ))}
    </div>
  );
}

function MessageRow({ msg }: { msg: Msg }) {
  const isYou = msg.from === 'you';
  return (
    <div className="flex items-start gap-3">
      <Avatar who={msg.from} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-mono text-[12px] text-text/90">
            {isYou ? 'you' : 'vertex-studio'}
          </span>
          <span className="font-mono text-[10.5px] text-muted">{msg.time}</span>
        </div>

        {msg.text && (
          <p className="text-[14px] leading-relaxed text-text/85">{msg.text}</p>
        )}

        {msg.attach && <AttachmentChip attach={msg.attach} />}

        {msg.reactions && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {msg.reactions.map((r) => (
              <span
                key={r}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-pill border border-accent/25 bg-accent/10 text-accent font-mono text-[11px]"
              >
                {r}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({ who }: { who: 'you' | 'vs' }) {
  if (who === 'you') {
    return (
      <span className="shrink-0 grid place-items-center w-8 h-8 rounded-[10px] bg-primary text-primary-on font-display text-[13px] font-semibold">
        Y
      </span>
    );
  }
  return (
    <span className="shrink-0 grid place-items-center w-8 h-8 rounded-[10px] bg-accent text-on-accent font-display text-[12px] font-semibold ring-1 ring-accent/40">
      VS
    </span>
  );
}

function AttachmentChip({ attach }: { attach: Attachment }) {
  const Icon = attach.icon === 'fig' ? Figma : attach.icon === 'img' ? ImageIcon : FileText;
  return (
    <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1.5 rounded-[10px] border border-border bg-surface2 max-w-full">
      <Icon size={13} strokeWidth={1.8} className="text-accent shrink-0" />
      <span className="font-mono text-[12px] text-text/85 truncate">{attach.name}</span>
    </div>
  );
}

function TypingRow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTick((t) => (t + 1) % 3), 380);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <motion.div
      ref={ref}
      initial={reduce ? undefined : { opacity: 0, y: 6 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex items-center gap-3 pt-1"
    >
      <Avatar who="vs" />
      <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[12px] bg-surface2 border border-border">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted transition-opacity duration-200"
            style={{ opacity: reduce ? 0.6 : tick === i ? 1 : 0.35 }}
          />
        ))}
      </div>
      <span className="font-mono text-[11px] text-muted">still shipping…</span>
    </motion.div>
  );
}
