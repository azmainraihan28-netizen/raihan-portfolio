import Link from 'next/link';
import { site } from '@/content/site';

export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="max-w-container mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-medium">{site.name}</div>
          <div className="text-muted text-sm mt-1">{site.role}</div>
          <p className="text-muted text-sm mt-4 max-w-sm">
            Building AI automations on n8n. From single-workflow Fiverr gigs to full Agency-OS systems for founders.
          </p>
        </div>
        <div className="text-sm">
          <div className="text-muted mb-3">Sitemap</div>
          <ul className="space-y-1.5">
            <li><Link href="/work" className="hover:text-accent">Work</Link></li>
            <li><Link href="/services" className="hover:text-accent">Services</Link></li>
            <li><Link href="/about" className="hover:text-accent">About</Link></li>
            <li><Link href="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="text-muted mb-3">Elsewhere</div>
          <ul className="space-y-1.5">
            <li><a href={site.linkedin} target="_blank" rel="noopener" className="hover:text-accent">LinkedIn</a></li>
            <li><a href={`mailto:${site.email}`} className="hover:text-accent">{site.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-container mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
          <div>© {new Date().getFullYear()} {site.name}. Built on Next.js.</div>
          <div className="font-mono">30 workflows · 30 days · 1 webhook each</div>
        </div>
      </div>
    </footer>
  );
}
