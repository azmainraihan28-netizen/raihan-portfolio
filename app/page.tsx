import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container, CTAButton, SectionTitle } from '@/components/ui';
import { HeroHome } from '@/components/HeroHome';
import { ClientWall } from '@/components/ClientWall';
import { ServicesShowcase } from '@/components/ServicesShowcase';
import { Protocol } from '@/components/Protocol';
import { WorkflowCard } from '@/components/WorkflowCard';
import { CountUpStats } from '@/components/CountUpStats';
import { Testimonials } from '@/components/Testimonials';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion';
import { site } from '@/content/site';
import { getAllWorkflows, getFeatured } from '@/lib/work';

export default async function HomePage() {
  const featured = await getFeatured();
  const all = await getAllWorkflows();

  // Exactly five cells in the bento below, so exactly five items here.
  const web = featured.filter((w) => w.kind === 'webdev').slice(0, 3);
  const auto = featured.filter((w) => w.kind === 'automation').slice(0, 2);
  const [lead, ...rest] = [...web, ...auto];

  return (
    <>
      {/* 1. Hero */}
      <HeroHome />

      {/* 2. Clients */}
      <ClientWall />

      {/* 3. Services */}
      <section>
        <Container className="pt-24 md:pt-32 pb-28 md:pb-36">
          <SectionTitle
            title="Two crafts. One studio."
            sub="Ship a site or app, automate the ops behind it, or wire the two together. Same team, same senior bar, one continuous scope."
          />
          <ServicesShowcase services={site.services} />
        </Container>
      </section>

      {/* 4. Protocol */}
      <Protocol />

      {/* 5. Selected work */}
      <section>
        <Container className="py-24 md:py-32">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
            <h2 className="font-display text-[2rem] md:text-[2.9rem] font-semibold tracking-[-0.035em] leading-[1.05] max-w-2xl">
              Websites, apps, and automations we are proud of.
            </h2>
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 text-sm text-accent shrink-0"
            >
              See our work
              <ArrowRight size={15} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Five items, five cells. Lead project takes a two-column plate. */}
          <Stagger className="grid gap-5 lg:grid-cols-3">
            {lead && (
              <StaggerItem className="lg:col-span-2">
                <WorkflowCard w={lead} variant="wide" />
              </StaggerItem>
            )}
            {rest.map((w) => (
              <StaggerItem key={w.slug} className="h-full">
                <WorkflowCard w={w} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* 6. Numbers */}
      <section className="border-y border-border bg-surface/40">
        <Container className="py-20 md:py-24">
          <CountUpStats stats={site.stats} />
        </Container>
      </section>

      {/* 7. Testimonials */}
      <section>
        <Container className="py-24 md:py-32">
          <SectionTitle
            eyebrow="What clients say"
            title="Real teams. Shipped work."
            sub="A few notes from the founders and ops leads we have built with."
          />
          <Testimonials />
        </Container>
      </section>

      {/* 8. Closing */}
      <section className="relative overflow-hidden border-t border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-56 left-1/2 -translate-x-1/2 w-[46rem] h-[46rem] rounded-full blur-[130px] bg-accent/[0.14] animate-drift"
        />
        <Container className="relative py-28 md:py-40">
          <FadeUp className="max-w-4xl">
            <h2 className="font-display font-semibold tracking-[-0.04em] leading-[1.02] text-[clamp(2.4rem,6vw,4.2rem)]">
              Your next site, app, or automation
              <span className="block text-muted">starts with a 30-minute call.</span>
            </h2>
            <p className="mt-7 text-muted text-lg leading-relaxed max-w-[52ch]">
              Tell us the outcome you are after. We scope it on the call and quote you within 24 hours.
            </p>
            <div className="mt-11 flex flex-wrap gap-3">
              <CTAButton href="/contact" variant="primary" size="lg">
                Start a project <ArrowRight size={17} strokeWidth={2} />
              </CTAButton>
              <CTAButton href={site.linkedin} variant="ghost" size="lg" external>
                Message on LinkedIn
              </CTAButton>
            </div>
          </FadeUp>
        </Container>
      </section>
    </>
  );
}
