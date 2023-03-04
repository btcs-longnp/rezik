module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        secondary: {
          DEFAULT: '#f8f8f2',
        },
        primary: {
          light: '#44475a',
          DEFAULT: '#282a36',
        },
      },
    },
  },
  plugins: [],
}
