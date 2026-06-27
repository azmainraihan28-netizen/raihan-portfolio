import { Container, Eyebrow } from '@/components/ui';
import { getAllWorkflows } from '@/lib/work';
import { WorkGrid } from './WorkGrid';

export const metadata = {
  title: 'Work — 30 n8n automation workflows',
  description: '30 production AI automations from the 30-day n8n challenge. Pain points, solutions, node breakdowns, and pricing for every build.',
};

export default async function WorkIndexPage() {
  const all = await getAllWorkflows();
  return (
    <>
      <section>
        <Container className="pt-20 pb-10">
          <Eyebrow>The full catalog</Eyebrow>
          <h1 className="mt-3 text-4xl md:text-6xl font-semibold tracking-tight">30 workflows. 30 problems.</h1>
          <p className="mt-4 text-muted max-w-2xl text-lg">
            Filter by week, category, industry, or tool. Every card opens a deep case study — pain points, solution, node-by-node flow, cost, and pricing.
          </p>
        </Container>
      </section>
      <Container className="pb-24">
        <WorkGrid items={all} />
      </Container>
    </>
  );
}
