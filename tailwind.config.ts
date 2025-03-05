import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'grey-clarito': 'rgb(73 73 85)', 
        'azul-oscuro': 'rgb(51 65 85)',
        'Azul':'#20284D',
        
      },
    },
  },
  plugins: [],
} satisfies Config;
