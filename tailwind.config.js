/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // This is the crucial line
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // your existing theme extensions
    },
  },
  plugins: [],
}