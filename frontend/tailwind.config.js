/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  screens: {
    'mobile': { 'max': '480px' },
    'tablet': { 'max': '640px' },

    'xxxs': '360px',    
    'xxs': '420px',    
    'xs': '490px',    
    'sm': '640px',    
    '2_sm': '700px', 
    'md': '768px', 
    '1_5md':'830px',   
    '2_md':'920px',   
    'lg': '1024px', 
     '1_5lg': '1150px',
    'xl': '1280px',   
    '1_5xl': '1430px',
    '2xl': '1536px', 
    '3xl': '1600px',
    'biggerTablet': { 'max': '840px' }
  },
  extend: {
    keyframes: {
      glow: {
        '0%, 100%': { boxShadow: '0 0 5px #f9ff86, 0 0 10px #f9ff86, 0 0 20px #f9ff86' },
        '50%': { boxShadow: '0 0 15px #f9ff86, 0 0 20px #f9ff86, 0 0 30px #f9ff86' },
      },
    },
    transitionDuration: {
      '400': '400ms', // 2 seconds
    },
    animation: {
      glow: 'glow 2s infinite',
    },
  },
  // colors:{
  //   'dark-navy' : '#656923',
  //   'light-navy':'#a9aa88',
  // },
};
export const plugins = [
  function ({ addUtilities }) {
    const newUtil = {
      '.scrollbar-thin': {
        scrollbarWidth: "thin",
        scrollbarColor: "rgb(31 29 29) black"
      },
      '.scrollbar-webkit': {
        "&::-webkit-scrollbar": {
          width: "8px"
        },
        "&::-webkit-scrollbar-track": {
          background: "white"
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgb(31 41 55)",
          borderRadius: "20px",
          border: "1px solid black"
        }
      }
    };
    addUtilities(newUtil, ['responsive', 'hover']);
  }
];
