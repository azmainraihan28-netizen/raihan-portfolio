import { Check, ArrowRight, Layout, Cpu } from 'lucide-react';
import { Container, CTAButton, Eyebrow, SectionTitle } from '@/components/ui';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion';

export const metadata = {
  title: 'Services — Web Development & AI Automation',
  description:
    'Marketing sites, apps, SaaS builds, and AI automation on n8n. Fixed-price scopes from $800 to $15k. Zeroline Studio.',
};

const webTiers = [
  {
    name: 'Marketing Site',
    price: '$1,500 – $3,500',
    timeline: '1 – 2 weeks',
    desc: 'A conversion-tuned marketing or brand site. Editorial layout, motion, CMS-ready.',
    items: [
      'Up to 6 sections / pages',
      'Figma design → Next.js build',
      'Blog / MDX content system',
      'On-page SEO + analytics',
    ],
    cta: { label: 'Start a site', href: '/contact?ref=marketing-site' },
  },
  {
    name: 'Web App / Dashboard',
    price: '$4,000 – $8,000',
    timeline: '3 – 5 weeks',
    desc: 'Internal tools, admin panels, ops dashboards on Next.js + Supabase with auth and roles.',
    featured: true,
    items: [
      'Auth, RBAC, and multi-tenant models',
      'Supabase + Postgres data layer',
      'Real-time widgets & charts',
      'Deployed to Vercel, Loom walkthrough',
    ],
    cta: { label: 'Scope a dashboard', href: '/contact?ref=webapp' },
  },
  {
    name: 'SaaS / App MVP',
    price: '$6,000 – $15,000',
    timeline: '4 – 8 weeks',
    desc: 'End-to-end SaaS product or React Native app — billing, onboarding, and the core loop.',
    items: [
      'Full product surface (10 – 25 screens)',
      'Stripe billing + auth + emails',
      'Design system + component library',
      'Post-launch retainer available',
    ],
    cta: { label: 'Plan an MVP', href: '/contact?ref=saas-mvp' },
  },
];

const aiTiers = [
  {
    name: 'Single Workflow',
    price: '$300 – $900',
    timeline: '3 – 5 days',
    desc: 'One tightly-scoped n8n workflow — cold email, invoice extraction, review aggregation, etc.',
    items: [
      'One workflow, deployed to your n8n',
      'Configured against your APIs',
      'Cost-per-run measured and published',
      '30-day support included',
    ],
    cta: { label: 'Pick a workflow', href: '/work?filter=automation' },
  },
  {
    name: 'Ops Bundle',
    price: '$1,500 – $3,500',
    timeline: '2 – 3 weeks',
    desc: 'Three integrated workflows for a vertical — Sales Ops, Hiring Stack, Content Pipeline, Support.',
    featured: true,
    items: [
      'Three linked workflows, shared data',
      'Slack / Sheets / CRM glue built in',
      'Custom branding on all outputs',
      '60-day support · 1 revision round',
    ],
    cta: { label: 'Discuss a bundle', href: '/contact?ref=ops-bundle' },
  },
  {
    name: 'Agents & Integrations',
    price: '$3,000 – $8,000 + retainer',
    timeline: '3 – 5 weeks',
    desc: 'Autonomous agents, multi-tool orchestration, and deep API integrations across your stack.',
    items: [
      'Multi-agent workflow with tool use',
      'Deep integrations (CRM, ERP, custom APIs)',
      'Guardrails, logging, cost caps',
      'Optional monthly retainer ($200 – $800/mo)',
    ],
    cta: { label: 'Design an agent', href: '/contact?ref=agents' },
  },
];

const bundles = [
  {
    title: 'Launch Bundle',
    detail: 'Marketing site + lead-scoring automation',
    desc: 'For founders who need both a story and a sales pipeline the day they go live.',
    price: '$3,000 – $5,500',
  },
  {
    title: 'Ops Bundle',
    detail: 'Internal dashboard + 2 n8n workflows',
    desc: 'Give leadership a live view. Automate the two spreadsheets that eat everyone\'s week.',
    price: '$5,500 – $10,000',
  },
  {
    title: 'Product Bundle',
    detail: 'SaaS MVP + AI feature + billing',
    desc: 'From concept to first paying customer. Product + AI feature + Stripe on day one.',
    price: '$8,000 – $16,000',
  },
  {
    title: 'Full Studio',
    detail: 'Site + app + automation retainer',
    desc: 'When you want a design partner + engineering team + ops brain on tap for the quarter.',
    price: '$12,000+ / quarter',
  },
];

