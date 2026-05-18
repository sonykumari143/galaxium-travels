/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-dark': '#030712',
        'space-blue': '#0A1929',
        'cosmic-purple': '#6366F1',
        'nebula-pink': '#EC4899',
        'alien-green': '#10B981',
        'solar-orange': '#F59E0B',
        'star-white': '#F9FAFB',
        // Seat class specific colors
        'economy-blue': '#3B82F6',
        'economy-blue-light': '#60A5FA',
        'business-purple': '#8B5CF6',
        'business-purple-light': '#A78BFA',
        'galaxium-green': '#10B981',
        'galaxium-green-light': '#34D399',
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(to bottom, #030712, #0A1929)',
        'cosmic-gradient': 'linear-gradient(135deg, #6366F1, #EC4899)',
        // Seat class gradients
        'economy-gradient': 'linear-gradient(135deg, #3B82F6, #60A5FA)',
        'business-gradient': 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
        'galaxium-gradient': 'linear-gradient(135deg, #10B981, #34D399, #6EE7B7)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        // New animations for seat class enhancements
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-subtle': 'bounceSubtle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        // New keyframes for seat class enhancements
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(16, 185, 129, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
}

// Made with Bob
