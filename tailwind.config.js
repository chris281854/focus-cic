/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        "text-main-color": "#eef1f4",
        "bg-main-color": "#000910",
        primary: ({ opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--primary), ${opacityValue})`
          }
          return "var(--primary)"
        },
        secondary: ({ opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--secondary), ${opacityValue})`
          }
          return "var(--secondary)"
        },
        tertiary: ({ opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--tertiary), ${opacityValue})`
          }
          return "var(--tertiary)"
        },
        accent: {
          DEFAULT: "#07ed2a",
          foreground: "#07ed2a", // Asegúrate de que este color se ajuste a tus necesidades
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
