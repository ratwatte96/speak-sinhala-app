import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      textColor: {
        skin: {
          base: "var(--color-text-base)",
          inverted: "var(--color-text-inverted)",
          accent: "var(--color-accent)",
          muted: "var(--color-text-muted)",
        },
      },
      backgroundColor: {
        skin: {
          base: "var(--color-fill)",
          inverted: "var(--color-text-base)",
          accent: "var(--color-accent)",
          accent20: "var(--color-accent-20)",
          muted: "var(--color-background-muted)",
        },
      },
      borderColor: {
        skin: {
          base: "var(--color-border)",
          inverted: "var(--color-text-inverted)",
          accent: "var(--color-accent)",
        },
      },
      extend: {
        fontFamily: {
          sans: ["var(--font-geist-sans)"],
          mono: ["var(--font-geist-mono)"],
        },
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-25%)" },
        },
      },
      animation: {
        bounce: "bounce 1s infinite",
        fadeIn: "fadeIn 1s ease-in-out forwards",
        fadeInDelay: "fadeIn 1s ease-in-out 1s forwards",
      },
      transitionDelay: {
        "200": "200ms",
        "400": "400ms",
      },
    },
  },
  plugins: [],
};
export default config;
