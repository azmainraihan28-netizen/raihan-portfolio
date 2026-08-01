import { Container, Eyebrow } from '@/components/ui';
import { getAllWorkflows } from '@/lib/work';
import { WorkGrid } from './WorkGrid';

export const metadata = {
  title: 'Work · Websites, apps, and AI automations',
  description:
    'Selected Vertex Studio projects: e-commerce, SaaS, mobile apps, ops dashboards, and 30+ production n8n automations. Real pain points, real outcomes.',
};

export default async function WorkIndexPage() {
  const all = await getAllWorkflows();
  const webCount = all.filter((w) => w.kind === 'webdev').length;
  const autoCount = all.filter((w) => w.kind === 'automation').length;

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="absolute inset-0 tech-grid" />
        <Container className="relative pt-20 md:pt-28 pb-16 md:pb-20">
          <Eyebrow className="mb-6">Selected work</Eyebrow>
          <h1 className="font-display font-semibold tracking-[-0.04em] leading-[1.02] text-[clamp(2.4rem,5.6vw,4rem)] max-w-3xl">
            {all.length} projects. Every one shipped.
          </h1>
          <p className="mt-7 text-muted max-w-[60ch] text-lg leading-relaxed">
            {webCount} sites and apps, {autoCount} AI automations. Every card opens a full case
            study with the pain point, the build, and the outcome.
          </p>
        </Container>
      </section>

      <Container className="py-14 md:py-16 pb-28">
        <WorkGrid items={all} />
      </Container>
    </>
  );
}
