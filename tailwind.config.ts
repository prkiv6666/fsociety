import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#050506",
          900: "#0a0a0c",
          850: "#0e0e11",
          800: "#131316",
          700: "#1b1b20",
        },
        neon: {
          DEFAULT: "#ff1e3c",
          bright: "#ff3b56",
          soft: "#ff6076",
          deep: "#c10026",
          ember: "#ff5a1f",
        },
      },
      fontFamily: {
        gothic: ["var(--font-gothic)", "serif"],
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        "neon-sm": "0 0 10px rgba(255,30,60,0.22)",
        neon: "0 0 22px rgba(255,30,60,0.30)",
        "neon-lg": "0 0 40px rgba(255,30,60,0.40)",
        "inset-line": "inset 0 1px 0 0 rgba(255,255,255,0.05)",
      },
      keyframes: {
        floatY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-22px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.08)" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        flicker: {
          "0%, 19%, 21%, 23%, 80%, 100%": { opacity: "1" },
          "20%, 22%, 82%": { opacity: "0.65" },
        },
        sheen: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        floatY: "floatY 9s ease-in-out infinite",
        pulseGlow: "pulseGlow 7s ease-in-out infinite",
        gradientX: "gradientX 8s ease infinite",
        flicker: "flicker 4.5s linear infinite",
        sheen: "sheen 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
