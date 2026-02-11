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
        // Base academic colors
        cream: '#FAF7F2',
        parchment: '#F3EDE4',
        bark: '#1C1917',
        
        // Vibrant accent colors
        ember: '#F97316',
        'ember-light': '#FB923C',
        'ember-dark': '#EA580C',
        
        // Academic vibrant palette
        'forest': '#059669',
        'forest-light': '#10B981',
        'ocean': '#0EA5E9',
        'ocean-light': '#38BDF8',
        'violet': '#8B5CF6',
        'violet-light': '#A78BFA',
        'rose': '#F43F5E',
        'amber': '#F59E0B',
        
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
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.3)',
        'glow-green': '0 0 20px rgba(5, 150, 105, 0.3)',
        'glow-blue': '0 0 20px rgba(14, 165, 233, 0.3)',
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
