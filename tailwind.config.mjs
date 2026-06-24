/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a', // Deep Blue for headers
        secondary: '#db2777', // Pink for accents
        tableHead: '#1e40af', // Blue for table headers
        tableHeadAlt: '#0f766e', // Teal for alternate headers
        highlight: '#facc15', // Yellow for highlights
        success: '#16a34a', // Green for Apply links
        danger: '#dc2626', // Red for notification links
        background: '#f8fafc',
        card: '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
