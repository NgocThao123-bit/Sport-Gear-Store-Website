// Products.jsx — Sport-Zine / NEOGEN — Full-width horizontal scroll
import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productApi, categoryApi } from '../api/productApi';
import useCartStore from '../store/useCartStore';

import iconHouse      from '../assets/images/icons/house.png';
import iconSearch     from '../assets/images/icons/search.png';
import stkShining     from '../assets/images/stickers/shining.png';
import stkDoodleStar  from '../assets/images/stickers/doodle-star-purple.png';
import stkMedal       from '../assets/images/stickers/medal.png';
import stkTrophy      from '../assets/images/stickers/trophy2.png';
import stkScribble    from '../assets/images/stickers/scribble (1).png';
import stkStar        from '../assets/images/stickers/star.png';
import stkDoodleCute  from '../assets/images/stickers/doodle-cute-element.png';
import stkBrushStroke from '../assets/images/stickers/pastel-brush-stroke.png';

import athletePoleVaulter  from '../assets/images/athletes/pole-vaulter.png';
import athleteSkier        from '../assets/images/athletes/skier.png';
import athleteBaseball     from '../assets/images/athletes/baseball-player.png';
import athleteBasketball   from '../assets/images/athletes/basketball-player.png';
import athleteSoccer       from '../assets/images/athletes/soccer-player.png';
import athleteSwimmer      from '../assets/images/athletes/swimmer.png';

const ATHLETES = [athletePoleVaulter, athleteSkier, athleteBaseball, athleteBasketball, athleteSoccer, athleteSwimmer];

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

const CARD_STICKERS = {
  0:  { src: stkMedal,       pos: '-top-4 -left-4',    size: 'w-12 h-12', rot: '-15deg' },
  2:  { src: stkShining,     pos: '-top-3 -right-3',   size: 'w-8  h-8',  rot: '20deg'  },
  4:  { src: stkDoodleStar,  pos: '-top-5 -left-3',    size: 'w-12 h-12', rot: '-10deg' },
  6:  { src: stkTrophy,      pos: '-top-4 -right-4',   size: 'w-11 h-11', rot: '14deg'  },
  8:  { src: stkStar,        pos: '-top-4 -left-4',    size: 'w-10 h-10', rot: '-18deg' },
  10: { src: stkDoodleCute,  pos: '-top-4 -right-3',   size: 'w-11 h-11', rot: '8deg'   },
  12: { src: stkScribble,    pos: '-top-3 -right-4',   size: 'w-14 h-8',  rot: '6deg',  opacity: 0.55 },
  14: { src: stkBrushStroke, pos: '-bottom-3 -right-4',size: 'w-16 h-8',  rot: '-4deg', opacity: 0.55 },
};

