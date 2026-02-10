/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#FAF7F2',
        parchment: '#F3EDE4',
        bark: '#1C1917',
        ember: '#C2410C',
        'ember-light': '#EA580C',
        'warm-gray': {
          100: '#F5F0EB',
          200: '#E7E0D8',
          300: '#D4CBC0',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(28,25,23,0.06), 0 4px 12px rgba(28,25,23,0.04)',
        'card-hover': '0 2px 8px rgba(28,25,23,0.08), 0 8px 24px rgba(28,25,23,0.06)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.8)',
      },
    },
  },
  plugins: [],
}
