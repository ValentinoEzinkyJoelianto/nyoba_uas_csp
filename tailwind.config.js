/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",      // <--- Wajib ada
    "./components/**/*.{js,ts,jsx,tsx}", // <--- Wajib ada
    "./src/**/*.{js,ts,jsx,tsx}",        // Jaga-jaga kalau pakai folder src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}