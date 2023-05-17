module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
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
        comment: '#6272a4',
      },
    },
  },
  plugins: [],
}
