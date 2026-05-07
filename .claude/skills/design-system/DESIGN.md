---
name: Sport-Zine Aesthetic
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444934'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#757961'
  outline-variant: '#c5c9ad'
  surface-tint: '#526600'
  primary: '#526600'
  on-primary: '#ffffff'
  primary-container: '#d4ff32'
  on-primary-container: '#5e7400'
  inverse-primary: '#aed500'
  secondary: '#635499'
  on-secondary: '#ffffff'
  secondary-container: '#c2b1fe'
  on-secondary-container: '#4f4084'
  tertiary: '#1a6682'
  on-tertiary: '#ffffff'
  tertiary-container: '#dcf2ff'
  on-tertiary-container: '#2d7391'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c8f322'
  primary-fixed-dim: '#aed500'
  on-primary-fixed: '#171e00'
  on-primary-fixed-variant: '#3d4d00'
  secondary-fixed: '#e7deff'
  secondary-fixed-dim: '#ccbdff'
  on-secondary-fixed: '#1f0b52'
  on-secondary-fixed-variant: '#4b3c7f'
  tertiary-fixed: '#bfe8ff'
  tertiary-fixed-dim: '#8ecff0'
  on-tertiary-fixed: '#001f2b'
  on-tertiary-fixed-variant: '#004d66'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-hero:
    fontFamily: Epilogue
    fontSize: 120px
    fontWeight: '800'
    lineHeight: 100%
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Epilogue
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 110%
  editorial-serif:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 140%
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 160%
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 100%
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-page: 40px
  overlap-sm: -20px
  overlap-lg: -64px
---

## Brand & Style

This design system is built on a "Zine-Core" aesthetic, blending the raw energy of DIY street culture with the polished high-fashion editorial of a modern digital magazine. It is hyper-targeted at Gen Z consumers who value authenticity, motion, and expressive individuality.

The design style is a hybrid of **Brutalism** and **Tactile Minimalism**. It rejects the sterile, perfectly aligned grids of traditional e-commerce in favor of an asymmetrical, layered, and multi-dimensional experience. Key characteristics include:
- **Kinetic Energy:** Overlapping elements and floating product photography create a sense of constant movement.
- **Human Touch:** Digital precision is disrupted by analog artifacts—handwritten marker scribbles, paper textures, and grain overlays.
- **Physicality:** "Sticker-style" UI elements and white-bordered cutouts make digital products feel like tangible objects pinned to a physical mood board.

## Colors

The palette is anchored by a high-visibility Lime Green that acts as a highlighter for calls to action and key accents. This "acidic" primary is softened by a duo of pastel secondary colors (Purple and Blue) that provide a dreamlike contrast.

- **Primary (Lime):** Used for "New Drop" tags, primary buttons, and high-impact background highlights.
- **Secondary/Tertiary (Pastels):** Used for large container blocks, category cards, and soft glow effects.
- **Neutrals:** A rich near-black is used for typography and structural lines. The background is a "paper-white" (not pure #FFF) to enhance the tactile magazine feel.
- **Glow Effects:** Semi-transparent blue and green radial gradients are used sparingly behind product images to create depth.

## Typography

This design system utilizes a high-contrast typographic hierarchy to mirror magazine layouts.

- **The Power Pair:** **Epilogue** serves as the heavy-duty engine for headlines, utilizing its condensed and bold weights to command attention. It is frequently mixed with **Newsreader** (italic) for a classic editorial flourish that breaks the "tech" feel.
- **The Functional Layer:** **Be Vietnam Pro** provides a friendly, approachable body copy experience, ensuring that product descriptions remain readable amidst the visual noise.
- **The Utility Layer:** **Space Grotesk** is used for technical labels, pricing, and navigation, leaning into its geometric, slightly futuristic character.
- **Handwritten Annotations:** Use a custom marker-style script (or SVG assets) for arrows and "scribbled" notes to emphasize the DIY aesthetic.

## Layout & Spacing

The layout philosophy rejects symmetry. It uses a **12-column fluid grid** but purposefully misaligns elements to create an "assembled" look.

- **Layering:** Elements should never sit purely side-by-side. Product cards should overlap background text, and "sticker" tags should overlap the edges of product photos.
- **Negative Space:** Use large blocks of whitespace (paper texture) to prevent the asymmetrical grid from feeling cluttered. 
- **Floating Sections:** Sections are often defined by large, rounded-rect containers that appear to float over a grainy background, separated by "Marker Line" dividers rather than clean borders.

## Elevation & Depth

Depth in this design system is achieved through **Tactile Stacking** rather than realistic shadows.

- **The Sticker Effect:** Product images are treated as die-cut stickers with a thick 2px to 4px white border and a sharp, small-offset shadow to make them "pop" off the screen.
- **Tonal Glows:** Instead of traditional drop shadows, use large, soft radial blurs in the brand colors (Lime or Blue) behind high-priority elements. This creates a "neon halo" effect.
- **Grain & Texture:** A global grain overlay (approx 3-5% opacity) should be applied to the entire interface to give the screen the tooth of printed paper.
- **Paper Folds:** Occasional subtle background assets representing paper creases or folded edges help ground the "zine" metaphor.

## Shapes

The shape language is a mix of geometric "perfect" shapes and "organic" imperfections.

- **Main Containers:** Use `rounded-lg` (1rem) for most cards and sections to keep the vibe soft and youthful.
- **Sticker Elements:** Use a mix of pill-shaped buttons and "starburst" or "jagged" shapes for discount tags or "New Drop" badges.
- **Organic Marks:** Use hand-drawn SVG arrows and circles to highlight specific product features. These should look like they were drawn with a felt-tip marker.
- **Dividers:** Horizontal rules should have a slight "hand-drawn" wobble rather than being perfectly straight 1px lines.

## Components

- **Product Cards:** These are the centerpiece. They should feature a "cutout" product image (no background) that overlaps the card's boundary. Include a white "sticker" border around the product.
- **Buttons:**
    - *Primary:* Solid Black or Lime Green, pill-shaped, with bold Space Grotesk caps.
    - *Secondary:* Transparent with a thick 2px black border, often accompanied by a small marker arrow pointing at the text.
- **Stickers & Badges:** Bright Lime or Pastel Blue badges with jagged "stamp" edges. They should be rotated 5-10 degrees to feel hand-placed.
- **Input Fields:** Minimalist. A simple underline (marker-stroke style) with labels in small caps Space Grotesk.
- **Floating Labels:** Small annotations with a curved marker arrow pointing to product details (e.g., "Waterproof" or "Carbon Fiber").
- **Zine-Scroller:** A horizontal product carousel where cards are slightly rotated and overlapping, mimicking a physical stack of photos on a table.