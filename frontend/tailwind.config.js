/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        comic: ['Bangers', 'cursive'],
        handwriting: ['Kalam', 'cursive'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'comic': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'comic-dark': '4px 4px 0px 0px rgba(234, 179, 8, 0.8)',
        'comic-lg': '8px 8px 0px 0px rgba(0, 0, 0, 1)',
        'comic-sm': '2px 2px 0px 0px rgba(0, 0, 0, 1)',
        'comic-sm-dark': '2px 2px 0px 0px rgba(255, 255, 255, 0.4)',
        'comic-hover': '6px 6px 0px 0px rgba(0, 0, 0, 1)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
