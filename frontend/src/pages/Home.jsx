// Home.jsx — NEOGEN-style Sport-Zine landing page
// Framer Motion entrance animations + sticker PNG assets
import { useEffect, useState }  from 'react';
import { Link }                  from 'react-router-dom';
import { motion }                from 'framer-motion';
import { productApi }            from '../api/productApi';
import useCartStore              from '../store/useCartStore';

// ── Core assets ───────────────────────────────────────────────────────────────
import heroImg      from '../assets/images/hero.png';
import imgClothing  from '../assets/images/Clothing.png';
import imgFootwear  from '../assets/images/Footwear.png';
import imgEquipment from '../assets/images/Equipment.png';

// ── Brand logo imports ────────────────────────────────────────────────────────
import logoNike        from '../assets/images/logos/nike.png';
import logoAdidas      from '../assets/images/logos/adidas.png';
import logoPuma        from '../assets/images/logos/puma.png';
import logoUnderArmour from '../assets/images/logos/under-armour.png';
import logoNewBalance  from '../assets/images/logos/new-balance.png';
import logoReebok      from '../assets/images/logos/reebok.png';
import logoAsics       from '../assets/images/logos/asics.png';
import logoNorthFace   from '../assets/images/logos/north-face.png';
import logoFila        from '../assets/images/logos/fila.png';

// ── Sticker PNG imports ───────────────────────────────────────────────────────
import stkBasketball  from '../assets/images/stickers/basketball.png';
import stkShining     from '../assets/images/stickers/shining.png';
import stkDoodleStar  from '../assets/images/stickers/doodle-star-purple.png';
import stkDoodleCute  from '../assets/images/stickers/doodle-cute-element.png';
import stkMedal       from '../assets/images/stickers/medal.png';
import stkBadminton   from '../assets/images/stickers/badminton.png';
import stkNikeSneaker from '../assets/images/stickers/nike-sneaker1.png';
import stkBaseball    from '../assets/images/stickers/baseball.png';
import stkGoogles     from '../assets/images/stickers/googles.png';
import stkDumbbell       from '../assets/images/stickers/dumbbell.png';
import stkSkateboard     from '../assets/images/stickers/skateboard.png';
import stkBasketballBall from '../assets/images/stickers/basketball-ball.png';

// ── Marquee data ──────────────────────────────────────────────────────────────
const BRANDS = [
  { name: 'Nike',           logo: logoNike        },
  { name: 'Adidas',         logo: logoAdidas      },
  { name: 'Puma',           logo: logoPuma        },
  { name: 'Under Armour',   logo: logoUnderArmour },
  { name: 'New Balance',    logo: logoNewBalance  },
  { name: 'Reebok',         logo: logoReebok      },
  { name: 'Asics',          logo: logoAsics       },
  { name: 'The North Face', logo: logoNorthFace   },
  { name: 'Fila',           logo: logoFila        },
  { name: 'Nike',           logo: logoNike        },
  { name: 'Adidas',         logo: logoAdidas      },
  { name: 'Puma',           logo: logoPuma        },
  { name: 'Under Armour',   logo: logoUnderArmour },
  { name: 'New Balance',    logo: logoNewBalance  },
  { name: 'Reebok',         logo: logoReebok      },
  { name: 'Asics',          logo: logoAsics       },
  { name: 'The North Face', logo: logoNorthFace   },
  { name: 'Fila',           logo: logoFila        },
];


// ════════════════════════════════════════════════════════════════════════════
// MOTION VARIANTS
// ════════════════════════════════════════════════════════════════════════════
const LINE1 = {
  hidden:  { opacity: 0, x: -160 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};
const LINE2 = {
  hidden:  { opacity: 0, x: 160 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 } },
};
const ATHLETE = {
  hidden:  { opacity: 0, y: 70 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 } },
};
const CTAS = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut', delay: 0.92 } },
};
// Sticker spring — takes { delay, rotate } via `custom`
const STICKER = {
  hidden: { opacity: 0, scale: 0, rotate: -22 },
  visible: ({ delay = 1.0, rotate = 0 } = {}) => ({
    opacity: 1,
    scale: 1,
    rotate,
    transition: { delay, type: 'spring', stiffness: 360, damping: 14 },
  }),
};
// ════════════════════════════════════════════════════════════════════════════
// REUSABLE SUB-COMPONENTS
// ════════════════════════════════════════════════════════════════════════════

