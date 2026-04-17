/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: '#1E3A5F',
        teacher: '#1B4D3E',
        student: '#3D2B6B'
      }
    },
  },
  plugins: [],
}
