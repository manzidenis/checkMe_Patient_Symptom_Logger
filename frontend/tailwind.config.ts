/** @type {import('tailwindcss').Config} */
export default {
  content: ['./public/index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#2563EB',
        primaryDark: '#1E3A8A',
        primaryLight: '#3B82F6',
        success: '#16A34A',
        danger: '#DC2626',
        warning: '#F59E0B',
        background: '#F8FAFC',
      },
    },
  },
  plugins: [],
}
