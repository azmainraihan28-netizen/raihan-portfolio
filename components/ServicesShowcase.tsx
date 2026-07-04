'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Layout, Cpu } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

type Tool = {
  name: string;
  dx: number; // x offset from card center at hover state (px)
  dy: number; // y offset from card center at hover state (px)
  color: string; // hex, used for the pill and glow
  logo: 'simpleicons' | 'letter';
  slug?: string; // simpleicons slug when logo === 'simpleicons'
};

// Positions are given as (dx, dy) in px from the CARD CENTER at hover state.
// Pills start hidden at (0,0) behind the card content and animate out to these anchors.
// Coordinates are hand-tuned so pills clear the card boundary (~440×440) and
// fan around the outside without overlapping neighboring content.
// Positions are (dx, dy) in px from the CARD CENTER at hover state.
// Pills start hidden at (0,0) behind the card content and fan out to a row
// above the card and a row below. Kept inside the section horizontally so
// nothing clips on typical laptop widths.
const WEB_TOOLS: Tool[] = [
  { name: 'Google',   dx: -180, dy: -250, color: '#4285F4', logo: 'simpleicons', slug: 'google' },
  { name: 'Lovable',  dx:  -60, dy: -260, color: '#ff5c8a', logo: 'letter' },
  { name: 'Claude',   dx:   60, dy: -260, color: '#d97706', logo: 'letter' },
  { name: 'Codex',    dx:  180, dy: -250, color: '#10a37f', logo: 'letter' },
  { name: 'Supabase', dx: -180, dy:  250, color: '#3ecf8e', logo: 'simpleicons', slug: 'supabase' },
  { name: 'Vercel',   dx:  -60, dy:  260, color: '#ffffff', logo: 'simpleicons', slug: 'vercel' },
  { name: 'Bolt',     dx:   60, dy:  260, color: '#eab308', logo: 'letter' },
  { name: 'Replit',   dx:  180, dy:  250, color: '#f26207', logo: 'simpleicons', slug: 'replit' },
];

const AI_TOOLS: Tool[] = [
  { name: 'n8n',    dx:    0, dy: -260, color: '#EA4B71', logo: 'simpleicons', slug: 'n8n' },
  { name: 'Make',   dx:  -80, dy:  260, color: '#6D00CC', logo: 'simpleicons', slug: 'make' },
  { name: 'Zapier', dx:   80, dy:  260, color: '#FF4A00', logo: 'simpleicons', slug: 'zapier' },
];

type Service = {
  key: string;
  title: string;
  tag: string;
  blurb: string;
  deliverables: string[];
};

export function ServicesShowcase({ services }: { services: Service[] }) {
  return (
    <div className="relative">
      {/* Animated section background — 3 slow-drifting orbs. Pointer-events: none so hover still works. */}
      <AnimatedBackground />

      <div className="relative grid md:grid-cols-2 gap-5">
        {services.map((s, i) => (
          <ServiceCard
            key={s.key}
            service={s}
            index={i}
            tools={i === 0 ? WEB_TOOLS : AI_TOOLS}
          />
        ))}
      </div>
    </div>
  );
}

function AnimatedBackground() {
  const reduce = useReducedMotion();
  const orbs = [
    { size: 520, top: '-15%', left: '5%', color: 'rgb(124 92 255 / 0.14)', dur: 22 },
    { size: 420, top: '20%', left: '55%', color: 'rgb(63 185 132 / 0.10)', dur: 30 },
    { size: 360, top: '60%', left: '20%', color: 'rgb(236 72 153 / 0.09)', dur: 26 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute -inset-x-6 -inset-y-16 -z-10 overflow-hidden">
      {orbs.map((o, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={reduce ? undefined : { x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute rounded-full blur-3xl"
          style={{
            width: o.size,
            height: o.size,
            top: o.top,
            left: o.left,
            background: o.color,
          }}
        />
      ))}
      {/* Faint grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgb(var(--text)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--text)) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}

function ServiceCard({ service, index, tools }: { service: Service; index: number; tools: Tool[] }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial="rest"
      whileHover={reduce ? undefined : 'hover'}
      animate="rest"
      className="group relative rounded-2xl border border-border bg-surface p-8 hover:border-accent/40 transition-colors overflow-visible"
    >
      {/* Hover glow inside card */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-60 bg-gradient-to-br from-accent/20 to-accent/0"
      />

      {/* Tools that fan out from BEHIND the card on hover.
          The pill container sits at inset-0 with default stacking. Card content
          (rendered later in the DOM) naturally paints on top INSIDE the card,
          hiding pills at rest. When pills translate OUTSIDE the card bounds
          (overflow-visible allows this), they become visible in the gap around
          the card. */}
      <div className="pointer-events-none absolute inset-0">
        {tools.map((t, i) => (
          <ToolPill key={t.name} tool={t} delay={i * 0.035} />
        ))}
      </div>

      <div className="relative flex items-center gap-3">
        <span className="w-10 h-10 rounded-lg grid place-items-center bg-accent/10 text-accent border border-accent/20">
          {index === 0 ? <Layout size={18} strokeWidth={1.8} /> : <Cpu size={18} strokeWidth={1.8} />}
        </span>
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted font-mono">
          {service.tag}
        </span>
      </div>
      <h3 className="relative mt-5 text-2xl md:text-3xl font-semibold tracking-tight">
        {service.title}
      </h3>
      <p className="relative mt-3 text-muted leading-relaxed max-w-md">{service.blurb}</p>
      <ul className="relative mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {service.deliverables.map((d) => (
          <li key={d} className="flex items-start gap-2">
            <Check size={14} className="text-accent mt-1 shrink-0" />
            <span className="text-text/85">{d}</span>
          </li>
        ))}
      </ul>
      <div className="relative mt-7">
        <Link
          href={`/services#${service.key}`}
          className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
        >
          See packages <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}

function ToolPill({ tool, delay }: { tool: Tool; delay: number }) {
  const variants = {
    rest: { opacity: 0, x: 0, y: 0, scale: 0.4 },
    hover: { opacity: 1, x: tool.dx, y: tool.dy, scale: 1 },
  };

  return (
    <motion.div
      variants={variants}
      transition={{ type: 'spring', stiffness: 180, damping: 20, delay }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface2/90 backdrop-blur-md shadow-[0_10px_30px_-14px_rgba(0,0,0,0.5)]"
        style={{ boxShadow: `0 0 0 1px ${tool.color}22, 0 10px 30px -12px ${tool.color}55` }}
      >
        <LogoMark tool={tool} />
        <span className="text-xs font-medium tracking-tight text-text/90 whitespace-nowrap">
          {tool.name}
        </span>
      </div>
    </motion.div>
  );
}

function LogoMark({ tool }: { tool: Tool }) {
  if (tool.logo === 'simpleicons' && tool.slug) {
    // Simple Icons CDN — clean single-color SVG icons served in the brand color.
    const color = tool.color.replace('#', '');
    return (
      <img
        src={`https://cdn.simpleicons.org/${tool.slug}/${color}`}
        alt=""
        width={14}
        height={14}
        className="block"
        loading="lazy"
      />
    );
  }
  // Letter mark fallback for tools without a good Simple Icons entry.
  return (
    <span
      className="grid place-items-center w-4 h-4 rounded-sm text-[9px] font-bold text-white"
      style={{ background: tool.color }}
    >
      {tool.name[0]}
    </span>
  );
}
