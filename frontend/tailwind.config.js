/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#005F6A", // Main Color
        background: "#fefdfc", // Background Color
        secondary: "#e6e6d7", // Secondary Color
        SoftMain: "#F7FFFC", // Soft Main Color
        accent: "#001F34", // Accent Color
        "main-font": "#010200", // Main Font Color
        "secondary-font": "#fefdfc", // Secondary Font Color
      },
      fontFamily: {
        sans: ["Arial", "sans-serif"], // Default Sans Font
        serif: ["Georgia", "serif"], // Default Serif Font
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
