import type { ReactNode } from 'react';

/* The clients here are the studio's own project names, so there is no
   third-party SVG to pull. Each gets a simple geometric mark drawn in
   currentColor -- a lockup reads as a logo wall, a row of plain text
   does not. Marks are single shapes, not illustrations. */

type Client = { name: string; mark: ReactNode };

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 } as const;

const CLIENTS: Client[] = [
  {
    name: 'TrendyBD',
    mark: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" {...S} />
        <path d="M7 17 17 7" {...S} />
      </>
    ),
  },
  {
    name: 'Vanguard Records',
    mark: (
      <>
        <circle cx="12" cy="12" r="9" {...S} />
        <circle cx="12" cy="12" r="3.4" {...S} />
      </>
    ),
  },
  {
    name: 'ACI Canteen',
    mark: <path d="M12 2.6 20.2 7.3v9.4L12 21.4 3.8 16.7V7.3Z" {...S} />,
  },
  {
    name: 'ExpenseAI',
    mark: (
      <>
        <path d="M4 19V13" {...S} strokeLinecap="round" />
        <path d="M12 19V8.5" {...S} strokeLinecap="round" />
        <path d="M20 19V4.5" {...S} strokeLinecap="round" />
      </>
    ),
  },
  {
    name: 'HireBest',
    mark: (
      <>
        <circle cx="12" cy="12" r="9" {...S} />
        <path d="m8.4 12.4 2.6 2.6 4.8-5.4" {...S} strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    name: 'MoeBella',
    mark: <path d="M12 3.4c5 0 8.6 3.2 8.6 7.6 0 5-4.2 9.6-8.6 9.6S3.4 16 3.4 11c0-4.4 3.6-7.6 8.6-7.6Z" {...S} />,
  },
  {
    name: 'Trattoria Abruzzesa',
    mark: (
      <>
        <path d="M4.5 20.5V11a7.5 7.5 0 0 1 15 0v9.5" {...S} strokeLinecap="round" />
        <path d="M9.5 20.5V12h5v8.5" {...S} strokeLinecap="round" />
      </>
    ),
  },
  {
    name: 'Northwind Labs',
    mark: (
      <>
        <path d="M12 2.8 21.2 12 12 21.2 2.8 12Z" {...S} />
        <path d="M12 8.4 15.6 12 12 15.6 8.4 12Z" {...S} />
      </>
    ),
  },
  {
    name: 'Kestrel Health',
    mark: (
      <path
        d="M9.4 3.2h5.2v6.2h6.2v5.2h-6.2v6.2H9.4v-6.2H3.2V9.4h6.2Z"
        {...S}
        strokeLinejoin="round"
      />
    ),
  },
];

function Lockup({ c }: { c: Client }) {
  return (
    <div className="flex items-center gap-2.5 shrink-0 px-7 text-muted/70 hover:text-text transition-colors">
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] shrink-0" aria-hidden>
        {c.mark}
      </svg>
      <span className="font-display font-semibold tracking-[-0.02em] text-[15px] whitespace-nowrap">
        {c.name}
      </span>
    </div>
  );
}

export function ClientWall() {
  return (
    <section aria-label="Clients" className="border-b border-border py-9 overflow-hidden">
      <div className="marquee-mask">
        {/* Track is duplicated once and translated -50%, so the loop is seamless. */}
        <div className="marquee-track flex w-max items-center">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex items-center" aria-hidden={pass === 1}>
              {CLIENTS.map((c) => (
                <Lockup key={`${pass}-${c.name}`} c={c} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
