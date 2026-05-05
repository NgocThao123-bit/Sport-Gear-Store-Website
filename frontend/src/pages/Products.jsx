// Products.jsx — paginated product listing with category filter + search
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productApi, categoryApi } from '../api/productApi';
import useCartStore from '../store/useCartStore';

// ── ProductCard ────────────────────────────────────────────────────────────
// Whole card is a link; "Add to Cart" stops propagation so click doesn't navigate.
function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border-2 border-brand-ink hover:border-brand-purple transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col"
    >
      {/* Cover image */}
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

      {/* Footer */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex-1">
          <p className="text-brand-ink/40 text-xs font-bold tracking-widest uppercase mb-1">{product.brand}</p>
          <h3 className="font-bold text-brand-ink text-sm leading-tight line-clamp-2">{product.name}</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            {product.salePrice ? (
              <div className="flex items-baseline gap-2">
                <span className="font-display text-xl text-brand-purple">${product.salePrice.toFixed(2)}</span>
                <span className="text-xs line-through text-brand-ink/30">${product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="font-display text-xl text-brand-ink">${product.price?.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); addItem(product.id, null, 1); }}
            className="px-4 py-2 bg-brand-lime text-brand-ink text-xs font-bold rounded-full hover:bg-brand-purple hover:text-white transition-colors tracking-widest uppercase"
          >
            + Cart
          </button>
        </div>
      </div>
    </Link>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
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

  // Fetch categories once on mount
  useEffect(() => {
    categoryApi.getAll().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  // Fetch products — wait for categories if a slug filter is active
  // so we can resolve slug → CategoryId (the API expects a Guid)
  useEffect(() => {
    if (categorySlug && categories.length === 0) return;

    const matched    = categories.find((c) => (c.slug ?? c.name.toLowerCase()) === categorySlug);
    const categoryId = matched?.id ?? undefined;

    setLoading(true);
    productApi
      .getAll({
        pageNumber:  page,
        pageSize,
        categoryId,
        searchTerm:  q || undefined,
      })
      .then((res) => {
        const data = res.data;
        setProducts(data.items ?? data);
        setTotalCount(data.totalCount ?? (data.items ?? data).length);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [categorySlug, categories, page, q]);

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
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Page header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <h1 className="font-display text-6xl text-brand-ink leading-none">
            {categorySlug ? categorySlug.toUpperCase() : 'ALL'}{' '}
            <span className="text-brand-purple">PRODUCTS</span>
          </h1>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="px-4 py-2 rounded-full border-2 border-brand-ink bg-white text-brand-ink text-sm font-bold focus:outline-none focus:border-brand-purple w-56"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-brand-ink text-brand-lime rounded-full text-sm font-bold tracking-widest uppercase hover:bg-brand-purple transition-colors"
            >
              Go
            </button>
          </form>
        </div>

        <div className="flex gap-10">

          {/* ── Sidebar ── */}
          <aside className="hidden md:block w-44 flex-shrink-0">
            <h3 className="font-display text-lg tracking-widest mb-4 text-brand-ink">CATEGORY</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setCategory('')}
                  className={`text-sm font-bold tracking-wide transition-colors ${!categorySlug ? 'text-brand-purple' : 'text-brand-ink/50 hover:text-brand-ink'}`}
                >
                  All Products
                </button>
              </li>
              {categories.map((c) => {
                const slug = c.slug ?? c.name.toLowerCase();
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setCategory(slug)}
                      className={`text-sm font-bold tracking-wide transition-colors ${categorySlug === slug ? 'text-brand-purple' : 'text-brand-ink/50 hover:text-brand-ink'}`}
                    >
                      {c.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* ── Product grid ── */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 border-2 border-brand-ink/10 animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <p className="text-xs font-bold tracking-widest uppercase text-brand-ink/40 mb-5">
                  {totalCount} product{totalCount !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSearchParams({
                          ...(categorySlug && { category: categorySlug }),
                          ...(q && { q }),
                          page: i + 1,
                        })}
                        className={`w-10 h-10 rounded-full font-bold text-sm border-2 transition-colors ${
                          page === i + 1
                            ? 'bg-brand-ink text-brand-lime border-brand-ink'
                            : 'border-brand-ink text-brand-ink hover:bg-brand-ink hover:text-white'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 text-brand-ink/40">
                <p className="font-display text-5xl">NO PRODUCTS</p>
                <p className="text-sm mt-3">Try a different category or search term.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
