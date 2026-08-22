'use client';

import { useRouter } from 'next/navigation';
import { ProjectShowcase } from '@/components/ui/project-showcase';

type Item = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  screenshot: string;
};

export function FeaturedShowcase({ items }: { items: Item[] }) {
  const router = useRouter();

  const testimonials = items.map((w) => ({
    name: w.title,
    designation: w.category,
    quote: w.tagline,
    src: w.screenshot,
    link: `/work/${w.slug}`,
  }));

  return (
    <ProjectShowcase
      testimonials={testimonials}
      colors={{
        name: 'rgb(234 234 234)',
        position: 'rgb(138 138 146)',
        testimony: 'rgb(234 234 234 / 0.85)',
      }}
      fontSizes={{ name: '1.75rem', position: '0.8rem', testimony: '1.05rem' }}
      spacing={{
        lineHeight: '1.6',
        nameTop: '0',
        nameBottom: '0.35em',
        positionTop: '0',
        positionBottom: '0.6em',
        testimonyTop: '0.9em',
        testimonyBottom: '1.2em',
      }}
      imageAspectRatio={1.6}
      outerRounding="17px"
      innerRounding="16px"
      outlineColor="rgb(31 31 35)"
      hoverOutlineColor="rgb(124 92 255 / 0.55)"
      buttonInscriptions={{
        previousButton: 'Previous',
        nextButton: 'Next',
        openWebAppButton: 'Open case study',
      }}
      halomotButtonGradient="linear-gradient(to right, #7c5cff, #a123f4)"
      halomotButtonBackground="rgb(17 17 19)"
      halomotButtonTextColor="rgb(234 234 234)"
      halomotButtonOuterBorderRadius="10px"
      halomotButtonInnerBorderRadius="9px"
      halomotButtonHoverTextColor="#fff"
      onItemClick={(link) => {
        if (!link) return;
        if (link.startsWith('/')) router.push(link);
        else window.open(link, '_blank', 'noopener,noreferrer');
      }}
    />
  );
}
