/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'astro-black':   '#130d1c',
        'astro-ink':     '#000000',
        'bone':          '#f0eee8',
        'off-white':     '#e0dfdb',
        'accent':        '#ef476e',
        'accent-deep':   '#d50059',
        'astro-yellow':  '#ffbd5c',
        'astro-orange':  '#ff603e',
        'astro-magenta': '#d50059',
        'astro-indigo':  '#5b2d8e',
        'warg':          '#ff603e',
        'medusa':        '#3fb87f',
        'wire':          '#2fa3a3',
        'intersolar':    '#3b6fd4',
        'synth':         '#9b6dff',
      },
      fontFamily: {
        mono:    ['"Space Mono"', 'monospace'],
        display: ['Anton', 'sans-serif'],
        serif:   ['"Instrument Serif"', 'serif'],
      },
    },
  },
  plugins: [],
}
