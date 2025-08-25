/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },

        /* === Primary mapped to auto-derived shades === */
        primary: {
          50:  'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
          DEFAULT: 'var(--primary-500)',
          foreground: 'var(--primary-foreground)',
        },

        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },

        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',

        chart: {
          1: 'var(--chart-1)',
          2: 'var(--chart-2)',
          3: 'var(--chart-3)',
          4: 'var(--chart-4)',
          5: 'var(--chart-5)',
        },

        sidebar: {
          DEFAULT: 'var(--sidebar-background)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },

        /* (optional) futuristic + orb + dashboard colors remain as your project defines */
        'channel-header': {
          DEFAULT: 'var(--channel-header)',
          foreground: 'var(--channel-header-foreground)',
        },
        'performance-bg': {
          1: 'var(--performance-bg-1)',
          2: 'var(--performance-bg-2)',
          3: 'var(--performance-bg-3)',
          4: 'var(--performance-bg-4)',
          5: 'var(--performance-bg-5)',
          6: 'var(--performance-bg-6)',
          7: 'var(--performance-bg-7)',
          8: 'var(--performance-bg-8)',
        },

        'dsqr-warning': 'var(--dsqr-warning)',
        'dsqr-warning-foreground': 'var(--dsqr-warning-foreground)',
      },

      boxShadow: {
        realistic: 'var(--shadow-realistic)',
        'realistic-lg': 'var(--shadow-realistic-lg)',
        'realistic-xl': 'var(--shadow-realistic-xl)',
      },

      backgroundImage: {
        'futuristic-gradient': 'var(--gradient-primary)',
        'futuristic-hover': 'var(--gradient-hover)',
        'futuristic-text': 'var(--gradient-text)',
      },

      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};