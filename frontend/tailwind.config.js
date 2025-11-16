/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette sobre et minimaliste inspirée du template mobile
        cream: '#FFE9D0',      // Fond principal (beige clair)
        taupe: '#C4BCB0',      // Éléments secondaires (gris taupe)
        darkgray: '#2D2D2D',   // Texte principal
        mediumgray: '#6B6B6B', // Texte secondaire
        lightgray: '#D9D9D9',  // Bordures légères
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

