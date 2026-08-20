import { ArrowRight, Check, Cpu, Layout } from 'lucide-react';
import { Container, CTAButton, Eyebrow, SectionTitle } from '@/components/ui';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion';

export const metadata = {
  title: 'Services · Web Development & AI Automation',
  description:
    'Marketing sites, apps, SaaS builds, and AI automation on n8n. Custom-scoped engagements, quoted on a call. Vertex Studio.',
};

type Tier = {
  name: string;
  timeline: string;
  desc: string;
  featured?: boolean;
  items: string[];
  cta: { label: string; href: string };
};

const webTiers: Tier[] = [
  {
    name: 'Marketing Site',
    timeline: '1 - 2 weeks',
    desc: 'A conversion-tuned marketing or brand site. Editorial layout, motion, CMS-ready.',
    items: [
      'Up to 6 sections / pages',
      'Figma design into a Next.js build',
      'Blog / MDX content system',
      'On-page SEO and analytics',
    ],
    cta: { label: 'Book a call', href: '/contact?ref=marketing-site' },
  },
  {
    name: 'Web App / Dashboard',
    timeline: '3 - 5 weeks',
    desc: 'Internal tools, admin panels, and ops dashboards on Next.js plus Supabase, with auth and roles.',
    featured: true,
    items: [
      'Auth, RBAC, and multi-tenant models',
      'Supabase and Postgres data layer',
      'Real-time widgets and charts',
      'Deployed to Vercel with a Loom walkthrough',
    ],
    cta: { label: 'Book a call', href: '/contact?ref=webapp' },
  },
  {
    name: 'SaaS / App MVP',
    timeline: '4 - 8 weeks',
    desc: 'End-to-end SaaS product or React Native app, covering billing, onboarding, and the core loop.',
    items: [
      'Full product surface, 10 to 25 screens',
      'Stripe billing, auth, and transactional email',
      'Design system and component library',
      'Post-launch retainer available',
    ],
    cta: { label: 'Book a call', href: '/contact?ref=saas-mvp' },
  },
];

const aiTiers: Tier[] = [
  {
    name: 'Single Workflow',
    timeline: '3 - 5 days',
    desc: 'One tightly-scoped n8n workflow: cold email, invoice extraction, review aggregation.',
    items: [
      'One workflow, deployed to your n8n',
      'Configured against your APIs',
      'Cost-per-run measured and published',
      '30-day support included',
    ],
    cta: { label: 'See our work', href: '/work?filter=automation' },
  },
  {
    name: 'Ops Bundle',
    timeline: '2 - 3 weeks',
    desc: 'Three integrated workflows for one vertical: Sales Ops, Hiring Stack, Content Pipeline, or Support.',
    featured: true,
    items: [
      'Three linked workflows on shared data',
      'Slack, Sheets, and CRM glue built in',
      'Custom branding on all outputs',
      '60-day support with one revision round',
    ],
    cta: { label: 'Book a call', href: '/contact?ref=ops-bundle' },
  },
  {
    name: 'Agents & Integrations',
    timeline: '3 - 5 weeks',
    desc: 'Autonomous agents, multi-tool orchestration, and deep API integrations across your stack.',
    items: [
      'Multi-agent workflow with tool use',
      'Deep integrations across CRM, ERP, custom APIs',
      'Guardrails, logging, and cost caps',
      'Optional monthly retainer',
    ],
    cta: { label: 'Book a call', href: '/contact?ref=agents' },
  },
];

