/** @type {import('tailwindcss').Config} */
module.exports= {
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
    
    // colors:{
    //   'dark-navy' : '#656923',
    //   'light-navy':'#a9aa88',
    // },
  },
  plugins: [
    function({addUtilities}){
      const newUtil = {
        '.scrollbar-thin':{
          scrollbarWidth:"thin",
          scrollbarColor:"rgb(31 29 29) black"
        },
        '.scrollbar-webkit':{
          "&::-webkit-scrollbar":{
            width:"8px"
          },
          "&::-webkit-scrollbar-track":{
            background:"white"
          },
          "&::-webkit-scrollbar-thumb":{
            backgroundColor:"rgb(31 41 55)",
            borderRadius:"20px",
            border:"1px solid black"
          }
        }
      }
      addUtilities(newUtil,['responsive','hover']); 
    }
  ],
}

