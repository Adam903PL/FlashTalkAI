export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00f0ff',
        'neon-pink': '#ff00e6',
        'neon-green': '#00ff87',
        'neon-yellow': '#ffeb3b',
      },
      boxShadow: {
        'glow-green': '0 0 10px rgba(0, 255, 0, 0.8), 0 0 20px rgba(0, 255, 0, 0.6)',
        'glow-red': '0 0 10px rgba(255, 0, 0, 0.8), 0 0 20px rgba(255, 0, 0, 0.6)',
      },
      animation: {
        'glow-green': 'glow-green 4s ease-in-out infinite',
        'glow-red': 'glow-red 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
