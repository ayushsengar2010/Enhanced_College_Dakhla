/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // --- Public Portal Theme ---
        navy: {
          DEFAULT: "#08162d",   // Deep Corporate Navy – hero, headers, footers
          card: "#0f2343",      // Card / Secondary Navy – inner cards, gradients
          50:  "#f2f5fa",
          100: "#e3eaf4",
          200: "#c8d5e8",
          300: "#9fb5d5",
          400: "#6e91bc",
          500: "#4a70a5",
          600: "#375888",
          700: "#2a4470",
          800: "#1a2e50",
          900: "#0f2343",
        },
        amber: {
          DEFAULT: "#e28a00",   // Accent Golden Amber – CTA buttons, highlights
          hover:   "#c67900",   // Amber Hover State
          50:  "#fff8ec",
          100: "#ffefd0",
          200: "#ffd98f",
          300: "#ffbd4d",
          400: "#ffa01a",
          500: "#e28a00",
          600: "#c67900",
          700: "#a36000",
          800: "#7a4800",
          900: "#523000",
        },
        // --- Admin Panel Theme ---
        admin: {
          DEFAULT: "#bc8041",   // Admin Active Accent Brown
          hover:   "#a56f34",   // Admin Hover Brown
        },
        ochre: "#bc8041",       // Alias for admin brown (used in some components)
        // --- Helper / Utility ---
        accent: "#1d4ed8",       // Standard Accent Blue – helper badges
        mist: "#f8fafc",         // Soft Page Background
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow:   "0 12px 28px rgba(8, 22, 45, 0.12)",
        amber:  "0 6px 20px rgba(226, 138, 0, 0.30)",
        card:   "0 4px 16px rgba(8, 22, 45, 0.08)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #08162d 0%, #0f2343 100%)",
        "footer-gradient": "linear-gradient(135deg, #08162d 0%, #0f2343 100%)",
      },
    },
  },
  plugins: [],
};
