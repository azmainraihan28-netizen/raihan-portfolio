import type { Config } from 'tailwindcss';

const rgb = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}', './content/**/*.{mdx,md}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: rgb('--bg'),
        surface: rgb('--surface'),
        surface2: rgb('--surface2'),
        border: rgb('--border'),
        text: rgb('--text'),
        muted: rgb('--muted'),
        accent: {
          DEFAULT: rgb('--accent'),
          hover: rgb('--accent-hover'),
          soft: 'rgb(var(--accent) / 0.12)',
          on: rgb('--on-accent'),
        },
        primary: {
          DEFAULT: rgb('--primary'),
          hover: rgb('--primary-hover'),
          on: rgb('--on-primary'),
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['var(--font-display)', 'var(--font-geist-sans)', 'ui-sans-serif', 'sans-serif'],
      },
      // One documented radius rule for the whole site.
      borderRadius: {
        pill: 'var(--r-pill)',
        card: 'var(--r-card)',
        input: 'var(--r-input)',
      },
      maxWidth: {
        container: '78rem',
        prose: '64rem',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(3%, -4%, 0) scale(1.06)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
        drift: 'drift 24s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
