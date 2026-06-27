import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Download, Linkedin } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Container, CTAButton, Eyebrow, PriceRange, ToolChip, WeekBadge } from '@/components/ui';
import { FadeUp, StaggerItem, StaggerOnMount } from '@/components/motion';
import { getAllWorkflows, getWorkflow } from '@/lib/work';

export async function generateStaticParams() {
  const all = await getAllWorkflows();
  return all.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const w = await getWorkflow(params.slug);
  if (!w) return {};
  return {
    title: `${w.title} — Day ${w.day}`,
    description: w.tagline,
    openGraph: { title: w.title, description: w.tagline, type: 'article' },
  };
}

const mdxComponents = {
  h2: (p: any) => <h2 {...p} />,
  h3: (p: any) => <h3 {...p} />,
  p: (p: any) => <p {...p} />,
  ul: (p: any) => <ul {...p} />,
  ol: (p: any) => <ol {...p} />,
  li: (p: any) => <li {...p} />,
  hr: (p: any) => <hr {...p} />,
  strong: (p: any) => <strong {...p} />,
  code: (p: any) => <code {...p} />,
  details: (p: any) => <details className="mt-4 rounded-lg border border-border bg-surface p-4" {...p} />,
  summary: (p: any) => <summary className="cursor-pointer text-accent font-medium" {...p} />,
  blockquote: (p: any) => <blockquote {...p} />,
};

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const w = await getWorkflow(params.slug);
  if (!w) notFound();

  const all = await getAllWorkflows();
  const idx = all.findIndex((x) => x.slug === w.slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border">
        <Container className="pt-16 pb-10">
          <div className="flex items-center gap-3 text-sm">
            <Link href="/work" className="text-muted hover:text-text inline-flex items-center gap-1">
              <ArrowLeft size={14} /> Work
            </Link>
            <span className="text-muted">/</span>
            <span className="font-mono text-muted">Day {String(w.day).padStart(2, '0')}</span>
            <WeekBadge week={w.week} />
            <span className="text-muted">·</span>
            <span className="text-muted">{w.category}</span>
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.1]">
            {w.title}
          </h1>
          <p className="mt-4 text-lg text-muted max-w-3xl">{w.tagline}</p>

          <StaggerOnMount className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StaggerItem><Metric label="Cost per run" value={w.costPerRun || '—'} /></StaggerItem>
            <StaggerItem><Metric label="Nodes" value={w.nodes ? `${w.nodes}` : '—'} /></StaggerItem>
            <StaggerItem><Metric label="Build price" value={<PriceRange low={w.priceLow} high={w.priceHigh} />} /></StaggerItem>
            <StaggerItem><Metric label="Hero metric" value={w.heroMetric || '—'} /></StaggerItem>
          </StaggerOnMount>

          {w.tools.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted mr-1">Built with:</span>
              {w.tools.map((t) => <ToolChip key={t}>{t}</ToolChip>)}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <CTAButton href={`/contact?ref=day${w.day}`} variant="primary">Want this for your business?</CTAButton>
            {w.workflowJson && (
              <a
                href={w.workflowJson}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm border border-border bg-surface hover:bg-surface2 transition-colors"
              >
                <Download size={14} /> Download n8n JSON
              </a>
            )}
            <a
              href="https://www.linkedin.com/in/viberaihan/"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm border border-border bg-surface hover:bg-surface2 transition-colors"
            >
              <Linkedin size={14} /> See on LinkedIn
            </a>
          </div>
        </Container>
      </section>

      {/* Screenshot */}
      {w.screenshot && (
        <Container className="pt-12">
          <FadeUp className="relative rounded-2xl border border-border bg-surface overflow-hidden shadow-[0_30px_80px_-30px_rgba(124,92,255,0.35)]">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
            <img
              src={w.screenshot}
              alt={`${w.title} — n8n workflow screenshot`}
              loading="lazy"
              className="block w-full h-auto"
            />
          </FadeUp>
          <div className="mt-3 text-xs text-muted font-mono">Case study card — Day {w.day} of the 30-day n8n challenge</div>
        </Container>
      )}

      {/* Body */}
      <Container className="py-14">
        <article className="prose-custom max-w-prose">
          <MDXRemote source={w.body} components={mdxComponents as any} />
        </article>

        {/* Bottom CTA */}
        <FadeUp className="mt-16 rounded-xl border border-border bg-surface p-8">
          <Eyebrow>Hire me</Eyebrow>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight">Get this built for your business.</h3>
          <p className="mt-2 text-muted max-w-xl">
            I'll customize it to your stack, deploy to your n8n, and walk your team through it. Standard turnaround: 3–7 days.
          </p>
          <div className="mt-5">
            <CTAButton href={`/contact?ref=day${w.day}`} variant="primary">
              Start a project <ArrowRight size={14} />
            </CTAButton>
          </div>
        </FadeUp>

        {/* Prev / Next */}
        <div className="mt-10 flex items-stretch gap-4 flex-col sm:flex-row">
          {prev && (
            <Link href={`/work/${prev.slug}`} className="flex-1 rounded-lg border border-border bg-surface p-5 hover:bg-surface2 transition-colors">
              <div className="text-xs text-muted inline-flex items-center gap-1"><ArrowLeft size={12} /> Day {prev.day}</div>
              <div className="mt-1 font-medium">{prev.title}</div>
            </Link>
          )}
          {next && (
            <Link href={`/work/${next.slug}`} className="flex-1 rounded-lg border border-border bg-surface p-5 hover:bg-surface2 transition-colors text-right">
              <div className="text-xs text-muted inline-flex items-center gap-1 justify-end w-full">Day {next.day} <ArrowRight size={12} /></div>
              <div className="mt-1 font-medium">{next.title}</div>
            </Link>
          )}
        </div>
      </Container>
    </>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-1 font-mono text-lg">{value}</div>
    </div>
  );
}