export default function ServicesPage() {
  return (
    <>
      <section>
        <Container className="pt-20 pb-12">
          <Eyebrow>Services</Eyebrow>
          <h1 className="mt-3 text-4xl md:text-6xl font-semibold tracking-tight">
            Two crafts. <span className="font-serif italic font-normal text-accent">One studio.</span>
          </h1>
          <p className="mt-4 text-muted max-w-2xl text-lg">
            Fixed-price scopes across web development and AI automation. Pick a tier, or bundle both sides into one engagement.
          </p>
        </Container>
      </section>

      {/* Web Dev */}
      <section id="web" className="scroll-mt-24">
        <Container className="pt-8 pb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-9 h-9 rounded-lg grid place-items-center bg-accent/10 text-accent border border-accent/20">
              <Layout size={16} strokeWidth={1.8} />
            </span>
            <span className="text-[11px] uppercase tracking-[0.22em] text-muted font-mono">Web Development</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Sites, apps, and SaaS products.</h2>
          <p className="mt-3 text-muted max-w-2xl">
            Modern stack — Next.js, React, Tailwind, Supabase, Vercel. Editorial design, production-grade engineering.
          </p>

          <Stagger className="mt-12 grid lg:grid-cols-3 gap-5">
            {webTiers.map((t) => (
              <StaggerItem
                key={t.name}
                className={
                  'rounded-2xl border bg-surface p-7 flex flex-col transition-colors ' +
                  (t.featured ? 'border-accent/40 ring-1 ring-accent/20' : 'border-border hover:border-accent/30')
                }
              >
                {t.featured && (
                  <div className="text-[11px] uppercase tracking-wider text-accent font-mono mb-3">Most popular</div>
                )}
                <div className="text-sm text-muted">{t.name}</div>
                <div className="mt-2 font-mono text-2xl md:text-3xl text-text">{t.price}</div>
                <div className="text-xs text-muted mt-1 font-mono">{t.timeline}</div>
                <p className="mt-4 text-sm text-muted leading-relaxed">{t.desc}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {t.items.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check size={14} className="text-accent mt-1 shrink-0" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <CTAButton href={t.cta.href} variant={t.featured ? 'primary' : 'ghost'}>
                    {t.cta.label} <ArrowRight size={14} />
                  </CTAButton>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* AI Automation */}
      <section id="ai" className="scroll-mt-24 border-t border-border bg-surface/30">
        <Container className="py-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-9 h-9 rounded-lg grid place-items-center bg-accent/10 text-accent border border-accent/20">
              <Cpu size={16} strokeWidth={1.8} />
            </span>
            <span className="text-[11px] uppercase tracking-[0.22em] text-muted font-mono">AI Automation</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">n8n workflows, agents, integrations.</h2>
          <p className="mt-3 text-muted max-w-2xl">
            We replace $300/month SaaS tools with $0.001/run workflows — and build autonomous agents that actually stay on task.
          </p>

          <Stagger className="mt-12 grid lg:grid-cols-3 gap-5">
            {aiTiers.map((t) => (
              <StaggerItem
                key={t.name}
                className={
                  'rounded-2xl border bg-surface p-7 flex flex-col transition-colors ' +
                  (t.featured ? 'border-accent/40 ring-1 ring-accent/20' : 'border-border hover:border-accent/30')
                }
              >
                {t.featured && (
                  <div className="text-[11px] uppercase tracking-wider text-accent font-mono mb-3">Most popular</div>
                )}
                <div className="text-sm text-muted">{t.name}</div>
                <div className="mt-2 font-mono text-2xl md:text-3xl text-text">{t.price}</div>
                <div className="text-xs text-muted mt-1 font-mono">{t.timeline}</div>
                <p className="mt-4 text-sm text-muted leading-relaxed">{t.desc}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {t.items.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check size={14} className="text-accent mt-1 shrink-0" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <CTAButton href={t.cta.href} variant={t.featured ? 'primary' : 'ghost'}>
                    {t.cta.label} <ArrowRight size={14} />
                  </CTAButton>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Bundles */}
      <Container className="py-20">
        <SectionTitle
          eyebrow="Bundles"
          title="Or combine both sides."
          sub="Web + automation, scoped as one engagement. Cleaner handoffs, lower total cost, faster to launch."
        />
        <Stagger className="grid sm:grid-cols-2 gap-5">
          {bundles.map((b) => (
            <StaggerItem
              key={b.title}
              className="rounded-xl border border-border bg-surface p-6 hover:border-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium text-lg tracking-tight">{b.title}</h3>
                  <div className="mt-1 text-xs text-muted font-mono">{b.detail}</div>
                </div>
                <span className="font-mono text-sm text-accent whitespace-nowrap">{b.price}</span>
              </div>
              <p className="mt-3 text-sm text-muted leading-relaxed">{b.desc}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <FadeUp className="mt-20 rounded-xl border border-border bg-surface p-8 text-center">
          <h3 className="text-2xl font-semibold tracking-tight">Something more custom?</h3>
          <p className="mt-2 text-muted">
            We take on fully custom scopes across both crafts. Tell us the outcome, we'll quote in 24 hours.
          </p>
          <div className="mt-5">
            <CTAButton href="/contact" variant="primary">Get a custom quote</CTAButton>
          </div>
        </FadeUp>
      </Container>
    </>
  );
}
