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
        brand: {
          teal: "#2BBCBC",
          "teal-dark": "#1A9090",
          "teal-light": "#E6F7F7",
          "teal-mid": "#3DCECE",
          text: "#0D2B2B",
        },
      },
    },
  },
  plugins: [],
};
