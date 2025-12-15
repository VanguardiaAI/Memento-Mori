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
        dark: "#5c564a",        // Gris cálido más suave (antes #1a1a1a)
        gold: "#b8973f",        // Dorado más suave
        "gold-light": "#d4b85c",
        "gray-subtle": "#d4d0c5",
        "gray-dark": "#9a958a",  // Gris más claro
        "gray-light": "#c4bfb4", // Nuevo: gris claro para animación inicial
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
          "0%": { backgroundColor: "#c4bfb4" },
          "100%": { backgroundColor: "#5c564a" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
