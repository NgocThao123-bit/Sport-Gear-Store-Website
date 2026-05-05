// Home.jsx — main landing page
// Home.jsx — trang chủ chính
//
// SECTIONS / CÁC PHẦN:
// 1. Hero        — athlete image + floating real sports ball PNGs + headline
//    Hero        — ảnh vận động viên + bóng thể thao PNG thực nổi lên + tiêu đề
// 2. Marquee     — scrolling sport categories ticker
//    Marquee     — ticker thể loại thể thao cuộn ngang
// 3. Categories  — 3 colored category cards with real ball images
//    Categories  — 3 thẻ danh mục màu sắc với ảnh bóng thực
// 4. Products    — latest 4 product cards fetched from API
//    Products    — 4 thẻ sản phẩm mới nhất từ API
// 5. Promo       — promotional banner
//    Promo       — banner khuyến mãi
//
// HOW FLOATING BALL ANIMATION WORKS / CÁCH ANIMATION BÓNG NỔI HOẠT ĐỘNG:
// Each ball has position (top/left), size, animation duration and delay set
// as inline CSS custom properties (CSS variables). A single @keyframes "float"
// rule in index.css picks up these variables.
// Mỗi quả bóng có vị trí, kích thước, thời gian animation và độ trễ được đặt
// như CSS custom properties (biến CSS). Một quy tắc @keyframes "float" duy nhất
// trong index.css đọc các biến này.
import { useEffect, useState } from 'react';
import { Link }                from 'react-router-dom';
import { productApi }          from '../api/productApi';
import useCartStore            from '../store/useCartStore';
// WHY import the image? / TẠI SAO import ảnh?
// Vite processes imported images — it hashes the filename for cache-busting
// and resolves the correct public URL automatically.
// Vite xử lý ảnh được import — hash tên file để cache-busting
// và tự động resolve URL công khai chính xác.
import heroImg      from '../assets/images/hero.png';
import imgClothing  from '../assets/images/Clothing.png';
import imgFootwear  from '../assets/images/Footwear.png';
import imgEquipment from '../assets/images/Equipment.png';
import logoNike        from '../assets/images/logos/nike.png';
import logoAdidas      from '../assets/images/logos/adidas.png';
import logoPuma        from '../assets/images/logos/puma.png';
import logoUnderArmour from '../assets/images/logos/under-armour.png';
import logoNewBalance  from '../assets/images/logos/new-balance.png';
import logoReebok      from '../assets/images/logos/reebok.png';
import logoAsics       from '../assets/images/logos/asics.png';
import logoNorthFace   from '../assets/images/logos/north-face.png';
import logoFila        from '../assets/images/logos/fila.png';

// ── Marquee brand list (duplicated for seamless loop) ─────────────────────
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

// ── Category card data ─────────────────────────────────────────────────────
// Dữ liệu thẻ danh mục
const CATEGORIES = [
  {
    label: 'Clothing',
    sub:   'Jerseys, shorts & jackets',
    slug:  'clothing',
    img:   imgClothing,
    bg:    'bg-brand-lime',
    text:  'text-brand-ink',
    btn:   'bg-brand-ink text-brand-lime',
  },
  {
    label: 'Footwear',
    sub:   'Running, football & more',
    slug:  'footwear',
    img:   imgFootwear,
    bg:    'bg-[#C4B5FD]',
    text:  'text-brand-ink',
    btn:   'bg-brand-ink text-white',
  },
  {
    label: 'Equipment',
    sub:   'Rackets, balls & gear',
    slug:  'equipment',
    img:   imgEquipment,
    bg:    'bg-brand-blue',
    text:  'text-brand-ink',
    btn:   'bg-brand-ink text-white',
  },
];

// ── ProductCard sub-component ──────────────────────────────────────────────
// WHY a sub-component? Keeps Home.jsx readable — one card = one concern.
// TẠI SAO dùng sub-component? Giúp Home.jsx dễ đọc — một thẻ = một trách nhiệm.
function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border-2 border-brand-ink hover:border-brand-purple transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col">

      {/* Image — fills the top, zooms on hover */}
      <div className="relative overflow-hidden h-56">
        {product.mainImageUrl ? (
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-brand-cream flex items-center justify-center">
            <span className="text-5xl">🏅</span>
          </div>
        )}
        {product.categoryName && (
          <span className="absolute top-3 left-3 bg-brand-ink text-brand-lime text-xs font-bold px-2 py-1 rounded-full tracking-widest uppercase">
            {product.categoryName}
          </span>
        )}
      </div>

      {/* Footer — name + price + button */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-bold text-brand-ink text-sm leading-tight line-clamp-2 flex-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl text-brand-ink">
            ${product.price?.toFixed(2)}
          </span>
          <button
            onClick={() => addItem(product.id, null, 1)}
            className="px-4 py-2 bg-brand-lime text-brand-ink text-xs font-bold rounded-full hover:bg-brand-purple hover:text-white transition-colors tracking-widest uppercase"
          >
            + Cart
          </button>
        </div>
      </div>

    </div>
  );
}

