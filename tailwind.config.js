/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#060B18',
          900: '#0B1120',
          800: '#111827',
          700: '#1E293B',
          600: '#334155',
        },
        brand: {
          teal:   '#0ABFBC',
          orange: '#F97316',
          green:  '#22C55E',
          amber:  '#FBBF24',
        },
      },
      boxShadow: {
        card:   '0 4px 24px rgba(0,0,0,0.25)',
        glow:   '0 0 20px rgba(10,191,188,0.3)',
        orange: '0 4px 20px rgba(249,115,22,0.4)',
      },
    },
  },
  plugins: [],
}

