import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  // Keep safelist at the root level — never under theme.extend.
  safelist: [
    'bg-brand',
    'bg-brand-dark',
    'bg-brand-light',
    'text-brand',
    'text-white',
    'text-white/90',
    'bg-page',
    'bg-white/15',
    'hover:bg-brand-light',
    'hover:bg-brand-dark',
    'bg-accent',
    'bg-accent-hover',
    'text-accent',
    'hover:text-accent-hover',
    'hover:bg-accent-hover',
    'focus:border-accent',
    'focus:ring-accent/20',
    'focus:ring-accent/30',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        brand: {
          DEFAULT: '#0073AA',
          dark: '#005a87',
          light: '#e8f4fa',
        },
        page: '#FBFBFB',
        accent: {
          DEFAULT: '#2196F3',
          hover: '#1E88E5',
        },
      },
      fontFamily: {
        sans: ['var(--font-noto-sans-thai)', 'var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
