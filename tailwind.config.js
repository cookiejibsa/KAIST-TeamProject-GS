/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 따뜻한 코랄/레드 (식욕 자극 강조색)
        brand: {
          50: '#fff3f1',
          100: '#ffe4df',
          200: '#ffc9c0',
          300: '#ffa294',
          400: '#ff7a66',
          500: '#f54e3a',
          600: '#df3622',
          700: '#bb2817',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.92) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(40px, -50px) scale(1.15)' },
          '66%': { transform: 'translate(-30px, 30px) scale(0.9)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        'border-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-rev': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '50%': { transform: 'translateY(8px)', opacity: '1' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-up': 'fade-up 0.6s ease-out both',
        blob: 'blob 18s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 1s linear infinite',
        'border-flow': 'border-flow 4s ease infinite',
        marquee: 'marquee 40s linear infinite',
        'marquee-rev': 'marquee-rev 50s linear infinite',
        'bounce-slow': 'bounce-slow 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
