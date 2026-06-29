'use client';

/**
 * Signature hero animation for AI/automation industry.
 * Floating "scan dots" + code-bracket glyphs drift up and fade.
 * Pure CSS keyframes — cheap, no rerenders.
 */
export function SignatureAnimation() {
  // Hand-tuned particle positions/timings — deterministic, no Math.random()
  // so SSR/CSR markup matches exactly.
  const particles = [
    { type: 'dot', x: 12, y: 78, delay: 0, dur: 9, size: 5 },
    { type: 'bracket', x: 32, y: 92, delay: 1.4, dur: 11, size: 14, char: '{' },
    { type: 'dot', x: 52, y: 84, delay: 2.7, dur: 10, size: 4 },
    { type: 'bracket', x: 70, y: 96, delay: 0.8, dur: 12, size: 12, char: '}' },
    { type: 'dot', x: 22, y: 70, delay: 3.5, dur: 9.5, size: 6 },
    { type: 'bracket', x: 84, y: 88, delay: 4.2, dur: 10.5, size: 16, char: '<>' },
    { type: 'dot', x: 60, y: 75, delay: 5.1, dur: 11.5, size: 4 },
    { type: 'dot', x: 8, y: 64, delay: 6.0, dur: 10, size: 5 },
    { type: 'bracket', x: 46, y: 95, delay: 1.9, dur: 11.8, size: 13, char: '/>' },
    { type: 'dot', x: 76, y: 72, delay: 3.0, dur: 9.2, size: 5 },
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        // mask so particles fade out at the top edge before they crash into headline
        maskImage: 'radial-gradient(ellipse 80% 70% at 80% 60%, black 0%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 80% 60%, black 0%, transparent 75%)',
      }}
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="signature-particle absolute font-mono"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `signatureDrift ${p.dur}s linear ${p.delay}s infinite`,
            fontSize: p.type === 'bracket' ? `${p.size}px` : undefined,
            width: p.type === 'dot' ? `${p.size}px` : undefined,
            height: p.type === 'dot' ? `${p.size}px` : undefined,
          }}
        >
          {p.type === 'dot' ? (
            <span className="block w-full h-full rounded-full bg-accent/70 shadow-[0_0_12px_rgba(124,92,255,0.6)]" />
          ) : (
            <span className="text-accent/55">{p.char}</span>
          )}
        </span>
      ))}

      {/* Subtle scan-line sweep across the area, ~12s */}
      <span
        className="absolute inset-x-[40%] top-[55%] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"
        style={{ animation: 'signatureScan 14s ease-in-out infinite' }}
      />

      <style jsx>{`
        @keyframes signatureDrift {
          0%   { transform: translate3d(0, 0, 0) scale(1);   opacity: 0; }
          15%  { opacity: 0.9; }
          50%  { transform: translate3d(-6px, -60px, 0) scale(1.05); opacity: 0.7; }
          85%  { opacity: 0.5; }
          100% { transform: translate3d(8px, -160px, 0) scale(0.85); opacity: 0; }
        }
        @keyframes signatureScan {
          0%, 100% { transform: translateY(-20px); opacity: 0; }
          25%      { opacity: 1; }
          50%      { transform: translateY(40px); opacity: 0.8; }
          75%      { opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          .signature-particle { animation: none !important; opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
