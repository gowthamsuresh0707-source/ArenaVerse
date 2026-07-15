/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "#0B1020",
        primary: "#7C3AED",
        secondary: "#00E5FF",
        accent: "#FF3D71",
      },
    },
  },
  plugins: [],
}
