import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#07090a", // page background (near-black)
        panel: "#0d1214", // cards / windows
        raised: "#141b1e", // inputs, hover
        line: "#1f2a2e", // borders
        ink: "#d8e4df", // main text
        muted: "#7f908a", // secondary text
        accent: "#39ff14", // the ONE neon accent color
        danger: "#ff5c6c", // wrong answers only
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
