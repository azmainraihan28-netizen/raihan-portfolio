import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { getAllWorkflows } from '@/lib/work';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = `https://${site.domain}`;
  const all = await getAllWorkflows();
  const staticRoutes = ['', '/work', '/services', '/about', '/contact'].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.7,
  }));
  const work = all.map((w) => ({
    url: `${base}/work/${w.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));
  return [...staticRoutes, ...work];
}
