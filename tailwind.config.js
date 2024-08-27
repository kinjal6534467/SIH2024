/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Adjust paths according to your project structure
    './public/index.html',
  ],
  theme: {
    extend: {
      // Custom configurations if needed
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Include if needed
  ],
}


