/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        physio: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488', // Primary Soft Teal
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        ice: {
          50: '#F8FAFC',
          100: '#F0F4F8', // Light Blue Accent
          200: '#E2E8F0',
          300: '#CBD5E1',
        },
        lavender: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          500: '#8B5CF6',
        },
        slateText: '#0F172A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
