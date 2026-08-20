import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Linkedin } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Container, CTAButton, ToolChip, WeekBadge } from '@/components/ui';
import { FadeUp, StaggerItem, StaggerOnMount } from '@/components/motion';
import { site } from '@/content/site';
import { getAllWorkflows, getWorkflow } from '@/lib/work';

export async function generateStaticParams() {
  const all = await getAllWorkflows();
  return all.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const w = await getWorkflow(params.slug);
  if (!w) return {};
  const subtitle = w.kind === 'webdev' ? w.client || 'Case study' : `Day ${w.day}`;
  return {
    title: `${w.title} · ${subtitle}`,
    description: w.tagline,
    openGraph: { title: w.title, description: w.tagline, type: 'article' },
  };
}

const mdxComponents = {
  details: (p: any) => (
    <details className="mt-4 rounded-input border border-border bg-surface p-4" {...p} />
  ),
  summary: (p: any) => <summary className="cursor-pointer text-accent font-medium" {...p} />,
};

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const w = await getWorkflow(params.slug);
  if (!w) notFound();

  const all = await getAllWorkflows();
  const idx = all.findIndex((x) => x.slug === w.slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  const metrics =
    w.kind === 'automation'
      ? [
          { label: 'Cost per run', value: w.costPerRun || 'n/a' },
          { label: 'Nodes', value: w.nodes ? String(w.nodes) : 'n/a' },
          { label: 'Timeline', value: w.week ? `Week ${w.week}` : 'n/a' },
          { label: 'Track', value: w.category },
        ]
      : [
          { label: 'Client', value: w.client || 'n/a' },
          { label: 'Category', value: w.category },
          { label: 'Timeline', value: w.week ? `Week ${w.week}` : 'n/a' },
          { label: 'Outcome', value: w.heroMetric || 'n/a' },
        ];

  return (
    <>
      {/* Head */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="absolute inset-0 tech-grid" />
        <Container className="relative pt-14 md:pt-20 pb-14">
          <div className="flex items-center gap-3 text-sm flex-wrap">
            <Link href="/work" className="text-muted hover:text-text inline-flex items-center gap-1.5">
              <ArrowLeft size={14} aria-hidden /> Work
            </Link>
            <span className="text-muted/50" aria-hidden>
              /
            </span>
            <span className="font-mono text-muted">{w.category}</span>
            <WeekBadge week={w.week} />
          </div>

          <h1 className="mt-7 font-display font-semibold tracking-[-0.04em] leading-[1.04] text-[clamp(2.1rem,5vw,3.6rem)] max-w-4xl">
            {w.title}
          </h1>
          <p className="mt-6 text-lg text-muted max-w-[64ch] leading-relaxed">{w.tagline}</p>

          {/* Metrics on hairlines. Four identical boxes would be a card wall. */}
          <StaggerOnMount className="mt-12 grid grid-cols-2 lg:grid-cols-4 border-t border-border">
            {metrics.map((m) => (
              <StaggerItem
                key={m.label}
                className="border-b border-border py-6 pr-6 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:pl-7 lg:first:pl-0"
              >
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted font-mono">
                  {m.label}
                </div>
                <div className="mt-2.5 font-mono text-lg text-text">{m.value}</div>
              </StaggerItem>
            ))}
          </StaggerOnMount>

          {w.tools.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted mr-1.5">Built with</span>
              {w.tools.map((t) => (
                <ToolChip key={t}>{t}</ToolChip>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <CTAButton href={`/contact?ref=${w.slug}`} variant="primary">
              Start a project <ArrowRight size={15} strokeWidth={2} />
            </CTAButton>
            <CTAButton href={site.linkedin} variant="ghost" external>
              <Linkedin size={15} aria-hidden /> Message on LinkedIn
            </CTAButton>
          </div>
        </Container>
      </section>

      {/* Screenshot */}
      {w.screenshot && (
        <Container className="pt-14">
          <FadeUp className="relative rounded-card border border-border bg-surface overflow-hidden shadow-[0_40px_90px_-50px_rgba(0,0,0,0.8)]">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent z-10"
            />
            <Image
              src={w.screenshot}
              alt={`${w.title} case study preview`}
              width={w.screenshotW}
              height={w.screenshotH}
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="block w-full h-auto"
            />
          </FadeUp>
        </Container>
      )}

      {/* Body */}
      <Container className="py-16 md:py-20">
        <article className="prose-custom max-w-prose">
          <MDXRemote source={w.body} components={mdxComponents as any} />
        </article>

        {/* Closing */}
        <FadeUp className="mt-20 rounded-card border border-border bg-surface p-9 md:p-11">
          <h2 className="font-display text-2xl md:text-[2rem] font-semibold tracking-[-0.03em] max-w-2xl leading-[1.1]">
            Want something like this for your business?
          </h2>
          <p className="mt-4 text-muted max-w-[56ch] leading-relaxed">
            {w.kind === 'webdev'
              ? 'Tell us the outcome you are after, whether that is more signups, a better funnel, or a real internal tool. We scope and quote it on a call within 24 hours.'
              : 'We adapt this workflow to your stack, deploy it to your n8n, and walk your team through it. Turnaround is 3 to 7 days.'}
          </p>
          <div className="mt-8">
            <CTAButton href={`/contact?ref=${w.slug}`} variant="primary">
              Start a project <ArrowRight size={15} strokeWidth={2} />
            </CTAButton>
          </div>
        </FadeUp>

        {/* Prev / next */}
        <nav aria-label="More case studies" className="mt-10 grid sm:grid-cols-2 gap-4">
          {prev ? (
            <Link
              href={`/work/${prev.slug}`}
              className="group rounded-card border border-border bg-surface p-6 hover:border-accent/40 transition-colors"
            >
              <span className="text-xs text-muted inline-flex items-center gap-1.5">
                <ArrowLeft size={12} aria-hidden className="transition-transform group-hover:-translate-x-1" />
                Previous
              </span>
              <span className="mt-2 block font-medium tracking-tight">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/work/${next.slug}`}
              className="group rounded-card border border-border bg-surface p-6 hover:border-accent/40 transition-colors sm:text-right"
            >
              <span className="text-xs text-muted inline-flex items-center gap-1.5">
                Next
                <ArrowRight size={12} aria-hidden className="transition-transform group-hover:translate-x-1" />
              </span>
              <span className="mt-2 block font-medium tracking-tight">{next.title}</span>
            </Link>
          )}
        </nav>
      </Container>
    </>
  );
}
