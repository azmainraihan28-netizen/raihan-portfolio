import { ArrowRight } from 'lucide-react';
import { Container, CTAButton } from '@/components/ui';

export default function NotFound() {
  return (
    <Container className="py-32 md:py-44">
      <div className="max-w-2xl">
        <div className="font-mono text-sm text-accent">404</div>
        <h1 className="mt-5 font-display font-semibold tracking-[-0.04em] leading-[1.04] text-[clamp(2.2rem,5vw,3.4rem)]">
          That page is not here.
        </h1>
        <p className="mt-6 text-muted leading-relaxed max-w-[48ch]">
          The slug may have changed, or the case study was renamed. Everything we have shipped
          lives on the work index.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <CTAButton href="/work" variant="primary" size="lg">
            See our work <ArrowRight size={17} strokeWidth={2} />
          </CTAButton>
          <CTAButton href="/" variant="ghost" size="lg">
            Back home
          </CTAButton>
        </div>
      </div>
    </Container>
  );
}
