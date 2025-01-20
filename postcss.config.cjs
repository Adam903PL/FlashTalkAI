/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonGreen: '#39FF14',
        neonBlue: '#1F51FF',
        neonPink: '#FF1F9A',
      },
    },
  },
  plugins: [],
}