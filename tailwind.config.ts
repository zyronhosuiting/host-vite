import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lime: '#c5ff3f',
        'lime-soft': '#f0ffcc',
        slate: '#111827',
        'slate-mid': '#1f2937',
        'off-white': '#f7f7f7',
        border: '#dddddd',
        'border-dark': '#b0b0b0',
        success: '#22c55e',
        error: '#ef4444',
        t1: '#222222',
        t2: '#484848',
        t3: '#717171',
        t4: '#b0b0b0',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        xs: '11px',
        sm: '13px',
        md: '15px',
        lg: '18px',
        xl: '22px',
        '2xl': '28px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        pill: '9999px',
      },
      boxShadow: {
        sm: '0 1px 4px rgba(0,0,0,.1)',
        md: '0 4px 16px rgba(0,0,0,.12)',
        lg: '0 8px 32px rgba(0,0,0,.16)',
      },
      maxWidth: {
        layout: '1440px',
      },
    },
  },
  plugins: [],
} satisfies Config;
