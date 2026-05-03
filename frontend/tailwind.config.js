/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // "brand-" prefix avoids collision with Tailwind's built-in purple/blue palettes
      // Tiền tố "brand-" tránh xung đột với bảng màu purple/blue có sẵn của Tailwind
      colors: {
        'brand-lime':   '#C8FF00',
        'brand-purple': '#9B5CF6',
        'brand-blue':   '#38BCFF',
        'brand-cream':  '#F8F8F4',
        'brand-ink':    '#0A0A0A',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        sketch:  ['"Caveat"', 'cursive'],
        sans:    ['"Space Grotesk"', 'sans-serif'],
      },
      // Custom keyframe for the horizontal marquee ticker
      // Keyframe tùy chỉnh cho ticker cuộn ngang
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        // duration: 25s, linear = constant speed, infinite loop
        // thời gian: 25s, linear = tốc độ không đổi, lặp vô hạn
        marquee: 'marquee 25s linear infinite',
      },
    },
  },
  plugins: [],
};
