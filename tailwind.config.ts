import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8f5f1',
        foreground: '#202124',
        card: '#ffffff',
        primary: {
          DEFAULT: '#2f4d4f',
          foreground: '#ffffff'
        },
        accent: {
          DEFAULT: '#9b4d45',
          foreground: '#ffffff'
        },
        muted: {
          DEFAULT: '#f1ece7',
          foreground: '#687174'
        },
        border: '#d8d1ca',
        destructive: {
          DEFAULT: '#9f2d28',
          foreground: '#ffffff'
        },
        input: '#d8d1ca',
        ring: '#2f4d4f'
      },
      borderRadius: {
        lg: '8px',
        md: '8px',
        sm: '6px'
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif'
        ]
      }
    }
  },
  plugins: []
} satisfies Config
