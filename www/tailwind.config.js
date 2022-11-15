/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'serif' : ['UntitledSerif', 'serif'],
        'mono' : ['IBMPlexMono', 'monospace' , 'mono']
      }
    },
  },
  plugins: [],
};