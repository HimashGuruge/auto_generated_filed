/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        flameOrange: '#ff4500',
      },
      keyframes: {
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
            opacity: '1',
            filter: 'drop-shadow(0 0 6px #ff4c00) drop-shadow(0 0 15px #ff6400)',
          },
          '20%, 22%, 24%, 55%': {
            opacity: '0.8',
            filter: 'drop-shadow(0 0 3px #ff7a00) drop-shadow(0 0 7px #ff7a00)',
          },
        },
      },
      animation: {
        flicker: 'flicker 1.5s infinite',
      },
    },
  },
  plugins: [],
}
