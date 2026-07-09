import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A0E1A',
        secondary: '#111827',
        card: '#1A2035',
        hover: '#243047',
        border: '#2D3A52',
        'text-primary': '#F8FAFC',
        'text-secondary': '#94A3B8',
        'text-tertiary': '#64748B',
        blue: '#3B82F6',
        cyan: '#06B6D4',
        green: '#10B981',
        amber: '#F59E0B',
        red: '#EF4444',
        purple: '#8B5CF6',
        // Aliases for pages using accent- prefix
        'accent-blue': '#3B82F6',
        'accent-cyan': '#06B6D4',
        'accent-green': '#10B981',
        'accent-amber': '#F59E0B',
        'accent-red': '#EF4444',
        'accent-purple': '#8B5CF6',
        // Aliases for pages using bg- prefix on color names
        'bg-primary': '#0A0E1A',
        'bg-secondary': '#111827',
        'bg-card': '#1A2035',
        'bg-hover': '#243047',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '8px',
        btn: '6px',
        input: '4px',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-green', 'bg-green/10', 'bg-green/20', 'bg-green/30', 'bg-green/40',
    'bg-red', 'bg-red/10', 'bg-red/20', 'bg-red/30', 'bg-red/40',
    'border-green', 'border-green/40', 'border-green/60', 'border-green/70',
    'border-red', 'border-red/40', 'border-red/60', 'border-red/70',
    'text-green', 'text-red',
    'ring-green/40', 'ring-red/40',
  ],
};

export default config;
