import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0e0e0e",
        surface: {
          DEFAULT: "#0e0e0e",
          low: "#131313",
          high: "#1a1919",
          highest: "#262626",
          bright: "#2c2c2c",
        },
        primary: {
          DEFAULT: "#88adff",
          container: "#719eff",
          dim: "#0f6ef0",
        },
        secondary: {
          DEFAULT: "#ac8aff",
          container: "#5516be",
        },
        tertiary: {
          DEFAULT: "#8ff5ff",
          container: "#00eefc",
        },
        accent: {
          blue: "#2E7DFF",
          purple: "#8B5CF6",
          cyan: "#00F0FF",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        headline: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "3rem",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
