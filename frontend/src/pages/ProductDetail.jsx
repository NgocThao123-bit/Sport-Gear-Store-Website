// ProductDetail.jsx — single product page
// ProductDetail.jsx — trang chi tiết sản phẩm
//
// URL PARAM / THAM SỐ URL:
// /products/:slug — slug is the URL-friendly product identifier
// /products/:slug — slug là định danh sản phẩm thân thiện với URL
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi } from '../api/productApi';
import useCartStore   from '../store/useCartStore';

export default function ProductDetail() {
  const { slug }    = useParams();
  const navigate    = useNavigate();
  const addItem     = useCartStore((s) => s.addItem);

  const [product,  setProduct]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added,    setAdded]    = useState(false);

  useEffect(() => {
    productApi.getBySlug(slug)
      .then((res) => setProduct(res.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  const handleAddToCart = async () => {
    await addItem(product.id, null, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* ── Product image ── */}
          <div className="bg-white rounded-3xl border-2 border-brand-ink p-10 flex items-center justify-center min-h-[400px]">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-h-80 w-auto object-contain drop-shadow-2xl"
              />
            ) : (
              <div className="text-8xl">🏅</div>
            )}
          </div>

          {/* ── Product info ── */}
          <div className="flex flex-col gap-6">
            {product.categoryName && (
              <span className="bg-brand-lime text-brand-ink text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase w-fit">
                {product.categoryName}
              </span>
            )}
            <h1 className="font-display text-5xl text-brand-ink leading-tight">{product.name}</h1>
            <p className="text-brand-ink/60 leading-relaxed">{product.description}</p>
            <p className="font-display text-5xl text-brand-purple">${product.price?.toFixed(2)}</p>

            {/* Quantity selector */}
            {/* Bộ chọn số lượng */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold tracking-widest uppercase">Qty:</span>
              <div className="flex items-center border-2 border-brand-ink rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-brand-ink font-bold hover:bg-brand-ink hover:text-white transition-colors"
                >−</button>
                <span className="px-4 font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2 text-brand-ink font-bold hover:bg-brand-ink hover:text-white transition-colors"
                >+</button>
              </div>
            </div>

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
      </div>
    </div>
  );
}
