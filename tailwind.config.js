/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Tailwind가 사용할 파일 경로 설정
  ],
  theme: {
    extend: {
      keyframes: {
        slideDown: {
          "0%": { opacity: 0, transform: "translateY(-10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: 1, transform: "translateY(0)" },
          "100%": { opacity: 0, transform: "translateY(-10px)" },
        },
      },
      animation: {
        slideDown: "slideDown 0.3s ease-out",
        slideUp: "slideUp 0.3s ease-in",
      },
    },
  },
  plugins: [],
};
