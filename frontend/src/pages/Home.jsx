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
import stkBaseball    from '../assets/images/stickers/baseball.png';
import stkShining     from '../assets/images/stickers/shining.png';
import stkDoodleStar  from '../assets/images/stickers/doodle-star-purple.png';
import stkDoodleCute  from '../assets/images/stickers/doodle-cute-element.png';
import stkMedal       from '../assets/images/stickers/medal.png';
import stkBadminton   from '../assets/images/stickers/badminton.png';
import stkNikeSneaker from '../assets/images/stickers/nike-sneaker1.png';
import stkGoogles     from '../assets/images/stickers/googles.png';

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

// ── Category cards ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Clothing',  sub: 'Jerseys, shorts & jackets', slug: 'clothing',  img: imgClothing,  bg: 'bg-brand-lime',         text: 'text-brand-ink', btn: 'bg-brand-ink text-brand-cream' },
  { label: 'Footwear',  sub: 'Running, football & more',  slug: 'footwear',  img: imgFootwear,  bg: 'bg-brand-purple-light', text: 'text-brand-ink', btn: 'bg-brand-ink text-brand-cream' },
  { label: 'Equipment', sub: 'Rackets, balls & gear',     slug: 'equipment', img: imgEquipment, bg: 'bg-brand-blue-light',   text: 'text-brand-ink', btn: 'bg-brand-ink text-brand-cream' },
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
      <section className="relative h-screen overflow-hidden bg-gradient-to-br from-[#9BDCFD] via-brand-cream to-[#C3B2FF]">

        {/* Atmospheric glow orbs */}
        <div className="absolute top-[12%] right-[8%]  w-[480px] h-[480px] rounded-full bg-sky-200/20  blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[5%] left-[5%] w-[320px] h-[320px] rounded-full bg-brand-lime/10 blur-[80px]  pointer-events-none" />

        {/* ── TEXT BLOCK (z-1, vertically centered, full-width lime strips) ── */}
        <div className="absolute inset-0 flex flex-col justify-center z-[1] pointer-events-none">

          {/* Line 1 — NEW ERA */}
          <div className="overflow-hidden w-full">
            <motion.h1
              className="block w-full bg-brand-lime text-brand-ink font-display font-black leading-[0.85] py-2 pl-5 md:pl-10 lg:pl-16 uppercase"
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

        {/* Baseball sticker */}
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
            <span key={i} className="inline-flex items-center gap-3 mx-8">
              <img
                src={b.logo}
                alt={b.name}
                className="h-6 w-auto object-contain grayscale opacity-40"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="font-sketch text-sm font-bold text-brand-ink/35 tracking-widest uppercase">
                {b.name}
              </span>
              <span className="text-brand-outline mx-2">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — CATEGORIES
          ══════════════════════════════════════════════════════════ */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-16 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-serif italic text-brand-ink/45 text-lg mb-1">explore the</p>
            <h2 className="font-display font-black text-5xl text-brand-ink leading-none" style={{ letterSpacing: '-0.03em' }}>
              CATEGORIES
            </h2>
          </div>
          <Link to="/products" className="font-sketch text-[11px] font-bold tracking-[0.22em] uppercase text-brand-ink/40 hover:text-brand-ink transition-colors">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: i * 0.1 }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className={`${cat.bg} ${cat.text} rounded-lg p-8 flex flex-col min-h-[400px] group overflow-hidden shadow-sm`}
              >
                <span className="font-display font-black text-4xl leading-none uppercase" style={{ letterSpacing: '-0.03em' }}>
                  {cat.label}
                </span>
                <span className="font-serif italic text-sm opacity-50 mt-2">{cat.sub}</span>
                <div className="flex-1 flex items-end justify-center py-4">
                  <motion.img
                    src={cat.img}
                    alt={cat.label}
                    className="w-48 h-48 object-contain drop-shadow-xl"
                    whileHover={{ scale: 1.1, rotate: -3 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  />
                </div>
                <span className={`inline-block ${cat.btn} font-sketch text-[10px] font-bold tracking-[0.22em] uppercase px-6 py-2.5 rounded-full w-fit`}>
                  SHOP
                </span>
              </Link>
            </motion.div>
          ))}
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
