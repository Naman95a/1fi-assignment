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
        brand: {
          50: "#f3f0ff",
          100: "#e9e5ff",
          200: "#d5ccff",
          300: "#b5a3ff",
          400: "#926eff",
          500: "#7338ff",
          600: "#5830E0", // 1Fi core signature purple
          700: "#4f1bc9",
          800: "#4216a7",
          900: "#371487",
          950: "#1f0957",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
