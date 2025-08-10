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
      quicksand: "Quicksand, sans-serif",
    },
    listStyleType: {
      square: "square",
      disc: "disc",
    },
    extend: {
      colors: {
        teal: "#008080",
      },
    },
  },
  plugins: [],
} satisfies Config;
