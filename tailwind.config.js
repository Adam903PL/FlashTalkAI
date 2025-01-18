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
        'neon-blue': '0 0 10px #00f0ff, 0 0 20px #00f0ff',
        'neon-pink': '0 0 10px #ff00e6, 0 0 20px #ff00e6',
        'neon-green': '0 0 10px #00ff87, 0 0 20px #00ff87',
        'neon-yellow': '0 0 10px #ffeb3b, 0 0 20px #ffeb3b',
      },
    },
  },
  plugins: [],
}