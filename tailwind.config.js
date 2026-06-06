/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f4',
          100: '#e0ede4',
          200: '#c4dbc9',
          300: '#9bbf9f',
          400: '#6fa075',
          500: '#4A7C59',
          600: '#3a6347',
          700: '#2D4A3E',
          800: '#253d33',
          900: '#1f332b',
        },
        moss: {
          100: '#e8f0e9',
          200: '#d1e1d3',
          300: '#8FB996',
          400: '#6b9e72',
        },
        cream: {
          50: '#FDFCFA',
          100: '#F7F5F0',
          200: '#EFEBE3',
        },
        wood: {
          100: '#F5F0E8',
          200: '#E8DFD0',
          300: '#D4C4A8',
          400: '#C4A77D',
        },
        water: {
          300: '#B8D4C8',
          400: '#7EB5A6',
          500: '#5A9B8A',
        },
        leaf: {
          light: '#A8C6A8',
          DEFAULT: '#7DA87D',
          dark: '#5E8A5E',
        }
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'ripple': 'ripple 0.6s ease-out',
        'drop': 'drop 0.8s ease-in forwards',
        'grow': 'grow 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        drop: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(40px)', opacity: '0' },
        },
        grow: {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
