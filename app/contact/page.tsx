import { Container, Eyebrow } from '@/components/ui';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion';
import { site } from '@/content/site';
import { Linkedin, Mail } from 'lucide-react';
import { ContactForm } from './ContactForm';

export const metadata = {
  title: 'Contact',
  description: 'Hire Raihan to build your n8n automation. Quotes in under 24 hours.',
};

export default function ContactPage({ searchParams }: { searchParams: { ref?: string } }) {
  const ref = searchParams?.ref;
  return (
    <>
      <section>
        <Container className="pt-20 pb-12">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-3 text-4xl md:text-6xl font-semibold tracking-tight">Let's build something.</h1>
          <p className="mt-4 text-muted max-w-2xl text-lg">
            Quotes in under 24h. Most builds ship in 3–7 days.
            {ref && <span className="block mt-2 text-sm font-mono text-accent">Coming in from: {ref}</span>}
          </p>
        </Container>
      </section>

      <Container className="pb-24 grid lg:grid-cols-5 gap-8">
        <FadeUp className="lg:col-span-3">
          <ContactForm ref_={ref} />
        </FadeUp>
        <Stagger className="lg:col-span-2 space-y-4">
          <StaggerItem className="rounded-xl border border-border bg-surface p-6">
            <Eyebrow>Prefer to DM?</Eyebrow>
            <p className="mt-3 text-sm text-muted">
              Drop <span className="text-accent font-mono">AGENCY</span> in my LinkedIn DMs and I'll send the full 30-workflow bundle plus a quick intro.
            </p>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-white text-sm hover:bg-accent-hover"
            >
              <Linkedin size={14} /> Message on LinkedIn
            </a>
          </StaggerItem>

          <StaggerItem className="rounded-xl border border-border bg-surface p-6">
            <Eyebrow>Or email</Eyebrow>
            <a href={`mailto:${site.email}`} className="mt-3 flex items-center gap-2 text-sm hover:text-accent">
              <Mail size={14} /> {site.email}
            </a>
            <p className="mt-3 text-xs text-muted">{site.location}</p>
          </StaggerItem>

          <StaggerItem className="rounded-xl border border-border bg-gradient-to-br from-accent/10 to-transparent p-6">
            <div className="text-sm">
              <strong className="text-white">Tip:</strong>{' '}
              <span className="text-muted">If you already know which of the 30 workflows you want, paste the day number in the message field. Faster quote.</span>
            </div>
          </StaggerItem>
        </Stagger>
      </Container>
    </>
  );
}
