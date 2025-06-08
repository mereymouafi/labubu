/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#d4d4d4',
          300: '#a3a3a3',
          400: '#737373',
          500: '#404040',
          600: '#262626',
          700: '#171717',
          800: '#0a0a0a',
          900: '#000000',
          950: '#000000',
        },
        secondary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        accent: {
          50: '#fff9ec',
          100: '#fff2d3',
          200: '#ffe2a5',
          300: '#ffcb6b',
          400: '#ffad33',
          500: '#ff8c0a',
          600: '#ff6a00',
          700: '#cc4a03',
          800: '#a13a0c',
          900: '#82320f',
          950: '#461604',
        },
        labubumaroc: {
          red: '#d10a1f',
          black: '#000000',
          white: '#ffffff',
          gray: '#f8f8f8',
          lightgray: '#f2f2f2',
          darkgray: '#333333',
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
    },
  },
  plugins: [],
};