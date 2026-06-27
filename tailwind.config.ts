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
        },
        success: '#3FB984',
        warn: '#E0A24A',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        container: '72rem',
        prose: '64rem',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
export default config;
