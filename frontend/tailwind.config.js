/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Sport-Zine design system (from DESIGN.md — Material You sport palette)
      colors: {
        'brand-lime':         '#d4ff32',  // primary-container  — neon chartreuse highlight
        'brand-lime-dim':     '#aed500',  // primary-fixed-dim  — hover / deeper lime
        'brand-olive':        '#526600',  // primary            — dark olive (text on lime)
        'brand-purple':       '#635499',  // secondary          — muted violet
        'brand-purple-light': '#e7deff',  // secondary-fixed    — lavender container
        'brand-blue':         '#1a6682',  // tertiary           — deep teal-blue
        'brand-blue-light':   '#dcf2ff',  // tertiary-container — powder blue
        'brand-cream':        '#fcf9f8',  // background         — warm paper-white
        'brand-surface':      '#f0edec',  // surface-container  — card background
        'brand-ink':          '#1c1b1b',  // on-surface         — near black
        'brand-ink-soft':     '#444934',  // on-surface-variant — muted text
        'brand-outline':      '#c5c9ad',  // outline-variant    — subtle dividers
        'brand-danger':       '#ba1a1a',  // error
        'brand-warning':      '#EEB72B',  // warning — badges, promotions
      },
      fontFamily: {
        // Epilogue: heavy-duty display for hero headlines (800/900)
        display: ['"Epilogue"',       'sans-serif'],
        // Newsreader: editorial serif italic flourish
        serif:   ['"Newsreader"',     'serif'],
        // Be Vietnam Pro: friendly approachable body copy
        sans:    ['"Be Vietnam Pro"', 'sans-serif'],
        // Space Grotesk: geometric utility layer — labels, nav, pricing
        sketch:  ['"Space Grotesk"',  'sans-serif'],
        // Kalam: handwriting scrapbook font — annotation labels on cards
        note:    ['"Kalam"',          'cursive'],
        // Permanent Marker: bold marker/brush — doodles, arrows, DIY annotations
        marker:  ['"Permanent Marker"', 'cursive'],
        // Anton: condensed sans-serif — sport buttons, bold CTAs
        anton:   ['"Anton"',            'sans-serif'],
        // Barlow Condensed: modern condensed — bold sport labels
        barlow:  ['"Barlow Condensed"', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
    },
  },
  plugins: [],
};
