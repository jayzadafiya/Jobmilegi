/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d7ff",
          300: "#a5baff",
          400: "#8195ff",
          500: "#5b6fff",
          600: "#3b4aff",
          700: "#2938ff",
          800: "#1c2bdf",
          900: "#0a1a44",
          950: "#0a1538",
        },
        accent: {
          50: "#f0fdf9",
          100: "#ccfdf3",
          200: "#99f9e8",
          300: "#5cefd8",
          400: "#4FE06A",
          500: "#10d9b4",
          600: "#05b397",
          700: "#04957a",
          800: "#087662",
          900: "#0c6152",
          950: "#013832",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
