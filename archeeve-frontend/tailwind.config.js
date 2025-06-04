/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme'); 

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        'cheese-yellow': '#FFD84D', // atau #FFC107
        'primary-text': '#262626',  // Abu-abu gelap untuk teks utama
        'secondary-text': '#8E8E8E',// Abu-abu lebih terang untuk teks sekunder
        'light-gray': '#F3F4F6',   // Abu-abu sangat muda untuk hover atau border (Tailwind gray-100)
                                    // atau '#EEEEEE' jika Anda lebih suka warna custom
      },
      fontFamily:{
        sans: ['Nunito', ...defaultTheme.fontFamily.sans], 
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'), 
  ],
}