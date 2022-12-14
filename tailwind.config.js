module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
   darkMode: false, // or 'media' or 'class'
   theme: {
     extend: {
      width: {
        '100': '39rem',
        '200': '50rem'
      }

     },
   },
   variants: {
     extend: {},
   },
   plugins: [],
 }