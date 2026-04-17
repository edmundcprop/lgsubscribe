import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lg: {
          red: "#A50034",
          "red-dark": "#7A0026",
          "red-light": "#D10046",
          ink: "#0A0A0A",
          graphite: "#1D1D1F",
          stone: "#6E6E73",
          silver: "#6E6E73",
          mist: "#F5F5F7",
          cloud: "#FBFBFD",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-display)",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Inter Tight",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        display: ["clamp(3rem, 7vw, 6.5rem)", { lineHeight: "1.03", letterSpacing: "-0.025em" }],
        headline: ["clamp(2rem, 4.5vw, 4rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        title: ["clamp(1.5rem, 2.5vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 8px 30px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 20px 60px rgba(0,0,0,0.12)",
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