const bundles = [
  {
    title: 'Launch Bundle',
    detail: 'Marketing site plus lead-scoring automation',
    desc: 'For founders who need both a story and a sales pipeline the day they go live.',
  },
  {
    title: 'Ops Bundle',
    detail: 'Internal dashboard plus two n8n workflows',
    desc: 'Give leadership a live view. Automate the two spreadsheets that eat everyone’s week.',
  },
  {
    title: 'Product Bundle',
    detail: 'SaaS MVP plus an AI feature plus billing',
    desc: 'From concept to first paying customer. Product, AI feature, and Stripe on day one.',
  },
  {
    title: 'Full Studio',
    detail: 'Site plus app plus an automation retainer',
    desc: 'A design partner, an engineering team, and an ops brain on tap for the quarter.',
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* 1. Page head */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="absolute inset-0 tech-grid" />
        <Container className="relative pt-20 md:pt-28 pb-20 md:pb-24">
          <Eyebrow className="mb-6">Services</Eyebrow>
          <h1 className="font-display font-semibold tracking-[-0.04em] leading-[1.02] text-[clamp(2.4rem,5.6vw,4rem)] max-w-3xl">
            Two crafts. One studio.
          </h1>
          <p className="mt-7 text-muted max-w-[56ch] text-lg leading-relaxed">
            Custom-scoped engagements across web development and AI automation. Every project is
            quoted on a call, tuned to what you actually need.
          </p>
        </Container>
      </section>

      {/* 2. Web tiers: one lead panel, two stacked. Not three identical cards. */}
      <section id="web" className="scroll-mt-28">
        <Container className="py-24 md:py-32">
          <CraftHead
            icon={<Layout size={17} strokeWidth={1.8} />}
            title="Sites, apps, and SaaS products."
            sub="Modern stack: Next.js, React, Tailwind, Supabase, Vercel. Editorial design, production-grade engineering."
          />
          <Stagger className="grid lg:grid-cols-[1.25fr,1fr] gap-5 items-start">
            <StaggerItem className="h-full">
              <LeadTier tier={webTiers[1]} />
            </StaggerItem>
            <div className="grid gap-5">
              {[webTiers[0], webTiers[2]].map((t) => (
                <StaggerItem key={t.name}>
                  <CompactTier tier={t} />
                </StaggerItem>
              ))}
            </div>
          </Stagger>
        </Container>
      </section>

      {/* 3. AI tiers: full-width rows, a different layout family from above. */}
      <section id="ai" className="scroll-mt-28 border-y border-border bg-surface/40">
        <Container className="py-24 md:py-32">
          <CraftHead
            icon={<Cpu size={17} strokeWidth={1.8} />}
            title="n8n workflows, agents, integrations."
            sub="We replace subscription SaaS tools with workflows that cost a fraction of a cent per run, and build agents that stay on task."
          />
          <Stagger className="border-t border-border">
            {aiTiers.map((t) => (
              <StaggerItem key={t.name}>
                <TierRow tier={t} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* 4. Bundles: an index of combined engagements, not another card wall. */}
      <section>
        <Container className="py-24 md:py-32">
          <SectionTitle
            title="Or combine both sides."
            sub="Web and automation scoped as one engagement. Cleaner handoffs, faster to launch."
          />
          <Stagger className="border-t border-border">
            {bundles.map((b) => (
              <StaggerItem
                key={b.title}
                className="group grid md:grid-cols-[1fr,1.5fr] gap-x-8 gap-y-2 items-baseline py-7 border-b border-border hover:bg-surface/60 transition-colors px-2 -mx-2"
              >
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-semibold tracking-[-0.025em]">
                    {b.title}
                  </h3>
                  <div className="mt-1.5 text-xs text-muted font-mono">{b.detail}</div>
                </div>
                <p className="text-sm text-muted leading-relaxed max-w-[52ch]">{b.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* 5. Closing */}
      <section className="relative overflow-hidden border-t border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-56 left-1/2 -translate-x-1/2 w-[46rem] h-[46rem] rounded-full blur-[130px] bg-accent/[0.13] animate-drift"
        />
        <Container className="relative py-24 md:py-36">
          <FadeUp className="max-w-3xl">
            <h2 className="font-display font-semibold tracking-[-0.04em] leading-[1.04] text-[clamp(2rem,4.8vw,3.4rem)]">
              Something more custom?
            </h2>
            <p className="mt-6 text-muted text-lg leading-relaxed max-w-[52ch]">
              We take fully custom scopes across both crafts. Tell us the outcome, and we quote it
              inside 24 hours.
            </p>
            <div className="mt-10">
              <CTAButton href="/contact" variant="primary" size="lg">
                Start a project <ArrowRight size={17} strokeWidth={2} />
              </CTAButton>
            </div>
          </FadeUp>
        </Container>
      </section>
    </>
  );
}

/* ---------------- pieces ---------------- */

/* No uppercase kicker here on purpose. The icon marks the craft and the
   headline names it, so a label above every section would just be a third
   templated eyebrow on one page. */
function CraftHead({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="mb-14">
      <span className="w-11 h-11 rounded-pill grid place-items-center bg-accent/10 text-accent border border-accent/25">
        {icon}
      </span>
      <h2 className="mt-7 font-display text-[1.9rem] md:text-[2.7rem] font-semibold tracking-[-0.035em] leading-[1.06] max-w-3xl">
        {title}
      </h2>
      <p className="mt-5 text-muted leading-relaxed max-w-[62ch]">{sub}</p>
    </div>
  );
}

function LeadTier({ tier }: { tier: Tier }) {
  return (
    <div className="relative h-full flex flex-col rounded-card border border-accent/40 bg-surface p-8 md:p-10 ring-1 ring-accent/15">
      <span className="self-start rounded-pill bg-accent/12 border border-accent/25 px-3 py-1 text-[10.5px] uppercase tracking-[0.18em] text-accent font-mono">
        Most popular
      </span>
      <div className="mt-7 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        {tier.name}
      </div>
      <div className="mt-3 font-display text-[2.4rem] md:text-[3rem] font-semibold tracking-[-0.045em] leading-none">
        Custom quote
      </div>
      <div className="mt-3 font-mono text-xs text-muted">{tier.timeline} · scoped on a call</div>
      <p className="mt-6 text-muted leading-relaxed max-w-[44ch]">{tier.desc}</p>
      <ul className="mt-8 space-y-3 text-sm">
        {tier.items.map((i) => (
          <li key={i} className="flex items-start gap-2.5">
            <Check size={14} className="text-accent mt-[3px] shrink-0" strokeWidth={2.2} />
            <span className="text-text/85">{i}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-10">
        <CTAButton href={tier.cta.href} variant="primary">
          {tier.cta.label} <ArrowRight size={15} strokeWidth={2} />
        </CTAButton>
      </div>
    </div>
  );
}

function CompactTier({ tier }: { tier: Tier }) {
  return (
    <div className="rounded-card border border-border bg-surface p-7 hover:border-accent/35 transition-colors edge-lit">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h3 className="font-display text-xl font-semibold tracking-[-0.025em]">{tier.name}</h3>
        <span className="font-mono text-xs text-accent whitespace-nowrap">Custom quote</span>
      </div>
      <div className="mt-1.5 font-mono text-xs text-muted">{tier.timeline}</div>
      <p className="mt-4 text-sm text-muted leading-relaxed">{tier.desc}</p>
      <ul className="mt-5 grid sm:grid-cols-2 gap-x-5 gap-y-2 text-sm">
        {tier.items.map((i) => (
          <li key={i} className="flex items-start gap-2">
            <Check size={13} className="text-accent mt-[4px] shrink-0" strokeWidth={2.2} />
            <span className="text-text/85">{i}</span>
          </li>
        ))}
      </ul>
      <div className="mt-7">
        <CTAButton href={tier.cta.href} variant="ghost">
          {tier.cta.label}
        </CTAButton>
      </div>
    </div>
  );
}

function TierRow({ tier }: { tier: Tier }) {
  return (
    <div className="group grid lg:grid-cols-[minmax(0,1fr),minmax(0,1.5fr),auto] gap-x-10 gap-y-5 py-9 border-b border-border">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-display text-xl md:text-2xl font-semibold tracking-[-0.025em]">
            {tier.name}
          </h3>
          {tier.featured && (
            <span className="rounded-pill bg-accent/12 border border-accent/25 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-accent font-mono">
              Most popular
            </span>
          )}
        </div>
        <div className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-accent">
          Custom quote
        </div>
        <div className="mt-1 font-mono text-xs text-muted">{tier.timeline}</div>
      </div>

      <div>
        <p className="text-muted leading-relaxed max-w-[54ch]">{tier.desc}</p>
        <ul className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {tier.items.map((i) => (
            <li key={i} className="flex items-start gap-2">
              <Check size={13} className="text-accent mt-[4px] shrink-0" strokeWidth={2.2} />
              <span className="text-text/85">{i}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:self-center">
        <CTAButton href={tier.cta.href} variant={tier.featured ? 'primary' : 'ghost'}>
          {tier.cta.label}
        </CTAButton>
      </div>
    </div>
  );
}
