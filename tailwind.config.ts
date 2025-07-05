import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: { sm: "400px", md: "700px", xlg: "950px", lg: "1200px" },
    fontFamily: {
      jost: "Jost, sans-serif",
      roboto: "Roboto, sans-serif",
    },
    listStyleType: {
      square: "square",
      disc: "disc",
    },
    extend: {
      colors: {
        black: "#131118",
        grey: "#A4A1AA",
        errorRed: "#E54D51",
        "blue-primary": "#4B6BFB",
      },
    },
  },
  plugins: [],
} satisfies Config;
