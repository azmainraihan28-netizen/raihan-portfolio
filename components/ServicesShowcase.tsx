'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Cpu, Layout } from 'lucide-react';
import Link from 'next/link';

/* Tool pills sit behind the card at rest and fan out past its edge on hover.
   Motivation: the card claims a craft, the fan shows the stack that backs it
   up without spending vertical space on a logo list. Desktop pointer only --
   there is no hover on touch, so the fan is not rendered below lg. */
// Monochrome brand marks (Next.js, Vercel, OpenAI) use a mid-grey instead
// of pure white so they stay legible on the light-theme pill too.
type Tool = {
  name: string;
  dx: number;
  dy: number;
  color: string;
  slug?: string;
};

const WEB_TOOLS: Tool[] = [
  { name: 'Next.js', dx: -210, dy: -232, color: '#71717a', slug: 'nextdotjs' },
  { name: 'React', dx: -72, dy: -256, color: '#61DAFB', slug: 'react' },
  { name: 'TypeScript', dx: 74, dy: -256, color: '#3178C6', slug: 'typescript' },
  { name: 'Tailwind', dx: 212, dy: -232, color: '#38BDF8', slug: 'tailwindcss' },
  { name: 'Supabase', dx: -210, dy: 232, color: '#3ECF8E', slug: 'supabase' },
  { name: 'Vercel', dx: -72, dy: 256, color: '#71717a', slug: 'vercel' },
  { name: 'Stripe', dx: 74, dy: 256, color: '#635BFF', slug: 'stripe' },
  { name: 'Figma', dx: 212, dy: 232, color: '#F24E1E', slug: 'figma' },
];

const AI_TOOLS: Tool[] = [
  { name: 'n8n', dx: -96, dy: -246, color: '#EA4B71', slug: 'n8n' },
  { name: 'OpenAI', dx: 96, dy: -246, color: '#71717a', slug: 'openai' },
  { name: 'Claude', dx: -96, dy: 246, color: '#D97757', slug: 'anthropic' },
  { name: 'Zapier', dx: 96, dy: 246, color: '#FF4A00', slug: 'zapier' },
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
      <AccentField />
      {/* Asymmetric on purpose: the web craft carries the larger cell. */}
      <div className="relative grid lg:grid-cols-[1.12fr,0.88fr] gap-5">
        {services.map((s, i) => (
          <ServiceCard key={s.key} service={s} index={i} tools={i === 0 ? WEB_TOOLS : AI_TOOLS} />
        ))}
      </div>
    </div>
  );
}

/* Two slow blooms in the single site accent. Transform and opacity only. */
function AccentField() {
  const reduce = useReducedMotion();
  const orbs = [
    { size: 520, top: '-18%', left: '2%', opacity: 0.13, dur: 26 },
    { size: 400, top: '55%', left: '62%', opacity: 0.09, dur: 34 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute -inset-x-8 -inset-y-20 -z-10 overflow-hidden">
      {orbs.map((o, i) => (
        <motion.span
          key={i}
          animate={reduce ? undefined : { x: [0, 36, -18, 0], y: [0, -26, 18, 0], scale: [1, 1.07, 0.97, 1] }}
          transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute rounded-full blur-3xl bg-accent"
          style={{ width: o.size, height: o.size, top: o.top, left: o.left, opacity: o.opacity }}
        />
      ))}
    </div>
  );
}

function ServiceCard({ service, index, tools }: { service: Service; index: number; tools: Tool[] }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover={reduce ? undefined : 'hover'}
      className="group relative rounded-card border border-border bg-surface p-8 md:p-10 hover:border-accent/40 transition-colors overflow-visible edge-lit"
    >
      {/* Fan sits at inset-0; card content paints over it, so pills are only
          visible once they clear the card boundary. */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {tools.map((t, i) => (
          <ToolPill key={t.name} tool={t} delay={i * 0.035} />
        ))}
      </div>

      <div className="relative flex items-center gap-3">
        <span className="w-10 h-10 rounded-pill grid place-items-center bg-accent/10 text-accent border border-accent/25">
          {index === 0 ? <Layout size={18} strokeWidth={1.8} /> : <Cpu size={18} strokeWidth={1.8} />}
        </span>
        <span className="text-[11px] uppercase tracking-[0.2em] text-muted font-mono">{service.tag}</span>
      </div>

      <h3 className="relative mt-7 font-display text-3xl md:text-[2.4rem] font-semibold tracking-[-0.03em] leading-[1.05]">
        {service.title}
      </h3>
      <p className="relative mt-4 text-muted leading-relaxed max-w-[46ch]">{service.blurb}</p>

      <ul className="relative mt-8 grid sm:grid-cols-2 gap-x-5 gap-y-2.5 text-sm">
        {service.deliverables.map((d) => (
          <li key={d} className="flex items-start gap-2.5">
            <Check size={14} className="text-accent mt-[3px] shrink-0" strokeWidth={2.2} />
            <span className="text-text/85">{d}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-9">
        <Link
          href={`/services#${service.key}`}
          className="inline-flex items-center gap-1.5 text-sm text-accent hover:gap-2.5 transition-all"
        >
          See packages <ArrowRight size={14} strokeWidth={2} />
        </Link>
      </div>
    </motion.div>
  );
}

function ToolPill({ tool, delay }: { tool: Tool; delay: number }) {
  return (
    <motion.div
      variants={{
        rest: { opacity: 0, x: 0, y: 0, scale: 0.4 },
        hover: { opacity: 1, x: tool.dx, y: tool.dy, scale: 1 },
      }}
      transition={{ type: 'spring', stiffness: 190, damping: 21, delay }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-pill border border-border bg-surface2/95 backdrop-blur-md shadow-[0_12px_30px_-16px_rgba(0,0,0,0.7)]">
        {tool.slug ? (
          <img
            src={`https://cdn.simpleicons.org/${tool.slug}/${tool.color.replace('#', '')}`}
            alt=""
            width={14}
            height={14}
            className="block w-3.5 h-3.5"
            loading="lazy"
          />
        ) : null}
        <span className="text-xs font-medium tracking-tight text-text/90 whitespace-nowrap">{tool.name}</span>
      </div>
    </motion.div>
  );
}
