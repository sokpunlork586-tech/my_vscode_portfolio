import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vscode: {
          bgDark: "#21252b",
          bgMid: "#282c34",
          bgLight: "#333842",
          bgHover: "#2c313a",
          inputBg: "#1b1d23",
          border: "#181a1f",
          borderLight: "#3a3f4b",
          textLight: "#abb2bf",
          textWhite: "#f3f3f3",
          textMid: "#c2c2c2",
          textDark: "#909295",
          blue: "#61afef",
          blueAccent: "#42a5f5",
          blueActive: "#528bff",
          green: "#98c379",
          red: "#e06c75",
          yellow: "#e5c07b",
          purple: "#c678dd",
          cyan: "#56b6c2",
          orange: "#d19a66",
        },
      },
      fontFamily: {
        mono: ["Consolas", "'Fira Code'", "'Courier New'", "monospace"],
      },
      transitionTimingFunction: {
        ide: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        pageFadeIn: {
          "0%": { opacity: "0.75", transform: "translateY(3px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        modalFadeIn: {
          "0%": { opacity: "0", transform: "scale(0.96) translateY(-4px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        backdropFadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pageFadeIn: "pageFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        modalFadeIn: "modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        backdropFadeIn: "backdropFadeIn 0.15s ease-out forwards",
        slideDown: "slideDown 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
