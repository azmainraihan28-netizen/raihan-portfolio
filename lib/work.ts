import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export type Workflow = {
  day: number;
  slug: string;
  title: string;
  tagline: string;
  week: 1 | 2 | 3 | 4;
  category: string;
  industries: string[];
  tools: string[];
  nodes: number;
  costPerRun: string;
  heroMetric: string;
  priceLow: number;
  priceHigh: number;
  featured: boolean;
  workflowJson: string;
  linkedinPost: string;
  targetUsers: string;
  screenshot: string;
  body: string;
  filename: string;
};

const WORK_DIR = path.join(process.cwd(), 'content/work');

let cache: Workflow[] | null = null;

export async function getAllWorkflows(): Promise<Workflow[]> {
  // Cache in production only — dev should pick up MDX regeneration immediately.
  if (cache && process.env.NODE_ENV === 'production') return cache;
  const files = (await fs.readdir(WORK_DIR)).filter((f) => f.endsWith('.mdx'));
  const items: Workflow[] = [];
  for (const file of files) {
    const raw = await fs.readFile(path.join(WORK_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    items.push({
      day: data.day,
      slug: data.slug,
      title: data.title,
      tagline: data.tagline,
      week: data.week,
      category: data.category,
      industries: data.industries || [],
      tools: data.tools || [],
      nodes: data.nodes || 0,
      costPerRun: data.costPerRun || '',
      heroMetric: data.heroMetric || '',
      priceLow: data.priceLow || 0,
      priceHigh: data.priceHigh || 0,
      featured: !!data.featured,
      workflowJson: data.workflowJson || '',
      linkedinPost: data.linkedinPost || '',
      targetUsers: data.targetUsers || '',
      screenshot: data.screenshot || '',
      body: content,
      filename: file,
    });
  }
  items.sort((a, b) => a.day - b.day);
  if (process.env.NODE_ENV === 'production') cache = items;
  return items;
}

export async function getWorkflow(slug: string): Promise<Workflow | undefined> {
  const all = await getAllWorkflows();
  return all.find((w) => w.slug === slug);
}

export async function getFeatured(): Promise<Workflow[]> {
  const all = await getAllWorkflows();
  return all.filter((w) => w.featured);
}
