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
        dark: {
          app: '#080D1B',
          sidebar: '#0B1120',
          content: '#0E1527',
          card: '#141E33',
          elevated: '#192640',
          input: '#101A2D',
          border: 'rgba(166, 184, 225, 0.16)',
          borderSubtle: 'rgba(166, 184, 225, 0.12)',
          borderBright: 'rgba(120, 101, 255, 0.35)',
        },
        studio: {
          violet: '#7865FF',
          'violet-hover': '#9182FF',
          blue: '#4285FF',
          cyan: '#35D9E8',
          teal: '#32D6A0',
          warning: '#FFC56E',
          error: '#FF728A',
        },
        text: {
          main: '#F4F6FF',
          secondary: '#B5C0D6',
          muted: '#8D9AB5',
        },
        midnight: '#080D1B',
        'indigo-deep': '#141E33',
        'violet-electric': '#7865FF',
        'blue-bright': '#4285FF',
        'cyan-accent': '#35D9E8',
        ivory: '#FAF9F6',
        canvas: '#0E1527',
        'text-primary': '#F4F6FF',
        'text-secondary': '#B5C0D6',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'dark-subtle': '0 2px 8px -2px rgba(0, 0, 0, 0.4), 0 1px 4px -1px rgba(0, 0, 0, 0.3)',
        'dark-card': '0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(166, 184, 225, 0.12)',
        'dark-hover': '0 18px 40px -12px rgba(0, 0, 0, 0.7), 0 0 15px -3px rgba(120, 101, 255, 0.25)',
        'glow-violet': '0 0 25px -4px rgba(120, 101, 255, 0.45)',
        'glow-cyan': '0 0 25px -4px rgba(53, 217, 232, 0.4)',
        'glow-blue': '0 0 25px -4px rgba(66, 133, 255, 0.4)',
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
        'premium': '0 10px 25px -5px rgba(120, 101, 255, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(120, 101, 255, 0.15)',
      }
    },
  },
  plugins: [],
}
