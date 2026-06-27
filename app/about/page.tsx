import { Container, Eyebrow, ToolChip, WeekBadge } from '@/components/ui';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion';
import { site } from '@/content/site';
import { getAllWorkflows } from '@/lib/work';
import Link from 'next/link';

export const metadata = { title: 'About', description: site.headline };

export default async function AboutPage() {
  const all = await getAllWorkflows();
  const byWeek = [1, 2, 3, 4].map((w) => ({ week: w, items: all.filter((x) => x.week === w) }));

  return (
    <>
      <section>
        <Container className="pt-20 pb-10">
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-3 text-4xl md:text-6xl font-semibold tracking-tight">
            I ship the workflow, not just the slide deck.
          </h1>
          <p className="mt-5 text-lg text-muted max-w-2xl leading-relaxed">
            I'm {site.name} — an AI automation engineer focused on n8n. I just finished a 30-day public build challenge where I shipped one production-ready workflow per day, with full pain-point teardowns and pricing for each.
          </p>
          <p className="mt-3 text-muted max-w-2xl leading-relaxed">
            The goal: prove that small teams don't need $300/month SaaS subscriptions. Most of those tools wrap the same OpenAI calls you can run yourself for under a cent. n8n is the glue that makes it real.
          </p>
        </Container>
      </section>

      {/* Tools */}
      <section className="border-y border-border bg-surface/40">
        <Container className="py-12">
          <Eyebrow>Tools I work with</Eyebrow>
          <Stagger className="mt-5 flex flex-wrap gap-2">
            {site.tools.map((t) => (
              <StaggerItem key={t} className="inline-block"><ToolChip>{t}</ToolChip></StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* 30-day timeline */}
      <section>
        <Container className="py-20">
          <Eyebrow>The 30-day run</Eyebrow>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">Every workflow, week by week.</h2>
          <p className="mt-3 text-muted max-w-2xl">Click any to read the full case study.</p>

          <div className="mt-10 space-y-12">
            {byWeek.map((row) => (
              <FadeUp key={row.week}>
                <div className="flex items-center gap-3 mb-4">
                  <WeekBadge week={row.week} />
                  <h3 className="font-medium tracking-tight">
                    Week {row.week} —{' '}
                    {row.week === 1 ? 'Foundations'
                      : row.week === 2 ? 'Marketing & Sales'
                      : row.week === 3 ? 'Internal Ops'
                      : 'Advanced & Agentic'}
                  </h3>
                  <span className="text-xs text-muted font-mono">{row.items.length} builds</span>
                </div>
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {row.items.map((w) => (
                    <li key={w.slug}>
                      <Link href={`/work/${w.slug}`} className="block rounded-md border border-border bg-surface px-3 py-2 text-sm hover:bg-surface2 transition-colors">
                        <span className="font-mono text-muted">D{String(w.day).padStart(2, '0')}</span> · {w.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FadeUp>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
