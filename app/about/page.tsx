import { Container, Eyebrow, ToolChip } from '@/components/ui';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion';
import { site } from '@/content/site';
import { getAllWorkflows } from '@/lib/work';
import Link from 'next/link';

export const metadata = { title: 'About', description: site.headline };

export default async function AboutPage() {
  const all = await getAllWorkflows();
  const webCount = all.filter((w) => w.kind === 'webdev').length;
  const autoCount = all.filter((w) => w.kind === 'automation').length;

  return (
    <>
      <section>
        <Container className="pt-20 pb-10">
          <Eyebrow>About the studio</Eyebrow>
          <h1 className="mt-3 text-4xl md:text-6xl font-semibold tracking-tight">
            We ship the thing. Not the deck.
          </h1>
          <p className="mt-5 text-lg text-muted max-w-2xl leading-relaxed">
            {site.name} is a boutique studio built around two crafts — modern web development and
            production-grade AI automation. We work with founders and small teams who need both:
            a site or app that converts, and the automations behind it that keep the business running.
          </p>
          <p className="mt-3 text-muted max-w-2xl leading-relaxed">
            No agencies-of-agencies. No project managers who don't code. Every engagement is run by
            the people who design and build it — that's how the work stays sharp and the timelines stay honest.
          </p>
        </Container>
      </section>

      {/* Numbers */}
      <section className="border-y border-border bg-surface/40">
        <Container className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { v: `${webCount}+`, l: 'Sites & apps shipped' },
              { v: `${autoCount}+`, l: 'AI automations shipped' },
              { v: '2 – 4 wks', l: 'Typical delivery' },
              { v: '92%', l: 'Client retention' },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-mono text-3xl md:text-4xl font-semibold tracking-tight">{s.v}</div>
                <div className="mt-1 text-xs text-muted uppercase tracking-[0.18em] font-mono">{s.l}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Tools */}
      <section>
        <Container className="py-16">
          <Eyebrow>The stack we run</Eyebrow>
          <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">Modern, boring, reliable.</h2>
          <p className="mt-3 text-muted max-w-2xl">
            We stay in one lane on purpose — a modern TypeScript stack for the web, n8n and the OpenAI/Anthropic/Gemini
            families for automation. Fewer tools, deeper mastery, faster ship.
          </p>
          <Stagger className="mt-8 flex flex-wrap gap-2">
            {site.tools.map((t) => (
              <StaggerItem key={t} className="inline-block"><ToolChip>{t}</ToolChip></StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Principles */}
      <section className="border-t border-border bg-surface/30">
        <Container className="py-20">
          <Eyebrow>How we work</Eyebrow>
          <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">Five things we're stubborn about.</h2>
          <div className="mt-10 grid md:grid-cols-2 gap-5">
            {[
              {
                t: 'Fixed-price scopes.',
                d: 'You should know the number before you sign. Estimates are how agencies stay expensive.',
              },
              {
                t: 'Design in the browser.',
                d: 'Figma is a starting point. We iterate on the real thing — running, deployed, clickable — from week one.',
              },
              {
                t: 'Loom over meetings.',
                d: 'Two async demos beat one live standup. Meetings are for decisions, not status.',
              },
              {
                t: 'Ship in weeks, not quarters.',
                d: 'If a project can\'t launch in a month, we split it. Momentum compounds. Long timelines rot.',
              },
              {
                t: 'Own the outcome.',
                d: 'We measure success by what your users do — sign up, click, convert, save time — not by pixels.',
              },
              {
                t: 'One team, whole scope.',
                d: 'The same people design, build, and support. No handoffs to a team that\'s never seen the codebase.',
              },
            ].map((p) => (
              <FadeUp key={p.t} className="rounded-xl border border-border bg-surface p-6">
                <h3 className="font-medium tracking-tight">{p.t}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{p.d}</p>
              </FadeUp>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section>
        <Container className="py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Have a project in mind?
          </h2>
          <p className="mt-3 text-muted max-w-xl mx-auto">
            Fixed-price scope in 24 hours. Launch in 2 – 4 weeks.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/contact" className="px-5 py-3 rounded-md bg-accent text-white text-sm hover:bg-accent-hover">Start a project</Link>
            <Link href="/work" className="px-5 py-3 rounded-md border border-border text-sm hover:border-accent/40">See our work</Link>
          </div>
        </Container>
      </section>
    </>
  );
}
