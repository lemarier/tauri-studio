module.exports = {
  mode: 'jit',
  purge: {
    enabled: false,
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
  },
  darkMode: false,
  whitelistPatternsChildren: [/monaco-editor/],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
