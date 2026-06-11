/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./App.jsx"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C2D099',
        secondary: '#DCE8B9',
        dark: '#000000',
      },
    },
  },
  plugins: [],
};
