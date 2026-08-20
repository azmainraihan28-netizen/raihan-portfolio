import { Linkedin, Mail, MapPin } from 'lucide-react';
import { Container, Eyebrow } from '@/components/ui';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion';
import { site } from '@/content/site';
import { ContactForm } from './ContactForm';

export const metadata = {
  title: 'Contact',
  description:
    'Start a project with Vertex Studio, a web development and AI automation studio. Custom scope and quote within 24 hours of a call.',
};

export default function ContactPage({ searchParams }: { searchParams: { ref?: string } }) {
  const ref = searchParams?.ref;

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="absolute inset-0 tech-grid" />
        <Container className="relative pt-20 md:pt-28 pb-16 md:pb-20">
          <Eyebrow className="mb-6">Start a project</Eyebrow>
          <h1 className="font-display font-semibold tracking-[-0.04em] leading-[1.02] text-[clamp(2.4rem,5.6vw,4rem)]">
            Let us build something.
          </h1>
          <p className="mt-7 text-muted max-w-[56ch] text-lg leading-relaxed">
            Book a call and get a custom scope and quote within 24 hours. Most sites, apps, and
            automations ship in 2 to 4 weeks.
          </p>
          {ref && (
            <p className="mt-5 inline-flex items-center rounded-pill border border-accent/25 bg-accent/10 px-3.5 py-1.5 font-mono text-xs text-accent">
              Referencing: {ref}
            </p>
          )}
        </Container>
      </section>

      <Container className="py-16 md:py-20 pb-28 grid lg:grid-cols-5 gap-8 lg:gap-10 items-start">
        <FadeUp className="lg:col-span-3">
          <ContactForm ref_={ref} />
        </FadeUp>

        <Stagger className="lg:col-span-2 flex flex-col gap-4">
          <StaggerItem className="rounded-card border border-border bg-surface p-7">
            <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">Prefer to DM?</h2>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Drop <span className="text-accent font-mono">STUDIO</span> in our LinkedIn DMs and we
              send an intro deck plus a case-study bundle the same day.
            </p>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener"
              data-press="pill"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-pill bg-primary text-primary-on text-sm font-medium hover:bg-primary-hover transition-colors whitespace-nowrap"
            >
              <Linkedin size={15} aria-hidden /> Message on LinkedIn
            </a>
          </StaggerItem>

          <StaggerItem className="rounded-card border border-border bg-surface p-7">
            <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">Or email</h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 flex items-center gap-2.5 text-sm text-text/90 hover:text-accent break-all"
            >
              <Mail size={15} aria-hidden className="shrink-0" /> {site.email}
            </a>
            <div className="mt-3 flex items-center gap-2.5 text-sm text-muted">
              <MapPin size={15} aria-hidden className="shrink-0" /> {site.location}
            </div>
          </StaggerItem>

          <StaggerItem className="rounded-card border border-border bg-surface2/60 p-7">
            <div className="text-sm leading-relaxed">
              <strong className="text-text font-medium">One tip.</strong>{' '}
              <span className="text-muted">
                Skip the &ldquo;we are not sure what we need&rdquo;. Tell us the outcome you are
                after, whether that is more leads, an internal tool, or fewer manual hours. We shape
                the scope from there.
              </span>
            </div>
          </StaggerItem>
        </Stagger>
      </Container>
    </>
  );
}
