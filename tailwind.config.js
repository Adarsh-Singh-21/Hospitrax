/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1a1a1a',
        'dark-card': '#2d2d2d',
        'dark-sidebar': '#1f1f1f',
        'dark-hover': '#3a3a3a',
      }
    },
  },
  plugins: [],
}
