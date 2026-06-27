import { Check, ArrowRight } from 'lucide-react';
import { Container, CTAButton, Eyebrow, SectionTitle } from '@/components/ui';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion';

export const metadata = {
  title: 'Services — n8n automation packages',
  description: 'Single workflow builds, ops bundles, or full Agency-OS. Productized n8n automation services starting at $200.',
};

const tiers = [
  {
    name: 'Single Workflow Build',
    price: '$200 – $800',
    timeline: '3–5 days',
    desc: 'Pick any one of the 30 case studies. I customize it to your stack and deploy it inside your n8n.',
    items: [
      'Choose any workflow from the catalog',
      'Configured to your APIs and credentials',
      'Deployed in your n8n (cloud or self-hosted)',
      'Loom walkthrough + 30-day support',
    ],
    cta: { label: 'Pick a workflow', href: '/work' },
  },
  {
    name: 'Ops Bundle',
    price: '$1,500 – $3,000',
    timeline: '2 weeks',
    desc: 'A vertical-specific stack of 3 automations that share data and compound — Sales Ops, Hiring, Content, Support.',
    featured: true,
    items: [
      'Three integrated workflows of your choice',
      'Shared Google Sheets / Slack / CRM glue',
      'Custom branding on emails and Slack blocks',
      '60-day support + 1 revision round',
    ],
    cta: { label: 'Discuss a bundle', href: '/contact?ref=ops-bundle' },
  },
  {
    name: 'Agency OS',
    price: '$2,000 – $4,000 + $200 – $500/mo',
    timeline: '3–4 weeks',
    desc: 'The Day 30 Capstone — a full Lead → Proposal → Onboard pipeline, customized to your agency or service business.',
    items: [
      'Day 30 "Agency-in-a-Box" workflow as the spine',
      'Custom proposals, onboarding, and follow-ups',
      'CRM sync (HubSpot / Airtable / Notion)',
      'Optional monthly retainer for tuning + new flows',
    ],
    cta: { label: 'Talk through Agency OS', href: '/contact?ref=agency-os' },
  },
];

const bundles = [
  { title: 'Full Sales Ops', flows: 'Day 9 + Day 25 + Day 27', desc: 'Cold email → Personal CRM → Call follow-up. Every conversation tracked.', price: '$1,500–$2,500' },
  { title: 'Content Intelligence', flows: 'Day 11 + Day 23 + Day 26', desc: 'SEO briefs → Research agent → Podcast fanout. End-to-end content engine.', price: '$1,000–$2,000' },
  { title: 'Hiring Stack', flows: 'Day 16 + Day 17 + Day 29', desc: 'Resume screener → Onboarding → Multi-agent customer onboarding.', price: '$1,500–$2,500' },
  { title: 'Reputation + Outreach', flows: 'Day 9 + Day 10 + Day 14', desc: 'Cold email + review aggregator + social listening. Watch and respond at scale.', price: '$1,500–$2,500' },
];

export default function ServicesPage() {
  return (
    <>
      <section>
        <Container className="pt-20 pb-12">
          <Eyebrow>Services</Eyebrow>
          <h1 className="mt-3 text-4xl md:text-6xl font-semibold tracking-tight">Three altitudes. One stack.</h1>
          <p className="mt-4 text-muted max-w-2xl text-lg">
            Productized packages built around the 30-workflow library. Same engine, different scope.
          </p>
        </Container>
      </section>

      <Container className="pb-24">
        <Stagger className="grid lg:grid-cols-3 gap-5">
          {tiers.map((t) => (
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

        {/* Bundles */}
        <div className="mt-24">
          <SectionTitle
            eyebrow="Pre-mixed bundles"
            title="Or grab a ready-made stack."
            sub="Four common bundles drawn straight from the catalog. Swap any workflow for another — total stays in the same band."
          />
          <Stagger className="grid sm:grid-cols-2 gap-5">
            {bundles.map((b) => (
              <StaggerItem key={b.title} className="rounded-xl border border-border bg-surface p-6 hover:border-accent/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium text-lg tracking-tight">{b.title}</h3>
                  <span className="font-mono text-sm text-accent">{b.price}</span>
                </div>
                <div className="mt-1 text-xs text-muted font-mono">{b.flows}</div>
                <p className="mt-3 text-sm text-muted leading-relaxed">{b.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <FadeUp className="mt-20 rounded-xl border border-border bg-surface p-8 text-center">
          <h3 className="text-2xl font-semibold tracking-tight">Don't see what you need?</h3>
          <p className="mt-2 text-muted">I also take on fully custom n8n builds. Tell me the workflow, I'll quote in 24h.</p>
          <div className="mt-5"><CTAButton href="/contact" variant="primary">Get a custom quote</CTAButton></div>
        </FadeUp>
      </Container>
    </>
  );
}
