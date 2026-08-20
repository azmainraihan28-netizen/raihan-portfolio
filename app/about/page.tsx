import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Container, CTAButton, Eyebrow, ToolChip } from '@/components/ui';
import { CountUpStats } from '@/components/CountUpStats';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion';
import { site } from '@/content/site';
import { getAllWorkflows } from '@/lib/work';

export const metadata = { title: 'About', description: site.headline };

const stackGroups = [
  { name: 'Web', tools: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vercel'] },
  { name: 'AI', tools: ['n8n', 'OpenAI', 'Anthropic', 'Gemini', 'Whisper'] },
  {
    name: 'Integrations',
    tools: ['Stripe', 'Shopify', 'Slack', 'Notion', 'Gmail', 'Google Sheets', 'Twilio', 'WordPress'],
  },
];

const principles = [
  {
    t: 'Custom scopes on a call.',
    d: 'Every engagement is scoped and quoted to what you actually need. No templated tiers, no surprise line items.',
  },
  {
    t: 'Design in the browser.',
    d: 'Figma is a starting point. We iterate on the real thing, running and deployed, from week one.',
  },
  {
    t: 'Loom over meetings.',
    d: 'Two async demos beat one live standup. Meetings are for decisions, not status.',
  },
  {
    t: 'Ship in weeks, not quarters.',
    d: 'If a project cannot launch in a month, we split it. Momentum compounds. Long timelines rot.',
  },
  {
    t: 'Own the outcome.',
    d: 'We measure success by what your users do: sign up, click, convert, save time. Not by pixels.',
  },
  {
    t: 'One team, whole scope.',
    d: 'The same people design, build, and support. No handoff to a team that has never seen the code.',
  },
];

export default async function AboutPage() {
  const all = await getAllWorkflows();
  const webCount = all.filter((w) => w.kind === 'webdev').length;
  const autoCount = all.filter((w) => w.kind === 'automation').length;

  const stats = [
    { value: `${webCount}+`, label: 'Sites and apps shipped', note: 'Storefronts, dashboards, SaaS products, mobile.' },
    { value: `${autoCount}+`, label: 'AI automations shipped', note: 'Production n8n workflows on client stacks.' },
    { value: '2-4 wks', label: 'Typical delivery', note: 'Signed scope to a live, launched build.' },
    { value: '92%', label: 'Client retention', note: 'Most engagements turn into a second scope.' },
  ];

  return (
    <>
      {/* 1. Studio */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="absolute inset-0 tech-grid" />
        <Container className="relative pt-20 md:pt-28 pb-20 md:pb-24">
          <div className="grid lg:grid-cols-[1.35fr,0.65fr] gap-14 lg:gap-16 items-center">
            <div>
              <Eyebrow className="mb-6">About the studio</Eyebrow>
              <h1 className="font-display font-semibold tracking-[-0.04em] leading-[1.02] text-[clamp(2.4rem,5.6vw,4rem)]">
                We ship the thing. Not the deck.
              </h1>
              <p className="mt-8 text-lg text-muted max-w-[58ch] leading-relaxed">
                {site.name} is a boutique studio built around two crafts: modern web development
                and production-grade AI automation. We work with founders and small teams who need
                both, a site or app that converts and the automations behind it that keep the
                business running.
              </p>
              <p className="mt-4 text-muted max-w-[58ch] leading-relaxed">
                No agencies-of-agencies. No project managers who do not code. Every engagement is
                run by the people who design and build it, which is how the work stays sharp and
                the timelines stay honest.
              </p>
            </div>

            <FadeUp className="relative mx-auto lg:mx-0 w-full max-w-[19rem]">
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-8 rounded-full bg-accent/15 blur-3xl"
              />
              <div className="relative aspect-square rounded-card overflow-hidden border border-border bg-surface">
                <Image
                  src="/founder.png"
                  alt="Azmain Raihan, founder of Vertex Studio"
                  fill
                  sizes="(max-width: 1024px) 70vw, 19rem"
                  className="object-cover"
                />
              </div>
              <div className="mt-5">
                <div className="text-sm font-medium">Azmain Raihan</div>
                <div className="text-xs text-muted mt-0.5">Founder, {site.name}</div>
              </div>
            </FadeUp>
          </div>
        </Container>
      </section>

      {/* 2. Numbers */}
      <section className="border-b border-border bg-surface/40">
        <Container className="py-20 md:py-24">
          <CountUpStats stats={stats} />
        </Container>
      </section>

      {/* 3. Stack, grouped rather than dumped as one long pill cloud */}
      <section>
        <Container className="py-24 md:py-32">
          <h2 className="font-display text-[1.9rem] md:text-[2.7rem] font-semibold tracking-[-0.035em] leading-[1.06] max-w-2xl">
            Modern, boring, reliable.
          </h2>
          <p className="mt-5 text-muted max-w-[62ch] leading-relaxed">
            We stay in one lane on purpose. A modern TypeScript stack for the web, n8n plus the
            OpenAI, Anthropic, and Gemini families for automation. Fewer tools, deeper mastery,
            faster ship.
          </p>

          <Stagger className="mt-14 grid md:grid-cols-3 gap-x-10 gap-y-10">
            {stackGroups.map((g) => (
              <StaggerItem key={g.name} className="border-t border-border pt-6">
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                  {g.name}
                </div>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {g.tools.map((t) => (
                    <ToolChip key={t}>{t}</ToolChip>
                  ))}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* 4. Principles, on hairlines rather than in six identical boxes */}
      <section className="border-y border-border bg-surface/40">
        <Container className="py-24 md:py-32">
          <Eyebrow className="mb-6">How we work</Eyebrow>
          <h2 className="font-display text-[1.9rem] md:text-[2.7rem] font-semibold tracking-[-0.035em] leading-[1.06] max-w-2xl">
            Six things we are stubborn about.
          </h2>
          <Stagger className="mt-14 grid md:grid-cols-2 gap-x-12">
            {principles.map((p, i) => (
              <StaggerItem key={p.t} className="border-t border-border py-7 flex gap-5">
                <span className="font-mono text-xs text-accent pt-1 shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-medium tracking-tight">{p.t}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed max-w-[46ch]">{p.d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* 5. Closing */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-56 left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] rounded-full blur-[130px] bg-accent/[0.13] animate-drift"
        />
        <Container className="relative py-24 md:py-36">
          <FadeUp className="max-w-3xl">
            <h2 className="font-display font-semibold tracking-[-0.04em] leading-[1.04] text-[clamp(2rem,4.8vw,3.4rem)]">
              Have a project in mind?
            </h2>
            <p className="mt-6 text-muted text-lg leading-relaxed max-w-[48ch]">
              Scope and quote in 24 hours. Launch in 2 to 4 weeks.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <CTAButton href="/contact" variant="primary" size="lg">
                Start a project <ArrowRight size={17} strokeWidth={2} />
              </CTAButton>
              <CTAButton href="/work" variant="ghost" size="lg">
                See our work
              </CTAButton>
            </div>
          </FadeUp>
        </Container>
      </section>
    </>
  );
}
