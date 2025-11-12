/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': 'var(--bg-primary)',
        'dark-card': 'var(--bg-card)',
        'dark-sidebar': 'var(--bg-sidebar)',
        'dark-hover': 'var(--bg-hover)',
        'light-bg': 'var(--bg-primary)',
        'light-card': 'var(--bg-card)',
        'light-sidebar': 'var(--bg-sidebar)',
        'light-hover': 'var(--bg-hover)',
      },
      textColor: {
        'primary': 'var(--text-primary)',
        'secondary': 'var(--text-secondary)',
      },
      borderColor: {
        'default': 'var(--border-color)',
      }
    },
  },
  plugins: [],
}
