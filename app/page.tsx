import { CTAButton, Container, Eyebrow, SectionTitle } from '@/components/ui';
import { WorkflowCard } from '@/components/WorkflowCard';
import { FadeUp, Stagger, StaggerItem, StaggerOnMount } from '@/components/motion';
import { site } from '@/content/site';
import { getAllWorkflows, getFeatured } from '@/lib/work';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  const featured = await getFeatured();
  const all = await getAllWorkflows();

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="spotlight absolute inset-0 -z-10" />
        <Container className="pt-24 pb-20 md:pt-32 md:pb-28">
          <StaggerOnMount className="max-w-4xl">
            <StaggerItem>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/70 text-xs text-muted font-mono">
                <Sparkles size={12} className="text-accent" /> 30/30 n8n automation challenge — complete
              </div>
            </StaggerItem>
            <StaggerItem>
              <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
                {site.headline.split('$300/month').map((part, i) =>
                  i === 0 ? (
                    <span key={i}>{part}</span>
                  ) : (
                    <span key={i}>
                      <span className="text-accent">$300/month</span>
                      {part}
                    </span>
                  ),
                )}
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">{site.sub}</p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTAButton href={site.ctaPrimary.href} variant="primary" size="lg">
                  {site.ctaPrimary.label} <ArrowRight size={18} />
                </CTAButton>
                <CTAButton href={site.ctaSecondary.href} variant="ghost" size="lg">
                  {site.ctaSecondary.label}
                </CTAButton>
              </div>
            </StaggerItem>
          </StaggerOnMount>
        </Container>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-surface/40">
        <Container className="py-10">
          <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {site.stats.map((s) => (
              <StaggerItem key={s.label}>
                <div className="font-mono text-3xl md:text-4xl tracking-tight text-text">{s.value}</div>
                <div className="text-xs text-muted mt-1 uppercase tracking-wider">{s.label}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Featured work */}
      <section>
        <Container className="py-24">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <Eyebrow>Featured case studies</Eyebrow>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
                Six builds that prove the model.
              </h2>
              <p className="mt-3 text-muted max-w-2xl">
                Hand-picked from the 30-day run — the most sellable, most reused, most asked-about workflows.
              </p>
            </div>
            <Link href="/work" className="text-sm text-accent hover:underline inline-flex items-center gap-1">
              See all 30 <ArrowRight size={14} />
            </Link>
          </div>
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((w) => (
              <StaggerItem key={w.slug} className="h-full">
                <WorkflowCard w={w} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Services preview */}
      <section className="border-t border-border bg-surface/30">
        <Container className="py-24">
          <SectionTitle
            eyebrow="What I build for clients"
            title="Three ways to work with me."
            sub="From a single Fiverr-style build to a full Agency-OS retainer — pick the altitude that matches your business."
          />
          <Stagger className="grid md:grid-cols-3 gap-5">
            {[
              { title: 'Single Workflow', price: '$200–$800', desc: 'Pick any one from the 30 case studies. Configured to your stack, deployed in your n8n.', },
              { title: 'Ops Bundle', price: '$1,500–$3,000', desc: 'Three workflows tailored to a vertical — Sales Ops, Hiring Stack, Content Pipeline, etc.', },
              { title: 'Agency OS', price: '$2,000–$4,000 + retainer', desc: 'Day 30 capstone customized for your agency. Lead → Proposal → Onboard, fully automated.', },
            ].map((t) => (
              <StaggerItem key={t.title} className="rounded-xl border border-border bg-surface p-6 hover:border-accent/30 transition-colors">
                <div className="text-sm text-muted">{t.title}</div>
                <div className="mt-2 font-mono text-2xl">{t.price}</div>
                <p className="mt-3 text-sm text-muted leading-relaxed">{t.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-8">
            <CTAButton href="/services" variant="ghost">Compare packages <ArrowRight size={14} /></CTAButton>
          </div>
        </Container>
      </section>

      {/* Big CTA */}
      <section>
        <Container className="py-24">
          <FadeUp className="rounded-2xl border border-border bg-gradient-to-br from-surface to-bg p-10 md:p-16 text-center">
            <Eyebrow>The Agency-in-a-Box CTA</Eyebrow>
            <h3 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
              Want the full 30-workflow bundle?
            </h3>
            <p className="mt-4 text-muted max-w-xl mx-auto">
              DM <span className="text-accent font-mono">AGENCY</span> on LinkedIn and I'll send the importable JSONs — or hire me to set it all up for your business.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <CTAButton href={site.linkedin} variant="primary" size="lg">DM on LinkedIn</CTAButton>
              <CTAButton href="/contact" variant="ghost" size="lg">Get a build quote</CTAButton>
            </div>
            <div className="mt-8 text-xs text-muted font-mono">{all.length} workflows · {all.reduce((s, w) => s + (w.nodes || 0), 0)} nodes · &lt; $0.01 per run</div>
          </FadeUp>
        </Container>
      </section>
    </>
  );
}
