/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand
        primary: {
          DEFAULT: '#2563EB',
          50: '#EFF4FF',
          100: '#DBE6FE',
          600: '#1D4ED8',
          700: '#1E40AF',
        },
        navy: {
          DEFAULT: '#0B1A4A',
          deep: '#060E36',
        },
        // Surfaces
        surface: {
          dark: '#1E2533',
        },
        // App background canvas
        canvas: '#F1F3F6',
        // Semantic
        success: '#10B981',
        warning: '#F97316',
        danger: '#EF4444',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        card: '0 12px 30px -12px rgba(37, 99, 235, 0.45)',
        focus: '0 0 0 3px rgba(16, 185, 129, 0.16)',
        error: '0 0 0 3px rgba(239, 68, 68, 0.16)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}
