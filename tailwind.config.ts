import type { Config } from 'tailwindcss'

const config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gh: {
          accent: '#EC4899',
          accentFg: '#ffffff',
          ink: '#111827',
          bg: '#ffffff',
          muted: '#6B7280',
          accentSoft: '#FBCFE8',
          accentHover: '#DB2777',
          accentRing: '#FDA4AF'
        }
      },
      ringColor: {
        DEFAULT: '#FDA4AF'
      }
    }
  },
  plugins: []
} satisfies Config

export default config
