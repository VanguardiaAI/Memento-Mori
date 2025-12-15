import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#f5f0e1",
        dark: "#1a1a1a",
        gold: "#c9a227",
        "gold-light": "#e6c84a",
        "gray-subtle": "#d4d0c5",
        "gray-dark": "#8a8578",
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        body: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.3em",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fill-week": "fillWeek 0.3s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fillWeek: {
          "0%": { backgroundColor: "transparent" },
          "100%": { backgroundColor: "#1a1a1a" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