// ── Main Home component ────────────────────────────────────────────────────
export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading,  setLoading]  = useState(true);

  // Fetch the 4 newest products on mount
  // Tải 4 sản phẩm mới nhất khi component mount
  useEffect(() => {
    productApi.getAll({ pageSize: 4, sortBy: 'newest' })
      .then((res) => setFeatured(res.data.items ?? res.data))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-brand-cream min-h-screen">

      {/* ════════════════════════════════════════════════════════
          SECTION 1 — HERO
          Full-bleed athlete photo, overlaid magazine-style text
          ════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-brand-cream">

        {/* Athlete — shifted up so title lands in the middle of the image */}
        <img
          src={heroImg}
          alt="Athlete"
          className="absolute bottom-[12%] left-1/2 -translate-x-1/2 h-[85%] w-auto object-contain select-none"
          draggable={false}
        />
        {/* Subtle cream wash so text stays readable */}
        <div className="absolute inset-0 bg-brand-cream/25 pointer-events-none" />

        {/* Text layer — clustered around title, pushed slightly above centre */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center gap-2 px-4 -mt-16">

          {/* ── Top annotations — just above NEW ERA ── */}
          <div className="flex justify-between items-end w-full px-[20%]">
            <span className="font-sketch text-5xl text-brand-ink">Gen Z</span>
            <span className="font-sketch text-4xl text-brand-ink flex items-center gap-1">
              Create
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4 Q20 6 22 20" />
                <path d="M18 18 l4 4 l-5 1" />
              </svg>
            </span>
          </div>

          {/* ── NEW ERA ── */}
          <h1 className="font-display leading-none flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[clamp(72px,13vw,190px)] text-brand-ink">NEW</span>
            <span className="text-[clamp(72px,13vw,190px)] text-brand-ink bg-brand-lime px-0 italic">ERA</span>
          </h1>

          {/* ── Bottom annotations — just below NEW ERA ── */}
          <div className="flex items-center justify-between w-full px-[18%] mt-1">
            <span className="font-sketch text-4xl text-brand-ink flex items-center gap-1">
              <svg width="36" height="36" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M24 24 Q8 22 6 8" />
                <path d="M9 11 l-3-4 l4 1" />
              </svg>
              Create
            </span>
            <span className="font-sketch text-4xl text-brand-ink">Movement</span>
          </div>
        </div>

        {/* SHOP NOW — fixed at the very bottom, below the image */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <Link
            to="/products"
            className="px-12 py-4 bg-white text-brand-ink font-bold text-sm tracking-widest uppercase rounded-full border-2 border-brand-ink hover:bg-brand-lime transition-all"
          >
            SHOP NOW
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg className="w-6 h-6 text-brand-ink/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 2 — MARQUEE TICKER
          ════════════════════════════════════════════════════════ */}
      <section className="bg-white py-5 overflow-hidden border-y-2 border-brand-ink">
        <div className="flex animate-marquee whitespace-nowrap">
          {BRANDS.map((brand, i) => (
            <span key={i} className="inline-flex items-center gap-3 mx-8">
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-7 w-auto object-contain grayscale opacity-70"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="font-display text-lg text-brand-ink/60 tracking-widest">
                {brand.name}
              </span>
              <span className="text-brand-ink/20 mx-2">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 3 — CATEGORIES
          ════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-5xl text-brand-ink">
            SHOP BY<br />
            <span className="text-brand-purple">CATEGORY</span>
          </h2>
          <Link to="/products" className="text-sm font-bold tracking-widest uppercase text-brand-ink/50 hover:text-brand-purple transition-colors">
            See all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className={`${cat.bg} ${cat.text} rounded-3xl p-8 flex flex-col min-h-[400px] hover:scale-[1.02] transition-transform group overflow-hidden`}
            >
              {/* Title + subtitle — always at top, never overlapped */}
              <span className="font-display text-5xl tracking-widest leading-none">
                {cat.label.toUpperCase()}
              </span>
              <span className="font-sketch text-lg opacity-60 mt-2">{cat.sub}</span>

              {/* Image fills the middle flex space — sits between text and button */}
              <div className="flex-1 flex items-end justify-center py-4">
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-52 h-52 object-contain drop-shadow-2xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500"
                />
              </div>

              {/* SHOP — white outline pill, same style as reference */}
              <span className="inline-block bg-white text-brand-ink border-2 border-brand-ink px-7 py-2.5 rounded-full font-bold text-sm tracking-widest uppercase w-fit">
                SHOP
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 4 — FEATURED PRODUCTS
          ════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-5xl text-brand-ink">
            NEW<br />
            <span className="text-brand-purple">ARRIVALS</span>
          </h2>
          <Link to="/products" className="text-sm font-bold tracking-widest uppercase text-brand-ink/50 hover:text-brand-purple transition-colors">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-72 border-2 border-brand-ink/10 animate-pulse" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-brand-ink/40">
            <p className="font-display text-3xl">NO PRODUCTS YET</p>
            <p className="text-sm mt-2">Add products from the admin panel to see them here.</p>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 5 — PROMO BANNER
          ════════════════════════════════════════════════════════ */}
      <section className="bg-brand-lime border-y-2 border-brand-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="font-sketch text-brand-purple text-xl">Limited time</p>
            <h2 className="font-display text-6xl text-brand-ink leading-none">
              FREE SHIPPING<br />ON ALL ORDERS
            </h2>
          </div>
          <Link
            to="/products"
            className="flex-shrink-0 px-10 py-5 bg-brand-ink text-brand-lime font-bold text-sm tracking-widest uppercase rounded-full hover:bg-brand-purple hover:text-white transition-all hover:scale-105"
          >
            Shop Now ✦
          </Link>
        </div>
      </section>

    </div>
  );
}