// ── PRODUCT CARD ──────────────────────────────────────────────────────────────
function ProductCard({ product, index }) {
  const addItem = useCartStore((s) => s.addItem);
  const price   = (product.salePrice ?? product.price)?.toFixed(2);
  const hasSale = !!product.salePrice;
  const sticker = CARD_STICKERS[index % 16];

  return (
    <motion.div
      className="relative flex-shrink-0 w-72"
      whileHover={{ scale: 1.03, zIndex: 20 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
    >
      <Link
        to={`/products/${product.slug}`}
        className="group w-full bg-white rounded-3xl flex flex-col"
        style={{
          padding: '1.6rem',
          boxShadow: '10px 10px 32px rgba(0,0,0,0.08), -4px -4px 14px rgba(255,255,255,0.82)',
        }}
      >
        {/* Category badge — color by category */}
        {product.categoryName && (() => {
          const cat = product.categoryName.toLowerCase();
          const bg  = cat.includes('footwear')  ? '#d4ff32'
                    : cat.includes('equipment') ? '#a8dcff'
                    : cat.includes('clothing')  ? '#c3b8e8'
                    : '#d4ff32';
          return (
            <span
              className="self-start text-brand-ink font-sketch text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase -rotate-2 mb-5"
              style={{ backgroundColor: bg }}
            >
              {product.categoryName}
            </span>
          );
        })()}

        {/* Product image */}
        <div className="relative">
          {product.mainImageUrl ? (
            <img
              src={product.mainImageUrl}
              alt={product.name}
              className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
              style={{
                maxHeight: '260px',
                filter: 'drop-shadow(3px 3px 0px white) drop-shadow(-3px -3px 0px white) drop-shadow(3px -3px 0px white) drop-shadow(-3px 3px 0px white) drop-shadow(0 8px 20px rgba(0,0,0,0.10))',
              }}
              draggable={false}
            />
          ) : (
            <span className="block text-center text-6xl py-16">🏅</span>
          )}
        </div>

        {/* Brand + name */}
        <div className="mt-5 mb-5">
          <p className="font-sketch text-sm font-bold tracking-widest uppercase text-brand-ink/30 mb-1.5">
            {product.brandName ?? product.brand ?? 'SportGear'}
          </p>
          <h3 className="font-sans font-semibold text-brand-ink text-base leading-snug line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Price + CTA */}
        <div className="flex flex-col gap-3 mt-auto">
          <div className="flex items-baseline gap-2">
            <span
              className="font-note font-bold text-brand-ink"
              style={{
                fontSize: '1.5rem',
                border: '2.5px solid #1c1b1b',
                borderRadius: '9999px',
                padding: '2px 16px',
                display: 'inline-block',
                transform: 'rotate(-2deg)',
                background: 'white',
              }}
            >
              ${price}
            </span>
            {hasSale && (
              <span className="text-base line-through text-brand-ink/30 font-sketch">
                ${product.price?.toFixed(2)}
              </span>
            )}
          </div>
          <motion.button
            onClick={(e) => { e.preventDefault(); addItem(product.id, null, 1); }}
            className="w-full py-3 bg-brand-ink text-white font-sketch text-xs font-bold rounded-full tracking-widest uppercase"
            style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.14)' }}
            whileHover={{ backgroundColor: '#d4ff32', color: '#1c1b1b' }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.12 }}
          >
            ADD TO BAG
          </motion.button>
        </div>
      </Link>

      {sticker && (
        <img
          src={sticker.src} alt=""
          className={`absolute ${sticker.pos} object-contain pointer-events-none select-none w-16 h-16`}
          style={{ transform: `rotate(${sticker.rot})`, opacity: sticker.opacity ?? 0.75 }}
          draggable={false}
        />
      )}
    </motion.div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [search,     setSearch]     = useState(searchParams.get('q') || '');

  const categorySlug = searchParams.get('category') || '';
  const page         = parseInt(searchParams.get('page') || '1', 10);
  const q            = searchParams.get('q') || '';
  const pageSize     = 12;
  const scrollRef    = useRef(null);

  useEffect(() => {
    categoryApi.getAll().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (categorySlug && categories.length === 0) return;
    const matched    = categories.find((c) => (c.slug ?? c.name.toLowerCase()) === categorySlug);
    const categoryId = matched?.id ?? undefined;
    setLoading(true);
    productApi
      .getAll({ pageNumber: page, pageSize, categoryId, searchTerm: q || undefined })
      .then((res) => {
        const data = res.data;
        setProducts(data.items ?? data);
        setTotalCount(data.totalCount ?? (data.items ?? data).length);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [categorySlug, categories, page, q]);

  // Convert vertical wheel → horizontal scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [products]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSearch = (e) => {
    e.preventDefault();
    const next = {};
    if (categorySlug) next.category = categorySlug;
    if (search.trim()) next.q = search.trim();
    setSearchParams(next);
  };

  const setCategory = (slug) => {
    const next = {};
    if (slug) next.category = slug;
    if (q)    next.q = q;
    setSearchParams(next);
  };

  return (
    <div className="bg-brand-cream min-h-screen" style={{ backgroundImage: GRAIN }}>

      {/* ── HEADER — constrained ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-16 pt-10">

        {/* Title */}
        <div className="mb-10">
          <div className="relative inline-block">
            <div className="absolute left-0 right-0 bottom-0 bg-brand-lime" style={{ height: '50%', zIndex: 0 }} />
            <h1
              className="relative font-display font-black text-brand-ink uppercase leading-none z-10"
              style={{ fontSize: 'clamp(32px, 5vw, 72px)', letterSpacing: '-0.03em' }}
            >
              {categorySlug ? categorySlug : 'GEAR'}{' '}
              {categorySlug ? 'COLLECTION' : 'SELECTION'}
            </h1>
          </div>
        </div>

        {/* Filters + search */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-10">
          <div className="flex gap-2 flex-wrap items-center">
            {/* Home button */}
            <Link
              to="/"
              className="inline-flex items-center hover:opacity-70 transition-opacity"
              style={{}}
            >
              <img src={iconHouse} alt="home" className="w-12 h-12 object-contain transition-all" style={{ mixBlendMode: 'multiply' }} />
            </Link>

            {[{ id: '', name: 'All' }, ...categories].map((c) => {
              const slug   = c.id ? (c.slug ?? c.name.toLowerCase()) : '';
              const active = categorySlug === slug;
              const name   = c.name.toLowerCase();
              const catBg  = name.includes('footwear')  ? '#d4ff32'
                           : name.includes('equipment') ? '#a8dcff'
                           : name.includes('clothing')  ? '#c3b8e8'
                           : 'white';
              return (
                <button
                  key={c.id || 'all'}
                  onClick={() => setCategory(slug)}
                  className="px-5 py-2 rounded-full font-sketch text-[11px] font-bold tracking-widest uppercase border-2 border-brand-ink transition-all"
                  style={{
                    backgroundColor: active ? '#1c1b1b' : catBg,
                    color: active ? '#fcf9f8' : '#1c1b1b',
                    boxShadow: '4px 4px 0 #1c1b1b',
                  }}
                >
                  {c.name.toUpperCase()}
                </button>
              );
            })}
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="px-6 py-3 rounded-full border-2 border-brand-ink bg-white text-brand-ink text-sm font-sketch font-bold tracking-widest focus:outline-none focus:border-brand-purple w-[28rem]"
            />
            <button type="submit" className="hover:opacity-70 transition-opacity flex items-center justify-center">
              <img src={iconSearch} alt="search" className="w-12 h-12 object-contain" style={{ mixBlendMode: 'multiply', transform: 'rotate(15deg)' }} />
            </button>
          </form>
        </div>

        {!loading && products.length > 0 && (
          <p className="font-sketch text-[10px] font-bold tracking-widest uppercase text-brand-ink/35 mb-6">
            {totalCount} item{totalCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* ── HORIZONTAL SCROLL — full viewport width, no container constraint ── */}
      {loading ? (
        <div className="no-scrollbar overflow-x-auto">
          <div className="flex flex-col flex-wrap content-start gap-8 px-10 pt-8 pb-8" style={{ height: '760px' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-64 bg-white rounded-3xl animate-pulse"
                style={{ height: `${[280, 340, 260, 320, 300, 360, 240, 310][i]}px`, boxShadow: '6px 6px 18px rgba(0,0,0,0.07)' }}
              />
            ))}
          </div>
        </div>
      ) : products.length > 0 ? (
        <>
              {/* flex-col flex-wrap: cards stack into columns, overflow right → horizontal scroll */}
          <div ref={scrollRef} className="no-scrollbar overflow-x-auto">
            <div
              className="flex flex-col flex-wrap content-start gap-8 px-10 pt-8 pb-8"
              style={{ height: '760px' }}
            >
              {(() => {
                const items = [];
                let athleteIdx = 0;
                products.forEach((p, i) => {
                  items.push({ kind: 'product', data: p, i });
                  // Insert an athlete image after every 3rd product
                  if ((i + 1) % 3 === 0) {
                    items.push({ kind: 'athlete', src: ATHLETES[athleteIdx++ % ATHLETES.length] });
                  }
                });
                return items.map((item, idx) =>
                  item.kind === 'athlete' ? (
                    <motion.div
                      key={`athlete-${idx}`}
                      className="flex-shrink-0 w-[28rem] self-end"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                      <img
                        src={item.src} alt="athlete"
                        className="w-full h-auto object-contain select-none"
                        style={{ filter: 'grayscale(0.2) contrast(1.08)', mixBlendMode: 'multiply' }}
                        draggable={false}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={item.data.id}
                      className="flex-shrink-0 w-72"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, ease: 'easeOut', delay: item.i * 0.04 }}
                    >
                      <ProductCard product={item.data} index={item.i} />
                    </motion.div>
                  )
                );
              })()}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 py-10">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSearchParams({
                    ...(categorySlug && { category: categorySlug }),
                    ...(q && { q }),
                    page: i + 1,
                  })}
                  className={`w-10 h-10 rounded-full font-sketch font-bold text-sm border-2 border-brand-ink transition-colors ${
                    page === i + 1 ? 'bg-brand-ink text-brand-lime' : 'bg-white text-brand-ink hover:bg-brand-ink hover:text-brand-lime'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24">
          <p className="font-display font-black text-brand-ink/30 uppercase leading-none" style={{ fontSize: 'clamp(32px, 7vw, 72px)', letterSpacing: '-0.03em' }}>
            NO PRODUCTS
          </p>
          <p className="font-sketch text-sm text-brand-ink/35 mt-3 tracking-widest uppercase">
            Try a different category or search term
          </p>
        </div>
      )}

    </div>
  );
}
