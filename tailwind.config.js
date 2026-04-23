/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Display falls back to Inter — Wise Sans isn't publicly licensed.
        // Pair it with font-black (900) and leading-[0.85] in markup to get
        // the billboard feel from the Wise design system.
        serif: ['"Wise Sans"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        // ── Wise palette ──────────────────────────────────────────────
        wise: {
          black: '#0e0f0c',          // primary text
          green: '#9fe870',          // primary CTA bg
          'dark-green': '#163300',   // button text on green
          mint: '#e2f6d5',           // soft surface / badge
          pastel: '#cdffad',         // hover accent
          positive: '#054d28',       // success
          danger: '#d03238',         // error
          warning: '#ffd11a',        // warning
          orange: '#ffc091',         // warm accent
          cyan: 'rgba(56,200,255,0.10)',
          'warm-dark': '#454745',    // secondary text / borders
          gray: '#868685',           // muted
          surface: '#e8ebe6',        // light surface
          off: '#fafaf7',            // page bg
        },

        // ── Backwards-compatible app tokens, remapped to Wise ─────────
        cream: '#fafaf7',            // page background (off-white)
        parchment: '#ffffff',        // surface
        bark: '#0e0f0c',             // primary text (near-black)

        // Primary CTA color = Wise Green. Components that previously used
        // `bg-ember text-white` should switch to `text-wise-dark-green` for
        // proper contrast (handled in component updates).
        ember: '#9fe870',
        'ember-light': '#cdffad',
        'ember-dark': '#163300',

        forest: '#054d28',
        'forest-light': '#10B981',
        ocean: '#0EA5E9',
        'ocean-light': '#38BDF8',
        violet: '#8B5CF6',
        'violet-light': '#A78BFA',
        rose: '#d03238',
        amber: '#ffd11a',

        'warm-gray': {
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#868685',
          600: '#454745',
          700: '#374151',
          800: '#1F2937',
        },
      },
      boxShadow: {
        // Wise uses ring shadows almost exclusively.
        ring: 'rgba(14,15,12,0.12) 0px 0px 0px 1px',
        'ring-strong': 'rgba(14,15,12,0.18) 0px 0px 0px 1px',
        card: 'rgba(14,15,12,0.12) 0px 0px 0px 1px',
        'card-hover': 'rgba(14,15,12,0.18) 0px 0px 0px 1px',
        'glow-orange': 'rgba(159,232,112,0.25) 0 0 0 4px',
        'glow-green': 'rgba(159,232,112,0.25) 0 0 0 4px',
        'glow-blue': 'rgba(56,200,255,0.20) 0 0 0 4px',
      },
      borderRadius: {
        wise: '30px',
        'wise-lg': '40px',
      },
      letterSpacing: {
        wise: '-0.02em',
        'wise-tight': '-0.03em',
      },
      transitionTimingFunction: {
        wise: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
