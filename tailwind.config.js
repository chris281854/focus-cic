/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        'text-main-color': '#eef1f4',
        'bg-main-color': '#000910',
        'primary': '#041028',
        'secondary': '#3099FF',
        'accent': '#07ed2a',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}