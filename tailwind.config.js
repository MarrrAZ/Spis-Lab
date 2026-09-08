/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SPIS official blue, sampled from the real logo asset
        spis: {
          DEFAULT: "#0F2C66",
          deep: "#0B2050",
          bright: "#2557C7",
          mid: "#173768",
          soft: "#E8EEF9",
        },
        ink: "#12151C",
        paper: "#FFFFFF",
        "paper-2": "#F7F8FA",
        "paper-3": "#EDEFF3",
        maroon: "#C23B3B",
        slate: "#48505E",
        "slate-light": "#7A8496",
        line: "#E4E7EC",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        wave: {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        wave1: "wave 1.6s ease-in-out infinite",
        wave2: "wave 1.9s ease-in-out infinite",
        wave3: "wave 1.3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
