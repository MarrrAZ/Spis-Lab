/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B1220",
        "ink-2": "#101B2D",
        paper: "#F5F6F8",
        "paper-2": "#ECEEF2",
        maroon: "#8C1524",
        "maroon-dark": "#6E1019",
        signal: "#29E6C6",
        "signal-dim": "#1AA893",
        slate: "#48505E",
        "slate-light": "#7A8394",
        line: "#E2E5EA",
        "line-dark": "#22314A",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-dark":
          "linear-gradient(to right, rgba(41,230,198,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(41,230,198,0.07) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "36px 36px",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
        drift: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "72px 0" },
        },
      },
      animation: {
        wave1: "wave 1.6s ease-in-out infinite",
        wave2: "wave 1.9s ease-in-out infinite",
        wave3: "wave 1.3s ease-in-out infinite",
        drift: "drift 6s linear infinite",
      },
    },
  },
  plugins: [],
};
