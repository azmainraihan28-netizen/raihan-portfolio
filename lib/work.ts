import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export type WorkKind = 'automation' | 'webdev';

export type Workflow = {
  day: number;
  slug: string;
  title: string;
  tagline: string;
  week: 1 | 2 | 3 | 4 | 5;
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
  /** Intrinsic pixel size of `screenshot`, read at build so next/image can
   *  reserve the correct box and we do not ship layout shift. */
  screenshotW: number;
  screenshotH: number;
  body: string;
  filename: string;
  kind: WorkKind;
  client?: string;
};

const WORK_DIR = path.join(process.cwd(), 'content/work');

/** Reads width/height straight out of a PNG IHDR chunk. Falls back to a
 *  16:10 box for non-PNG or unreadable files. */
async function pngSize(publicPath: string): Promise<{ w: number; h: number }> {
  const fallback = { w: 1600, h: 1000 };
  if (!publicPath || !publicPath.toLowerCase().endsWith('.png')) return fallback;
  try {
    const file = path.join(process.cwd(), 'public', decodeURIComponent(publicPath).replace(/^\//, ''));
    const fh = await fs.open(file, 'r');
    try {
      const buf = Buffer.alloc(24);
      await fh.read(buf, 0, 24, 0);
      if (buf.toString('ascii', 12, 16) !== 'IHDR') return fallback;
      return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
    } finally {
      await fh.close();
    }
  } catch {
    return fallback;
  }
}

let cache: Workflow[] | null = null;

export async function getAllWorkflows(): Promise<Workflow[]> {
  // Cache in production only — dev should pick up MDX regeneration immediately.
  if (cache && process.env.NODE_ENV === 'production') return cache;
  const files = (await fs.readdir(WORK_DIR)).filter((f) => f.endsWith('.mdx'));
  const items: Workflow[] = [];
  for (const file of files) {
    const raw = await fs.readFile(path.join(WORK_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    const shot = data.screenshot || '';
    const { w: screenshotW, h: screenshotH } = await pngSize(shot);
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
      screenshot: shot,
      screenshotW,
      screenshotH,
      body: content,
      filename: file,
      kind: (data.kind || 'automation') as WorkKind,
      client: data.client || undefined,
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
