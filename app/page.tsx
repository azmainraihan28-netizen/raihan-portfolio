import { CTAButton, Container, Eyebrow, SectionTitle } from '@/components/ui';
import { WorkflowCard } from '@/components/WorkflowCard';
import { FadeUp, Stagger, StaggerItem, StaggerOnMount } from '@/components/motion';
import { SignatureAnimation } from '@/components/SignatureAnimation';
import { CountUpStats } from '@/components/CountUpStats';
import { Protocol } from '@/components/Protocol';
import { TrustSignals } from '@/components/TrustSignals';
import { Testimonials } from '@/components/Testimonials';
import { site } from '@/content/site';
import { getAllWorkflows, getFeatured } from '@/lib/work';
import { ArrowRight, Sparkles, Layout, Cpu, Check } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  const featured = await getFeatured();
  const all = await getAllWorkflows();
  const featuredMix = [
    ...featured.filter((w) => w.kind === 'webdev'),
    ...featured.filter((w) => w.kind === 'automation'),
  ].slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative grain overflow-hidden">
        <div className="spotlight absolute inset-0 -z-10" />
        <SignatureAnimation />
        <Container className="relative pt-24 pb-20 md:pt-32 md:pb-28 z-10">
          <StaggerOnMount className="max-w-4xl">
            <StaggerItem>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/70 backdrop-blur text-xs text-muted font-mono">
                <Sparkles size={12} className="text-accent" /> Studio · Web development &amp; AI automation
              </div>
            </StaggerItem>
            <StaggerItem>
              <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
                We design{' '}
                <span className="font-serif italic font-normal text-accent">websites</span>,
                ship <span className="font-serif italic font-normal text-accent">apps</span>,
                and automate the busywork
                <span className="text-muted"> — </span>
                so your business moves at the speed of an idea.
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

      {/* Stats with animated count-ups */}
      <section className="border-y border-border bg-surface/40">
        <Container className="py-10">
          <CountUpStats stats={site.stats} />
        </Container>
      </section>

      {/* Services — Two pillars */}
      <section>
        <Container className="py-24">
          <SectionTitle
            eyebrow="What we do"
            title="Two crafts. One studio."
            sub="Ship a site or app, automate the ops behind it, or wire the two together. Same team, same senior bar, one continuous scope."
          />
          <Stagger className="grid md:grid-cols-2 gap-5">
            {site.services.map((s, i) => (
              <StaggerItem
                key={s.key}
                className="group relative rounded-2xl border border-border bg-surface p-8 hover:border-accent/40 transition-colors overflow-hidden"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-60 bg-gradient-to-br from-accent/20 to-accent/0"
                />
                <div className="relative flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg grid place-items-center bg-accent/10 text-accent border border-accent/20">
                    {i === 0 ? <Layout size={18} strokeWidth={1.8} /> : <Cpu size={18} strokeWidth={1.8} />}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-muted font-mono">
                    {s.tag}
                  </span>
                </div>
                <h3 className="relative mt-5 text-2xl md:text-3xl font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="relative mt-3 text-muted leading-relaxed max-w-md">{s.blurb}</p>
                <ul className="relative mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2">
                      <Check size={14} className="text-accent mt-1 shrink-0" />
                      <span className="text-text/85">{d}</span>
                    </li>
                  ))}
                </ul>
                <div className="relative mt-7">
                  <Link
                    href={`/services#${s.key}`}
                    className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                  >
                    See packages <ArrowRight size={14} />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Protocol — sticky 3-step build process */}
      <Protocol />

      {/* Featured work */}
      <section>
        <Container className="py-24">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <Eyebrow>Selected work</Eyebrow>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
                Websites, apps, and automations we're proud of.
              </h2>
              <p className="mt-3 text-muted max-w-2xl">
                A cross-section — e-commerce, SaaS, mobile, ops dashboards, and the automations that keep them running.
              </p>
            </div>
            <Link href="/work" className="text-sm text-accent hover:underline inline-flex items-center gap-1">
              See all {all.length} projects <ArrowRight size={14} />
            </Link>
          </div>
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredMix.map((w) => (
              <StaggerItem key={w.slug} className="h-full">
                <WorkflowCard w={w} />
              </StaggerItem>
            ))}
          </Stagger>

          {/* Trust signals */}
          <div className="mt-16">
            <TrustSignals />
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border bg-surface/30">
        <Container className="py-24">
          <SectionTitle
            eyebrow="What clients say"
            title="Real teams. Shipped work. Kind words."
            sub="A few notes from founders and ops leads we've built with."
          />
          <Testimonials />
        </Container>
      </section>

      {/* Big CTA */}
      <section>
        <Container className="py-24">
          <FadeUp className="rounded-2xl border border-border bg-gradient-to-br from-surface to-bg p-10 md:p-16 text-center">
            <Eyebrow>Ready to build?</Eyebrow>
            <h3 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
              Your next site, app, or automation
              <br className="hidden md:block" />
              starts with a 30-minute call.
            </h3>
            <p className="mt-4 text-muted max-w-xl mx-auto">
              Tell us the outcome you're after. We'll come back with a fixed-price scope in under 24 hours.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <CTAButton href="/contact" variant="primary" size="lg">Start a project</CTAButton>
              <CTAButton href={site.linkedin} variant="ghost" size="lg">DM on LinkedIn</CTAButton>
            </div>
            <div className="mt-8 text-xs text-muted font-mono">
              {all.length} projects shipped · 8+ industries · fixed-price scopes
            </div>
          </FadeUp>
        </Container>
      </section>
    </>
  );
}
