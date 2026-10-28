/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        school: {
          navy: '#142D4E',
          'navy-deep': '#0B1F36',
          blue: '#2457A7',
          teal: '#168C88',
          gold: '#D6AD60',
          bg: '#F5F7FA',
          card: '#FFFFFF',
          text: '#172B3A',
          'text-muted': '#617184',
          border: '#E1E7EF',
          success: '#217A50',
          warning: '#9A650B',
          error: '#B42332',
          info: '#2457A7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Bengali', 'system-ui', 'sans-serif'],
        bengali: ['Noto Sans Bengali', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
