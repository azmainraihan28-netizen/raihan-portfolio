import { Container, Eyebrow } from '@/components/ui';
import { site } from '@/content/site';

export const metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${site.name}. How we collect, use, and protect your data.`,
};

export default function PrivacyPage() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 tech-grid" />
      <Container className="relative pt-20 md:pt-28 pb-24 md:pb-32">
        <Eyebrow className="mb-6">Legal</Eyebrow>
        <h1 className="font-display font-semibold tracking-[-0.04em] leading-[1.02] text-[clamp(2.4rem,5.6vw,4rem)] max-w-3xl">
          Privacy Policy
        </h1>
        <p className="mt-6 text-muted max-w-[58ch]">
          Last updated: August 3, 2026
        </p>

        <div className="mt-14 max-w-[68ch] space-y-12 text-text/85 leading-relaxed">
          <Block title="1. Information we collect">
            <p>
              When you use our contact form or email us, we collect the information you
              provide: your name, email address, and message content. We also collect
              basic analytics data (page views, referrer, device type) through Vercel
              Analytics to understand how visitors use our site.
            </p>
          </Block>

          <Block title="2. How we use your information">
            <ul className="list-disc pl-5 space-y-2">
              <li>To respond to your inquiries and project requests.</li>
              <li>To improve our website and services.</li>
              <li>To send project-related communications you have requested.</li>
            </ul>
            <p className="mt-4">
              We do not sell, rent, or share your personal information with third
              parties for marketing purposes.
            </p>
          </Block>

          <Block title="3. Cookies and analytics">
            <p>
              We use Vercel Analytics, which collects anonymized usage data without
              using cookies. No personally identifiable information is tracked through
              our analytics.
            </p>
          </Block>

          <Block title="4. Third-party services">
            <p>
              Our website may contain links to third-party sites (e.g., LinkedIn). We
              are not responsible for the privacy practices of those sites. We encourage
              you to read their privacy policies.
            </p>
          </Block>

          <Block title="5. Data retention">
            <p>
              We retain your contact information only as long as necessary to fulfill
              the purpose for which it was collected, or as required by law. You may
              request deletion of your data at any time.
            </p>
          </Block>

          <Block title="6. Data security">
            <p>
              We take reasonable measures to protect your information from unauthorized
              access, alteration, or destruction. However, no method of transmission
              over the internet is 100% secure.
            </p>
          </Block>

          <Block title="7. Your rights">
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction or deletion of your data.</li>
              <li>Withdraw consent for data processing at any time.</li>
            </ul>
          </Block>

          <Block title="8. Contact">
            <p>
              If you have questions about this privacy policy, contact us at{' '}
              <a href={`mailto:${site.email}`} className="text-accent hover:underline">
                {site.email}
              </a>
              .
            </p>
          </Block>
        </div>
      </Container>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-8">
      <h2 className="font-display text-lg font-semibold tracking-tight mb-4">
        {title}
      </h2>
      <div className="text-sm text-muted leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}
