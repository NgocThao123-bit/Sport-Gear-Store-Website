// ProductDetail.jsx — full product detail page
// URL: /products/:slug
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import useCartStore   from '../store/useCartStore';
import useAuthStore   from '../store/useAuthStore';

// ── Star row ──────────────────────────────────────────────────────────────
function Stars({ rating, size = 'text-sm' }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`${size} ${i <= Math.round(rating) ? 'text-brand-lime' : 'text-brand-ink/20'}`}>
          ★
        </span>
      ))}
    </div>
  );
}

// ── Tiny related product card ─────────────────────────────────────────────
function RelatedCard({ product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group bg-white rounded-2xl border-2 border-brand-ink hover:border-brand-purple hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
    >
      <div className="aspect-square overflow-hidden bg-brand-cream">
        {product.mainImageUrl ? (
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🏅</div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1">
        <p className="font-bold text-brand-ink text-sm line-clamp-1">{product.name}</p>
        <p className="font-display text-brand-purple">
          ${(product.salePrice ?? product.price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}

export default function ProductDetail() {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const addItem    = useCartStore((s) => s.addItem);
  const { user }   = useAuthStore();

  const [product,   setProduct]   = useState(null);
  const [loading,   setLoading]   = useState(true);  // true until first fetch resolves
  const [activeImg, setActiveImg] = useState(null);
  const [selSize,   setSelSize]   = useState(null);
  const [selColor,  setSelColor]  = useState(null);
  const [quantity,  setQuantity]  = useState(1);
  const [adding,    setAdding]    = useState(false);
  const [added,     setAdded]     = useState(false);
  const [related,   setRelated]   = useState([]);

  useEffect(() => {
    let cancelled = false;

    productApi.getBySlug(slug)
      .then((res) => {
        if (cancelled) return;
        const data = res.data;
        setProduct(data);
        setLoading(false);
        setSelSize(null);
        setSelColor(null);
        setQuantity(1);
        setAdded(false);
        const main = data.images?.find((i) => i.isMain) ?? data.images?.[0];
        setActiveImg(main?.imageUrl ?? null);

        if (data.categoryId) {
          productApi.getAll({ categoryId: data.categoryId, pageSize: 5 })
            .then((r) => {
              if (cancelled) return;
              const items = r.data.items ?? r.data;
              setRelated(items.filter((p) => p.slug !== slug).slice(0, 4));
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        if (!cancelled) navigate('/products');
      });

    return () => { cancelled = true; };
  }, [slug, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return null;

  // ── Variant selectors ────────────────────────────────────────────────────
  const sizes  = [...new Set(product.variants?.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(product.variants?.map((v) => v.color).filter(Boolean))];

  const selectedVariant = product.variants?.find((v) => {
    if (selSize  && v.size  !== selSize)  return false;
    if (selColor && v.color !== selColor) return false;
    return true;
  }) ?? null;

  const basePrice  = product.salePrice ?? product.price;
  const finalPrice = selectedVariant?.extraPrice
    ? basePrice + selectedVariant.extraPrice
    : basePrice;

  // Stock: if a variant is selected use its stock, otherwise sum all variants
  const stock = selectedVariant
    ? selectedVariant.stock
    : product.variants?.length
      ? product.variants.reduce((sum, v) => sum + v.stock, 0)
      : null;

  const outOfStock = stock !== null && stock === 0;

  const stockLabel = () => {
    if (stock === null) return null;
    if (stock === 0)    return { text: 'Out of stock', color: 'text-red-500' };
    if (stock <= 5)     return { text: `Only ${stock} left!`, color: 'text-orange-500' };
    return               { text: 'In stock', color: 'text-green-600' };
  };

  const stockInfo = stockLabel();

  // ── Add to cart ──────────────────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    if (outOfStock) return;
    setAdding(true);
    try {
      await addItem(product.id, selectedVariant?.id ?? null, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } finally {
      setAdding(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-brand-ink/40 mb-10">
          <Link to="/" className="hover:text-brand-ink transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-brand-ink transition-colors">Products</Link>
          <span>/</span>
          <Link
            to={`/products?category=${product.categoryName?.toLowerCase()}`}
            className="hover:text-brand-ink transition-colors"
          >
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-brand-ink line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* ── Left: images ─────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl border-2 border-brand-ink overflow-hidden aspect-square">
              {activeImg ? (
                <img src={activeImg} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl">🏅</span>
                </div>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImg(img.imageUrl)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-colors ${
                      activeImg === img.imageUrl
                        ? 'border-brand-purple'
                        : 'border-brand-ink/20 hover:border-brand-ink'
                    }`}
                  >
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: info ──────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Category + Brand */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-brand-lime text-brand-ink text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                {product.categoryName}
              </span>
              <span className="text-brand-ink/40 text-xs font-bold tracking-widest uppercase">
                {product.brand}
              </span>
            </div>

            {/* Name */}
            <h1 className="font-display text-5xl text-brand-ink leading-tight">{product.name}</h1>

            {/* Rating row */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-3">
                <Stars rating={product.averageRating} size="text-base" />
                <span className="text-brand-ink/60 text-sm font-bold">
                  {product.averageRating?.toFixed(1)}
                </span>
                <span className="text-brand-ink/30 text-sm">
                  ({product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl text-brand-purple">${finalPrice.toFixed(2)}</span>
              {product.salePrice && (
                <span className="font-display text-2xl text-brand-ink/30 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
              {product.salePrice && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                  -{Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-brand-ink/60 leading-relaxed text-sm">{product.description}</p>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-2 text-brand-ink">
                  Size {selSize && <span className="text-brand-purple">— {selSize}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelSize(selSize === s ? null : s)}
                      className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-colors ${
                        selSize === s
                          ? 'bg-brand-ink text-brand-lime border-brand-ink'
                          : 'border-brand-ink text-brand-ink hover:bg-brand-ink hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selector */}
            {colors.length > 0 && (
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-2 text-brand-ink">
                  Color {selColor && <span className="text-brand-purple">— {selColor}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelColor(selColor === c ? null : c)}
                      className={`px-4 py-2 rounded-full border-2 text-sm font-bold transition-colors ${
                        selColor === c
                          ? 'bg-brand-ink text-brand-lime border-brand-ink'
                          : 'border-brand-ink text-brand-ink hover:bg-brand-ink hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock indicator */}
            {stockInfo && (
              <p className={`text-sm font-bold ${stockInfo.color}`}>
                {stockInfo.text}
              </p>
            )}

            {/* Quantity */}
            {!outOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold tracking-widest uppercase text-brand-ink">Qty</span>
                <div className="flex items-center border-2 border-brand-ink rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 font-bold hover:bg-brand-ink hover:text-white transition-colors"
                  >
                    −
                  </button>
                  <span className="px-5 font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock ?? 99, q + 1))}
                    className="px-4 py-2 font-bold hover:bg-brand-ink hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              disabled={outOfStock || adding}
              className={`px-10 py-4 font-bold text-sm tracking-widest uppercase rounded-full transition-all disabled:cursor-not-allowed ${
                outOfStock
                  ? 'bg-brand-ink/20 text-brand-ink/40'
                  : added
                    ? 'bg-green-400 text-white scale-95'
                    : 'bg-brand-lime text-brand-ink hover:bg-brand-purple hover:text-white hover:scale-105'
              }`}
            >
              {outOfStock ? 'Out of Stock' : adding ? 'Adding...' : added ? '✓ Added to Cart!' : 'Add to Cart →'}
            </button>

            {/* Login nudge for guests */}
            {!user && (
              <p className="text-xs text-brand-ink/40 text-center">
                <Link to="/login" className="text-brand-purple font-bold hover:underline">Sign in</Link>
                {' '}to add items to your cart
              </p>
            )}

          </div>
        </div>

        {/* ── Reviews ─────────────────────────────────────────────── */}
        {product.reviews?.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end gap-4 mb-8">
              <h2 className="font-display text-4xl text-brand-ink">REVIEWS</h2>
              <div className="flex items-center gap-2 mb-1">
                <Stars rating={product.averageRating} size="text-lg" />
                <span className="font-display text-2xl text-brand-purple">
                  {product.averageRating?.toFixed(1)}
                </span>
                <span className="text-brand-ink/40 text-sm">/ 5</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.reviews.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl border-2 border-brand-ink p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-brand-ink text-sm">{r.userFullName}</p>
                      <p className="text-brand-ink/30 text-xs">
                        {new Date(r.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </p>
                    </div>
                    <Stars rating={r.rating} />
                  </div>
                  {r.comment && (
                    <p className="text-brand-ink/60 text-sm leading-relaxed">{r.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Related Products ─────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-4xl text-brand-ink mb-8">
              YOU MAY ALSO <span className="text-brand-purple">LIKE</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {related.map((p) => (
                <RelatedCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
