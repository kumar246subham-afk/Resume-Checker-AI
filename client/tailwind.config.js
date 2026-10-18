/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#111827',
          800: '#1F2937',
          700: '#374151'
        },
        violet: {
          500: '#6D5EF7',
          600: '#5A4BE0',
          700: '#4839C7',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE'
        },
        surface: {
          light: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          muted: '#64748B'
        },
        teal: {
          accent: '#14B8A6',
          light: '#F0FDFA'
        },
        status: {
          success: '#16A34A',
          warning: '#D97706',
          error: '#DC2626'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'premium': '0 10px 25px -5px rgba(109, 94, 247, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)'
      }
    },
  },
  plugins: [],
}
