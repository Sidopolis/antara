/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",
        foreground: "#f8fafc",
        primary: "#3b82f6",
        secondary: "#1e293b",
        accent: "#10b981",
        muted: "#94a3b8"
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      animation: {
        "shimmer": "shimmer 2s linear infinite",
        "fade-in-up": "fadeInUp 0.5s ease-out",
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    },
  },
  plugins: [],
}
