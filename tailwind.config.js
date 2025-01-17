module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(148deg, rgba(237,178,71,0.8464635854341737) 0%, rgba(245,187,94,0.8436624649859944) 35%, rgba(239,112,255,0.8688725490196079) 100%)',
        'customdark-gradient': ' linear-gradient(148deg, rgba(3,3,3,1) 4%, rgba(0,0,0,1) 44%, rgba(119,5,133,1) 74%)',

      },
      
    },
  },
  plugins: [],
};
