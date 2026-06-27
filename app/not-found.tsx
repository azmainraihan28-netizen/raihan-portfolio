import Link from 'next/link';
import { Container } from '@/components/ui';

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <div className="font-mono text-sm text-muted">404</div>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Workflow not found.</h1>
      <p className="mt-3 text-muted">Maybe the slug changed or the case study was renamed.</p>
      <Link href="/work" className="mt-6 inline-block text-accent hover:underline">← Back to all workflows</Link>
    </Container>
  );
}
