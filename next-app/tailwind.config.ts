import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-outfit)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        // Cool neutral surface scale — the app's canvas, never stark white/cream.
        surface: {
          50: "#F5F6F9",
          100: "#EBEDF3",
          200: "#DCDFE8",
          300: "#C2C6D6",
          400: "#9498AD",
          500: "#6B7089",
          600: "#4E5268",
          700: "#383B4D",
          800: "#242733",
          850: "#1A1C29",
          900: "#101526",
        },
        // Portfolio Navy — primary brand color, trust + stability.
        primary: {
          50: "#EEF1F7",
          100: "#DCE2EF",
          200: "#B4C0DA",
          300: "#8296BE",
          400: "#4E6394",
          500: "#2C4470",
          600: "#1F3358",
          700: "#182847",
          800: "#121E36",
          900: "#0C1526",
        },
        // Signal Gold — accent for CTAs, highlights, "premium" moments.
        accent: {
          50: "#FBF4E7",
          100: "#F6E7C7",
          200: "#EDCE8D",
          300: "#E3B559",
          400: "#D9A441",
          500: "#C28E2E",
          600: "#9E7223",
          700: "#7A581C",
          800: "#573F14",
          900: "#33250C",
        },
        // Semantic gain/loss — used for portfolio deltas, distinct from generic green/red.
        gain: {
          50: "#E8F8F1",
          100: "#C7EEDC",
          400: "#2FBB84",
          500: "#1E9E6B",
          600: "#177D55",
        },
        loss: {
          50: "#FBEAEA",
          100: "#F5CECE",
          400: "#DE5C5C",
          500: "#D14343",
          600: "#AC3232",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(16, 21, 38, 0.04), 0 8px 24px -8px rgba(31, 51, 88, 0.10)",
        "card-hover": "0 4px 8px 0 rgba(16, 21, 38, 0.06), 0 16px 32px -12px rgba(31, 51, 88, 0.18)",
        pill: "0 6px 16px -4px rgba(31, 51, 88, 0.28)",
        "gold-glow": "0 6px 20px -4px rgba(217, 164, 65, 0.45)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(217, 164, 65, 0.4)" },
          "100%": { boxShadow: "0 0 0 12px rgba(217, 164, 65, 0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "scale-in": "scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 2s linear infinite",
        "pulse-ring": "pulse-ring 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
