/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif'],
      },
      colors: {
        gold: '#C9A84C',
        'gold-light': '#F0DFA0',
        'gold-dark': '#8B6914',
        cream: '#FAF7F2',
        ink: '#1A1410',
        muted: '#6B5E4E',
      },
    },
  },
  plugins: [],
}
