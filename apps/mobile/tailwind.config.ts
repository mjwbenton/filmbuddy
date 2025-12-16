import type { Config } from "tailwindcss";
import { colors } from "./src/theme/colors";

// Transform camelCase to kebab-case for Tailwind
const tailwindColors = Object.fromEntries(
  Object.entries(colors).map(([key, value]) => [
    key.replace(/([A-Z])/g, "-$1").toLowerCase(),
    value,
  ]),
);

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: tailwindColors,
      fontFamily: {
        heading: ["Jost_600SemiBold"],
        "heading-medium": ["Jost_500Medium"],
        "heading-regular": ["Jost_400Regular"],
        body: ["System"],
      },
      fontSize: {
        display: "32px",
        heading: "24px",
        subheading: "18px",
        body: "16px",
        caption: "14px",
        small: "12px",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 2px 8px rgba(0,0,0,0.08)",
        lg: "0 4px 16px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;
