/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'mobile':{'max':'480px'},

      'tablet': {'max':'640px'},

      'biggerTablet':{'max':'840px'}
    },
    extend: {},
  },
  plugins: [],
}

