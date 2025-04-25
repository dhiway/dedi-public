/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        text: "var(--color-text)",
        secondary: "var(--color-secondary)",
        input: "var(--color-input)",
        cardTitle: "var(--card-title-color)",
        cardTitleHover: "var(--card-title-hover)",
        cardDescription: "var(--card-description-color)",
        cardStats: "var(--card-stats-color)",
        cardStatsNumber: "var(--card-stats-number-color)",
      },
      fontFamily: {
        sans: ["Source Sans 3", "sans-serif"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
} 