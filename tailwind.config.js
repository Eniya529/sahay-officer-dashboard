/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy tokens — kept so existing pages don't break.
        // Retire these as each page is migrated to the new palette.
        nhaprimary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#0f172a',
        },
        // Functional risk-level colors — do NOT change, tied to SVI meaning
        svi: {
          low: '#10b981',
          moderate: '#f59e0b',
          high: '#f97316',
          critical: '#ef4444',
        },
        // New calm/trustworthy brand palette
        teal: {
          50: '#EAF5F5',
          100: '#D2E9E9',
          200: '#A8D3D3',
          300: '#7DBDBD',
          400: '#529E9E',
          500: '#2A7F7F', // Primary
          600: '#226666',
          700: '#1A4D4D',
          800: '#123333',
          900: '#0B1F1F',
        },
        sage: {
          50: '#F2F8F5',
          100: '#E1F0E7',
          300: '#B9D6C4',
          500: '#8FB9A8', // Secondary
          600: '#6FA089',
          700: '#567D6C',
        },
        lavender: {
          50: '#F5F1FE',
          100: '#EBE3FD',
          300: '#C9B7FA',
          500: '#A78BFA', // Accent
          600: '#8B6AE8',
          700: '#6D4FC4',
        },
        emergency: {
          50: '#FBEAEA',
          100: '#F6D4D4',
          300: '#EA9C9C',
          500: '#DC5A5A', // Emergency
          600: '#C13F3F',
          700: '#9B2F2F',
        },
        // Flat surface/text tokens
        canvas: '#F4FAF8',   // page background
        ink: '#24343B',      // main text
        muted: '#64748B',    // secondary text
        line: '#DDE9E5',     // borders
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}