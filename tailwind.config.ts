import typography from "@tailwindcss/typography";
import { brand } from "./src/common/brand";
import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";

/**
 * @type {import('tailwindcss').Config}
 */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],

  theme: {
    extend: {
      fontFamily: {
        sans: ["'Source Sans 3 Variable'", ...defaultTheme.fontFamily.sans],
        logo: ["Shadows Into"],
      },
      backgroundImage: {
        noise: "url('/media/background_noisy.webp')",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "logo-animation": {
          "0%": { filter: `drop-shadow(0 0 8px ${brand.warm}bd)` },
          "100%": { filter: `drop-shadow(0 0 15px ${brand.warm})` },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        logo: "logo-animation 2s ease infinite alternate",
      },
    },
    colors: {
      ...colors,
      black: "#111",
      bg: brand.background,
      white: "#ffffff",
      cyan: brand.accent,
      yellow: brand.warm,
      transparent: "transparent",
      current: "currentColor",
      cyangrey: brand.text,
      yellowgrey: brand.muted,
      darkgrey: "#1b2227",
    },
    container: {
      center: true,
      padding: "1rem",
    },
    screens: {
      ...defaultTheme.screens,
      "2xl": "64rem",
    },
  },

  plugins: [typography()],
};
