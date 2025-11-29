/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        amber: "#ecc24c",
        "slate-blue": "#487cab",
        paper: "#faf9f7",
        ink: "#1a1a1a",
        stone: "#6b6b6b",
        fog: "#e5e5e3",
        cloud: "#f2f1ef",
        error: "#c94a4a",
        success: "#4a9c6b",
        warning: "#d4915c",
      },
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
};
