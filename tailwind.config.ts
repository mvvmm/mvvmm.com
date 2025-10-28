import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "600px",
      },
      gridTemplateColumns: {
        "auto-fit-300": "repeat(auto-fit, minmax(300px, 1fr))",
        "auto-fit-600": "repeat(auto-fit, minmax(600px, 1fr))",
        "auto-fit-640": "repeat(auto-fit, minmax(640px, 1fr))",
        "auto-fit-full": "repeat(auto-fit, minmax(0px, 1fr))",
      },
    },
  },
} satisfies Config;
