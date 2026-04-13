/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['var(--font-cinzel)', 'serif'],
        crimson: ['var(--font-crimson)', 'serif'],
      },
      colors: {
        board: {
          light: '#F0D9B5',
          dark: '#B58863',
          border: '#7a5230',
          shadow: '#3d2a10',
        },
        chess: {
          gold: '#D4AF37',
          'gold-light': '#F5D97F',
          cream: '#FDF8EE',
          brown: '#8B5E3C',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F5D97F 50%, #D4AF37 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1a0a00 0%, #2d1a0a 50%, #1a0a00 100%)',
      },
      boxShadow: {
        'board': '0 20px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3)',
        'piece': '0 4px 12px rgba(0,0,0,0.4)',
        'gold': '0 0 20px rgba(212,175,55,0.4)',
      },
    },
  },
  plugins: [],
};