// Sticker wrapper — spring pop, hover scale, responsive scale (position stays fixed)
function Sticker({ delay = 1.0, rotate = 0, className = '', style = {}, children }) {
  return (
    <motion.div
      className={`absolute hidden sm:block z-[30] ${className}`}
      style={style}
      variants={STICKER}
      initial="hidden"
      animate="visible"
      custom={{ delay, rotate }}
      whileHover={{ scale: 1.12, transition: { type: 'spring', stiffness: 400, damping: 12 } }}
    >
      <div className="origin-top-left scale-[0.45] sm:scale-[0.6] md:scale-[0.8] lg:scale-100">
        {children}
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PRODUCT CARD — sticker aesthetic
// ════════════════════════════════════════════════════════════════════════════
function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  return (
    <motion.div
      className="group relative bg-white rounded-lg overflow-visible border border-brand-outline/30 flex flex-col"
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.10)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative overflow-hidden h-56 rounded-t-lg bg-brand-surface">
        {product.mainImageUrl ? (
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            style={{ mixBlendMode: 'multiply' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl">🏅</span>
          </div>
        )}
        {product.categoryName && (
          <span className="absolute top-3 left-3 bg-brand-lime text-brand-ink font-sketch text-[9px] font-bold px-2.5 py-1 rounded-full tracking-widest uppercase -rotate-2 shadow-sm">
            {product.categoryName}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <p className="font-sketch text-[9px] font-bold tracking-widest uppercase text-brand-ink/30">
          {product.brandName ?? 'SportGear'}
        </p>
        <h3 className="font-sans font-semibold text-brand-ink text-sm leading-snug line-clamp-2 flex-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-2xl font-black text-brand-ink" style={{ letterSpacing: '-0.04em' }}>
            ${(product.salePrice ?? product.price)?.toFixed(2)}
          </span>
          <motion.button
            onClick={() => addItem(product.id, null, 1)}
            className="px-4 py-2 bg-brand-ink text-brand-cream font-sketch text-[10px] font-bold rounded-full tracking-widest uppercase"
            whileHover={{ backgroundColor: '#635499', scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            + Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// HOME — MAIN EXPORT
// ════════════════════════════════════════════════════════════════════════════
export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    productApi.getAll({ pageSize: 4, sortBy: 'newest' })
      .then((r) => setFeatured(r.data.items ?? r.data))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-brand-cream min-h-screen">

      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — HERO
          Full-viewport collage: oversized type + athlete + stickers
          ══════════════════════════════════════════════════════════ */}
      <section className="relative h-screen overflow-hidden hero-zine-bg">

        {/* Atmospheric glow orbs */}
        <div className="absolute top-[12%] right-[8%]  w-[480px] h-[480px] rounded-full bg-sky-200/20  blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[5%] left-[5%] w-[320px] h-[320px] rounded-full bg-brand-lime/10 blur-[80px]  pointer-events-none" />

        {/* ── TEXT BLOCK (z-1, vertically centered, full-width lime strips) ── */}
        <div className="absolute inset-0 flex flex-col justify-center z-[1] pointer-events-none">

          {/* Line 1 — NEW ERA */}
          <div className="overflow-hidden w-full">
            <motion.h1
              className="block w-full bg-brand-lime text-brand-ink font-display font-black leading-[0.85] pt-12 pb-1 pl-5 md:pl-10 lg:pl-16 uppercase"
              style={{ fontSize: 'clamp(64px, 20vw, 288px)', letterSpacing: '-0.04em' }}
              variants={LINE1}
              initial="hidden"
              animate="visible"
            >
              NEW ERA
            </motion.h1>
          </div>

          {/* Gap */}
          <div className="h-3 md:h-4" />

          {/* Line 2 — CREATE MOVEMENT (no lime bg — plain text only) */}
          <div className="overflow-hidden w-full">
            <motion.h1
              className="block w-full text-brand-ink font-display font-black leading-[0.85] py-2 pl-5 md:pl-10 lg:pl-16 uppercase"
              style={{ fontSize: 'clamp(32px, 10vw, 144px)', letterSpacing: '-0.04em' }}
              variants={LINE2}
              initial="hidden"
              animate="visible"
            >
              CREATE MOVEMENT
            </motion.h1>
          </div>
        </div>

        {/* ── ATHLETE (z-20, bottom-anchored, in front of text) ────────── */}
        <motion.img
          src={heroImg}
          alt="Athlete"
          draggable={false}
          className="absolute bottom-[10%] h-[82%] w-auto max-w-none object-contain z-[20] select-none pointer-events-none"
          style={{ filter: 'grayscale(1) contrast(1.12)', left: 'calc(64px + 67vw)' }}
          variants={ATHLETE}
          initial="hidden"
          animate="visible"
        />

        {/* ── CTA BUTTONS (z-30, centered, above athlete) ──────────────── */}
        <motion.div
          className="absolute bottom-[18%] left-1/2 -translate-x-1/2 flex flex-col sm:flex-row gap-3 items-center z-[30]"
          variants={CTAS}
          initial="hidden"
          animate="visible"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
            <Link
              to="/products"
              className="block px-8 py-4 bg-brand-lime text-brand-ink font-sketch text-[12px] font-bold tracking-[0.22em] uppercase rounded-full shadow-md hover:bg-brand-lime-dim transition-colors"
            >
              SHOP NOW
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
            <Link
              to="/products"
              className="block px-8 py-4 bg-brand-ink text-brand-cream font-sketch text-[12px] font-bold tracking-[0.22em] uppercase rounded-full shadow-md hover:bg-brand-purple transition-colors"
            >
              VIEW COLLECTION
            </Link>
          </motion.div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════
            STICKER LAYER — z-30, hidden on mobile
            ════════════════════════════════════════════════════════════════ */}

        {/* ── TOP AREA ─────────────────────────────────────────────── */}

        {/* Nike sneaker — top-left */}
        <Sticker delay={1.1} rotate={-14} className="top-[4%] left-[3%]">
          <img src={stkNikeSneaker} alt="nike sneaker" className="w-44 h-44 object-contain drop-shadow-xl" draggable={false} />
        </Sticker>

        {/* Shining sparkle — top-left corner of the "N" in NEW */}
        <Sticker delay={1.3} rotate={12} className="top-[29%]" style={{ left: 'calc(64px - 1rem)' }}>
          <img src={stkShining} alt="" className="w-10 h-10 object-contain" draggable={false} />
        </Sticker>

        {/* Medal — above the word "NEW", replacing star */}
        <Sticker delay={1.2} rotate={8} className="top-[6%] left-[22%]">
          <img src={stkMedal} alt="" className="w-20 h-20 object-contain drop-shadow-md" draggable={false} />
        </Sticker>

        {/* American football — top-center */}
        <Sticker delay={1.15} rotate={20} className="top-[2%]" style={{ left: 'calc(50% - 5rem)' }}>
          <img src={stkGoogles} alt="googles" className="w-32 h-32 object-contain drop-shadow-lg" draggable={false} />
        </Sticker>

        {/* Basketball — bottom of "E" in CREATE */}
        <Sticker delay={1.1} rotate={10} className="top-[67%]" style={{ left: 'calc(64px + 28vw - 4rem)' }}>
          <img src={stkBasketball} alt="basketball" className="w-32 h-32 object-contain drop-shadow-lg" draggable={false} />
        </Sticker>


        {/* ── ON NEW ERA LIME STRIP ─────────────────────────────────── */}

        {/* Badminton — left of "E" in ERA, leaning 30° left */}
        <Sticker delay={1.0} rotate={-15} className="top-[35%]" style={{ left: 'calc(64px + 34.5vw - 8rem)' }}>
          <img src={stkBadminton} alt="" className="w-80 h-80 object-contain drop-shadow-2xl" draggable={false} />
        </Sticker>

        {/* Doodle cute element — top-right of "A" in ERA */}
        <Sticker delay={1.25} rotate={-8} className="top-[29%] left-[61%]">
          <img src={stkDoodleCute} alt="" className="w-16 h-16 object-contain" draggable={false} />
        </Sticker>

        {/* ── BOTTOM-LEFT ──────────────────────────────────────────── */}

        {/* Baseball — bottom-left */}
        <Sticker delay={1.4} rotate={-8} className="top-[50%] left-[2%]">
          <img src={stkBaseball} alt="baseball" className="w-24 h-24 object-contain drop-shadow-md" draggable={false} />
        </Sticker>

        {/* ── DOODLE STAR — under the "T" in MOVEMENT ─────────────── */}
        <Sticker delay={1.5} rotate={18} className="top-[60%]" style={{ left: 'calc(64px + 75vw - 10rem)' }}>
          <img src={stkDoodleStar} alt="" className="w-[12.5rem] h-[12.5rem] object-contain opacity-90" draggable={false} />
        </Sticker>

        {/* ── BOTTOM-RIGHT ─────────────────────────────────────────── */}


        {/* Shining sparkle — bottom-right */}
        <Sticker delay={1.65} rotate={-5} className="top-[73%] right-[18%]">
          <img src={stkShining} alt="" className="w-7 h-7 object-contain opacity-55" draggable={false} />
        </Sticker>


      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — BRAND MARQUEE
          ══════════════════════════════════════════════════════════ */}
      <section className="bg-brand-cream py-5 overflow-hidden border-y border-brand-outline/40">
        <div className="flex animate-marquee whitespace-nowrap">
          {BRANDS.map((b, i) => (
            <span key={i} className="inline-flex items-center mx-6">
              <img
                src={b.logo}
                alt={b.name}
                className="h-16 w-48 object-contain opacity-75"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — CATEGORIES (Sticker card layout)
          ══════════════════════════════════════════════════════════ */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-16">

          {/* Section header */}
          <div className="mb-14">
            <h2
              className="font-display font-black uppercase leading-none text-brand-ink"
              style={{ fontSize: 'clamp(44px, 7vw, 88px)', letterSpacing: '-0.02em' }}
            >
              SHOP BY CATEGORY
            </h2>
            <p className="font-sketch text-brand-ink/55 text-xl mt-2">Find your fit. Express your style.</p>
          </div>

          {/* Sticker cards — overlapping on md+ */}
          <div className="relative flex flex-col md:flex-row items-start justify-center gap-6 md:gap-0 pb-10">

            {/* ── FOOTWEAR card ── lime green, CCW tilt, front-left */}
            <motion.div
              className="relative w-full md:w-[380px] flex-shrink-0 rounded-[36px] p-7 shadow-2xl md:-mr-4 z-10 cursor-pointer"
              style={{ backgroundColor: '#BEFF55', rotate: -3 }}
              whileHover={{ rotate: 0, scale: 1.03, zIndex: 30 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0 }}
            >
              {/* Dumbbell sticker — floats outside top-left corner */}
              <img
                src={stkDumbbell} alt=""
                className="absolute -top-10 -left-10 w-24 h-24 object-contain pointer-events-none select-none"
                style={{ transform: 'rotate(-20deg)', filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.18))' }}
                draggable={false}
              />

              <h3
                className="font-display font-black text-brand-ink uppercase leading-none"
                style={{ fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.02em' }}
              >FOOTWEAR</h3>

              {/* Product image + annotation labels */}
              <div className="relative my-6 h-52 flex items-center justify-center">
                <img
                  src={imgFootwear} alt="Footwear"
                  className="w-52 h-44 object-contain relative z-10"
                  style={{ filter: 'drop-shadow(0 0 5px white) drop-shadow(0 0 14px white) drop-shadow(0 0 2px rgba(0,0,0,0.10))' }}
                  draggable={false}
                />
                <div className="absolute top-1 left-1 font-note text-[13px] text-brand-ink/75 leading-tight">
                  Performance<br/>Fabric
                  <svg className="w-9 h-9 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4 Q12 8 18 16"/><path d="M16 18 L18 16 L14 15"/></svg>
                </div>
                <div className="absolute top-1 right-1 font-note text-[13px] text-brand-ink/75 text-right leading-tight">
                  Durable
                  <svg className="w-9 h-9 mt-1 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ transform: 'scaleX(-1)' }}><path d="M4 4 Q12 8 18 16"/><path d="M16 18 L18 16 L14 15"/></svg>
                </div>
                <div className="absolute bottom-1 left-1 font-note text-[13px] text-brand-ink/75 leading-tight">
                  <svg className="w-9 h-9 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ transform: 'scaleY(-1)' }}><path d="M4 4 Q12 8 18 16"/><path d="M16 18 L18 16 L14 15"/></svg>
                  Grippy<br/>Sole
                </div>
                <div className="absolute bottom-1 right-1 font-note text-[13px] text-brand-ink/75 text-right leading-tight">
                  <svg className="w-9 h-9 mb-1 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ transform: 'rotate(180deg)' }}><path d="M4 4 Q12 8 18 16"/><path d="M16 18 L18 16 L14 15"/></svg>
                  Grippy<br/>Sole
                </div>
              </div>

              {/* Neumorphic pill button */}
              <Link
                to="/products?category=footwear"
                className="block w-full text-center py-3 rounded-full font-sketch text-[15px] text-brand-ink font-bold transition-opacity hover:opacity-80"
                style={{
                  background: 'rgba(255,255,255,0.70)',
                  boxShadow: '4px 4px 14px rgba(0,0,0,0.10), -3px -3px 8px rgba(255,255,255,0.90)',
                }}
              >
                Shop Footwear
              </Link>
            </motion.div>

            {/* ── EQUIPMENT card ── sky blue, CW tilt, center — overlaps both neighbors */}
            <motion.div
              className="relative w-full md:w-[410px] flex-shrink-0 rounded-[36px] p-7 shadow-2xl md:mt-16 z-20 cursor-pointer"
              style={{ backgroundColor: '#A8DCFF', rotate: 1.5 }}
              whileHover={{ rotate: 0, scale: 1.03, zIndex: 30 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
            >
              <h3
                className="font-display font-black text-brand-ink uppercase leading-none"
                style={{ fontSize: 'clamp(36px, 5vw, 52px)', letterSpacing: '-0.02em' }}
              >EQUIPMENT</h3>

              <div className="relative my-6 h-52 flex items-center justify-center">
                <img
                  src={imgEquipment} alt="Equipment"
                  className="w-52 h-44 object-contain relative z-10"
                  style={{ filter: 'drop-shadow(0 0 5px white) drop-shadow(0 0 14px white) drop-shadow(0 0 2px rgba(0,0,0,0.10))' }}
                  draggable={false}
                />
                <div className="absolute top-1 left-1 font-note text-[13px] text-brand-ink/75 leading-tight">
                  Weight<br/>Set
                  <svg className="w-9 h-9 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4 Q12 8 18 16"/><path d="M16 18 L18 16 L14 15"/></svg>
                </div>
                <div className="absolute top-1 right-1 font-note text-[13px] text-brand-ink/75 text-right leading-tight">
                  Water<br/>Resistant
                  <svg className="w-9 h-9 mt-1 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ transform: 'scaleX(-1)' }}><path d="M4 4 Q12 8 18 16"/><path d="M16 18 L18 16 L14 15"/></svg>
                </div>
                <div className="absolute bottom-1 left-1 font-note text-[13px] text-brand-ink/75 leading-tight">
                  <svg className="w-9 h-9 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ transform: 'scaleY(-1)' }}><path d="M4 4 Q12 8 18 16"/><path d="M16 18 L18 16 L14 15"/></svg>
                  Official<br/>Ball
                </div>
              </div>

              <Link
                to="/products?category=equipment"
                className="block w-full text-center py-3 rounded-full font-sketch text-[15px] text-brand-ink font-bold transition-opacity hover:opacity-80"
                style={{
                  background: 'rgba(255,255,255,0.70)',
                  boxShadow: '4px 4px 14px rgba(0,0,0,0.10), -3px -3px 8px rgba(255,255,255,0.90)',
                }}
              >
                Shop Equipment
              </Link>

              {/* Skateboard sticker — bottom-right corner */}
              <img
                src={stkSkateboard} alt=""
                className="absolute -bottom-12 -right-10 w-36 h-36 object-contain pointer-events-none select-none"
                style={{ transform: 'rotate(-20deg)', filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.18))' }}
                draggable={false}
              />
            </motion.div>

            {/* ── CLOTHING card ── lavender, CW tilt, top-right */}
            <motion.div
              className="relative w-full md:w-[380px] flex-shrink-0 rounded-[36px] p-7 shadow-2xl md:-ml-4 md:-mt-5 z-10 cursor-pointer"
              style={{ backgroundColor: '#C4A8FF', rotate: 2 }}
              whileHover={{ rotate: 0, scale: 1.03, zIndex: 30 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
            >
              {/* Basketball-ball sticker — top-right corner */}
              <img
                src={stkBasketballBall} alt=""
                className="absolute -top-10 -right-8 w-28 h-28 object-contain pointer-events-none select-none"
                style={{ transform: 'rotate(15deg)', filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.18))' }}
                draggable={false}
              />

              <h3
                className="font-display font-black text-brand-ink uppercase leading-none"
                style={{ fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.02em' }}
              >CLOTHING</h3>

              <div className="relative my-6 h-52 flex items-center justify-center">
                <img
                  src={imgClothing} alt="Clothing"
                  className="w-52 h-44 object-contain relative z-10"
                  style={{ filter: 'drop-shadow(0 0 5px white) drop-shadow(0 0 14px white) drop-shadow(0 0 2px rgba(0,0,0,0.10))' }}
                  draggable={false}
                />
                <div className="absolute top-1 left-1 font-note text-[13px] text-brand-ink/75 leading-tight">
                  Performance<br/>Fabric
                  <svg className="w-9 h-9 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4 Q12 8 18 16"/><path d="M16 18 L18 16 L14 15"/></svg>
                </div>
                <div className="absolute top-1 right-1 font-note text-[13px] text-brand-ink/75 text-right leading-tight">
                  Backpack
                  <svg className="w-9 h-9 mt-1 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ transform: 'scaleX(-1)' }}><path d="M4 4 Q12 8 18 16"/><path d="M16 18 L18 16 L14 15"/></svg>
                </div>
                <div className="absolute bottom-1 right-1 font-note text-[13px] text-brand-ink/75 text-right leading-tight">
                  <svg className="w-9 h-9 mb-1 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ transform: 'rotate(180deg)' }}><path d="M4 4 Q12 8 18 16"/><path d="M16 18 L18 16 L14 15"/></svg>
                  Water<br/>Resistant
                </div>
              </div>

              <Link
                to="/products?category=clothing"
                className="block w-full text-center py-3 rounded-full font-sketch text-[15px] text-brand-ink font-bold transition-opacity hover:opacity-80"
                style={{
                  background: 'rgba(255,255,255,0.70)',
                  boxShadow: '4px 4px 14px rgba(0,0,0,0.10), -3px -3px 8px rgba(255,255,255,0.90)',
                }}
              >
                Shop Clothing
              </Link>
            </motion.div>

            {/* ── Doodle stars between Footwear & Equipment ── */}
            <div className="hidden md:block absolute left-[30%] top-[18%] pointer-events-none select-none text-brand-ink/20 text-3xl">✦</div>
            <div className="hidden md:block absolute left-[32%] top-[34%] pointer-events-none select-none text-brand-ink/12 text-xl">✦</div>
            <div className="hidden md:block absolute left-[31%] top-[50%] pointer-events-none select-none text-brand-ink/18 text-2xl">✦</div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4 — FEATURED PRODUCTS
          ══════════════════════════════════════════════════════════ */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-16 pb-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-serif italic text-brand-ink/45 text-lg mb-1">just dropped</p>
            <h2 className="font-display font-black text-5xl text-brand-ink leading-none" style={{ letterSpacing: '-0.03em' }}>
              NEW ARRIVALS
            </h2>
          </div>
          <Link to="/products" className="font-sketch text-[11px] font-bold tracking-[0.22em] uppercase text-brand-ink/40 hover:text-brand-ink transition-colors">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-brand-surface rounded-lg h-72 animate-pulse" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-brand-ink/30">
            <p className="font-display font-black text-3xl uppercase" style={{ letterSpacing: '-0.03em' }}>No Products Yet</p>
            <p className="font-sans text-sm mt-2 text-brand-ink/35">Add products from the admin panel.</p>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5 — PROMO BANNER
          ══════════════════════════════════════════════════════════ */}
      <motion.section
        className="bg-brand-lime border-y border-brand-outline/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-16 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="font-serif italic text-brand-olive/65 text-lg mb-1">for a limited time</p>
            <h2 className="font-display font-black text-5xl md:text-6xl text-brand-ink leading-none uppercase" style={{ letterSpacing: '-0.04em' }}>
              Free Shipping<br />On All Orders
            </h2>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Link
              to="/products"
              className="block shrink-0 px-10 py-5 bg-brand-ink text-brand-lime font-sketch text-[12px] font-bold tracking-[0.22em] uppercase rounded-full hover:bg-brand-purple hover:text-white transition-colors"
            >
              Shop Now ✦
            </Link>
          </motion.div>
        </div>
      </motion.section>

    </div>
  );
}
