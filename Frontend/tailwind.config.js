/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        roast: {
          100: "#FFE4E1",
          200: "#F7B2AD",
          300: "#EB7A7A",
          400: "#DB524F",
          500: "#C1372E",
          600: "#9F2A23",
          700: "#7C1F1A",
          800: "#5A1512",
          900: "#390B0A",
        },
      },
    },
  },
  variants: {
    extend: {
      display: ["group-focus"] // corrected "focus-group" to "group-focus"
    }
  },
  plugins: [daisyui],
}
