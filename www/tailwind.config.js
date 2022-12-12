/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'serif' : ['UntitledSerif', 'serif'],
        'mono' : ['IBMPlexMono', 'monospace' , 'mono']
      },
      animation: {
        fadeintop: 'fadeintop 500ms ease-in-out',
        slowspin: 'spin 4s linear infinite'
      },
      keyframes: {
        fadeintop : {
          '0%' : {
            opacity: '0',
            transform: 'translateY(-100%)',
          },
          '100%' : {
            opacity: '1',
            transform: 'translateY(0)',
          }
        }
      },
    },
  },
};