import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f6f6f4',
          100: '#ece9e2',
          200: '#d8d0c3',
          300: '#b8ad9b',
          400: '#96866f',
          500: '#6e5f4c',
          600: '#534538',
          700: '#3b3127',
          800: '#221c16',
          900: '#0f0c0a'
        },
        ember: {
          100: '#fde8db',
          200: '#fccfb2',
          300: '#f7aa72',
          400: '#ef8040',
          500: '#df5f1d',
          600: '#b84a16'
        },
        moss: {
          100: '#e3f2e7',
          200: '#bfe2c8',
          300: '#88c68f',
          400: '#529c62',
          500: '#2f7040'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px rgba(0,0,0,0.35)'
      },
      backgroundImage: {
        'radial-soft': 'radial-gradient(circle at top, rgba(239, 128, 64, 0.18), transparent 42%), radial-gradient(circle at 80% 20%, rgba(82, 156, 98, 0.14), transparent 32%)'
      }
    }
  },
  plugins: []
};

export default config;
