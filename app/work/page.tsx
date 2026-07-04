import { Container, Eyebrow } from '@/components/ui';
import { getAllWorkflows } from '@/lib/work';
import { WorkGrid } from './WorkGrid';

export const metadata = {
  title: 'Work — Websites, apps, and AI automations',
  description: 'Selected Zeroline Studio projects — e-commerce, SaaS, mobile apps, ops dashboards, and 30+ production n8n automations. Real pain points, real outcomes.',
};

export default async function WorkIndexPage() {
  const all = await getAllWorkflows();
  const webCount = all.filter((w) => w.kind === 'webdev').length;
  const autoCount = all.filter((w) => w.kind === 'automation').length;
  return (
    <>
      <section>
        <Container className="pt-20 pb-10">
          <Eyebrow>Selected work</Eyebrow>
          <h1 className="mt-3 text-4xl md:text-6xl font-semibold tracking-tight">
            {all.length} projects. <span className="font-serif italic font-normal text-accent">Every one shipped.</span>
          </h1>
          <p className="mt-4 text-muted max-w-2xl text-lg">
            {webCount} sites &amp; apps · {autoCount} AI automations. Filter by kind, stack, or search — every card opens a full case study with the pain point, the build, and the outcome.
          </p>
        </Container>
      </section>
      <Container className="pb-24">
        <WorkGrid items={all} />
      </Container>
    </>
  );
}
