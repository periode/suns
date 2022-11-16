/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'serif' : ['UntitledSerif', 'serif'],
        'mono' : ['IBMPlexMono', 'monospace' , 'mono']
      },
      keyframes: {
        fadeintop : {
          '0%' : {
            transform: 'translateY(-50px)',
            opacity: '0'
          },
          '100%' : {
            transform: 'translateY(0)',
            opacity: '1'
          }
        }
      },
      animation: {
        fadeintop : 'fade-in-top 0.3s ease-in both'
      },
    },
  },
};