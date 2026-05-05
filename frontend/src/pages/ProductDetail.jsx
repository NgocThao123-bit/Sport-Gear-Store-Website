// ProductDetail.jsx — full product detail page
// URL: /products/:slug
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import useCartStore   from '../store/useCartStore';

export default function ProductDetail() {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const addItem    = useCartStore((s) => s.addItem);

  const [product,   setProduct]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [activeImg, setActiveImg] = useState(null);
  const [selSize,   setSelSize]   = useState(null);
  const [selColor,  setSelColor]  = useState(null);
  const [quantity,  setQuantity]  = useState(1);
  const [added,     setAdded]     = useState(false);

  useEffect(() => {
    productApi.getBySlug(slug)
      .then((res) => {
        setProduct(res.data);
        const main = res.data.images?.find((i) => i.isMain) ?? res.data.images?.[0];
        setActiveImg(main?.imageUrl ?? null);
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return null;

  // Unique sizes and colors from variants
  const sizes  = [...new Set(product.variants?.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(product.variants?.map((v) => v.color).filter(Boolean))];

  // Find the selected variant (best match for chosen size + color)
  const selectedVariant = product.variants?.find((v) => {
    if (selSize  && v.size  !== selSize)  return false;
    if (selColor && v.color !== selColor) return false;
    return true;
  }) ?? null;

  const basePrice  = product.salePrice ?? product.price;
  const finalPrice = selectedVariant?.extraPrice
    ? basePrice + selectedVariant.extraPrice
    : basePrice;

  const handleAddToCart = async () => {
    await addItem(product.id, selectedVariant?.id ?? null, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

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

          {/* ── Left: images ────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl border-2 border-brand-ink overflow-hidden aspect-square">
              {activeImg ? (
                <img
                  src={activeImg}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl">🏅</span>
                </div>
              )}
            </div>

            {/* Thumbnail strip — only shown when >1 image */}
            {product.images?.length > 1 && (
              <div className="flex gap-3">
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

          {/* ── Right: info ─────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Category + Brand badges */}
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

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl text-brand-purple">${finalPrice.toFixed(2)}</span>
              {product.salePrice && (
                <span className="font-display text-2xl text-brand-ink/30 line-through">
                  ${product.price.toFixed(2)}
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
                <p className="text-xs font-bold tracking-widest uppercase mb-2 text-brand-ink">Size</p>
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
                <p className="text-xs font-bold tracking-widest uppercase mb-2 text-brand-ink">Color</p>
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

            {/* Quantity */}
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
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2 font-bold hover:bg-brand-ink hover:text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className={`px-10 py-4 font-bold text-sm tracking-widest uppercase rounded-full transition-all ${
                added
                  ? 'bg-green-400 text-white scale-95'
                  : 'bg-brand-lime text-brand-ink hover:bg-brand-purple hover:text-white hover:scale-105'
              }`}
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart →'}
            </button>

          </div>
        </div>

        {/* ── Reviews ───────────────────────────────────────────── */}
        {product.reviews?.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-4xl text-brand-ink mb-2">REVIEWS</h2>
            <p className="text-brand-ink/40 text-sm font-bold mb-8">
              {product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''} · avg{' '}
              {product.averageRating?.toFixed(1)} ★
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.reviews.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl border-2 border-brand-ink p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-brand-ink text-sm">{r.userFullName}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < r.rating ? 'text-brand-lime' : 'text-brand-ink/20'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {r.comment && (
                    <p className="text-brand-ink/60 text-sm leading-relaxed">{r.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
