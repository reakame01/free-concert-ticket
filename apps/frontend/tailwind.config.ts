import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
      },
      fontFamily: {
        sans: ['var(--font-noto-sans-thai)', 'var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
