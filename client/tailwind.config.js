/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Core palette — grounded in clinical calm + rehabilitation warmth.
        ink: '#16302B',       // primary text — deep spruce, not pure black
        paper: '#F2F5F1',     // page background — pale mint-grey, not cream
        surface: '#FFFFFF',   // card / panel background
        primary: {
          DEFAULT: '#1F6F5C', // clinical teal-green — trust, healing, movement
          dark: '#14493D',
          light: '#E7F0EC',
        },
        accent: {
          DEFAULT: '#C9762E', // warm clay amber — CTAs, highlights
          dark: '#A55F22',
          light: '#F7E8D6',
        },
        slate: {
          DEFAULT: '#4B5D59', // muted secondary text
          light: '#7C8B87',
        },
        line: '#DCE3DE',      // hairline borders/dividers
      },
      fontFamily: {
        display: ['"Newsreader"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: '0.75rem',
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(22, 48, 43, 0.12)',
        lift: '0 12px 32px -12px rgba(22, 48, 43, 0.22)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        arcDraw: {
          '0%': { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: '0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.7s ease-out both',
        arcDraw: 'arcDraw 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        pulseSoft: 'pulseSoft 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
