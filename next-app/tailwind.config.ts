import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#e6e8f5",
          100: "#c3c8e6",
          200: "#94a0cf",
          300: "#6573b3",
          400: "#4a5aa6",
          500: "#33418a",
          600: "#273269",
          700: "#1d2652",
          800: "#14193c",
          900: "#0d1028",
          950: "#070a17",
        },
        gold: {
          50: "#fdf8e8",
          100: "#f9ecc6",
          200: "#f2d68a",
          300: "#ebbd52",
          400: "#e0a523",
          500: "#c98f1b",
          600: "#a47516",
          700: "#805a12",
          800: "#5f420e",
          900: "#3e2c0a",
          950: "#1d1404",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
