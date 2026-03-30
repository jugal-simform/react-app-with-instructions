/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "task-todo": "#3b82f6",
        "task-progress": "#f59e0b",
        "task-done": "#10b981",
      },
      animation: {
        "skeleton-loading": "skeleton-loading 1.5s infinite",
      },
      keyframes: {
        "skeleton-loading": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
}
