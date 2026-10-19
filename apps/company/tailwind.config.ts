import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        "viz-primary": "#2563EB",
        "viz-secondary": "#3B82F6",
        "viz-navy": "#0B1F4D",
        "viz-accent": "#FBBF24",
        "viz-bg": "#FFFFFF",
        "viz-bg-2": "#F8FAFC",
        "viz-border": "#E2E8F0",
        "viz-heading": "#0F172A",
        "viz-paragraph": "#475569",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        marquee: "marquee 30s linear infinite",
        glow: "glow 2.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  daisyui: {
    themes: [
      {
        company: {
          primary: "#2563EB",
          secondary: "#3B82F6",
          accent: "#FBBF24",
          neutral: "#0B1F4D",
          "base-100": "#FFFFFF",
          "base-200": "#F8FAFC",
          info: "#3B82F6",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};

export default config;
