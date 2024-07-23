/** @type {import('tailwindcss').Config} */
module.exports= {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px #f9ff86, 0 0 10px #f9ff86, 0 0 20px #f9ff86' },
          '50%': { boxShadow: '0 0 15px #f9ff86, 0 0 20px #f9ff86, 0 0 30px #f9ff86' },
        },
      },
      animation: {
        glow: 'glow 2s infinite',
      },
    },
  },
  plugins: [],
}

