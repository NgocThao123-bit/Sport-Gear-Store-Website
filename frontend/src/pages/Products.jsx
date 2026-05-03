// Products.jsx — product listing page with filters
// Products.jsx — trang danh sách sản phẩm với bộ lọc
//
// COMING SOON / SẮP RA MẮT:
// This page will have a sidebar filter (category, price range) and a product grid.
// Trang này sẽ có bộ lọc thanh bên (danh mục, khoảng giá) và lưới sản phẩm.
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productApi, categoryApi } from '../api/productApi';
import useCartStore from '../store/useCartStore';

function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border-2 border-brand-ink hover:border-brand-purple transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative bg-brand-cream h-52 flex items-center justify-center p-6">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-40 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-brand-lime/30 flex items-center justify-center">
            <span className="text-4xl">🏅</span>
          </div>
        )}
        {product.categoryName && (
          <span className="absolute top-3 left-3 bg-brand-ink text-brand-lime text-xs font-bold px-2 py-1 rounded-full tracking-widest uppercase">
            {product.categoryName}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-bold text-brand-ink text-sm leading-tight line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-display text-xl text-brand-ink">${product.price?.toFixed(2)}</span>
          <button
            onClick={() => addItem(product.id, null, 1)}
            className="px-3 py-2 bg-brand-lime text-brand-ink text-xs font-bold rounded-full hover:bg-brand-purple hover:text-white transition-colors tracking-widest uppercase"
          >
            + Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const category = searchParams.get('category') || '';
  const page     = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 12;

  useEffect(() => {
    setLoading(true);
    productApi.getAll({ category, page, pageSize })
      .then((res) => {
        const data = res.data;
        setProducts(data.items ?? data);
        setTotalCount(data.totalCount ?? (data.items ?? data).length);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, page]);

  useEffect(() => {
    categoryApi.getAll().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-6xl text-brand-ink mb-10">
          {category ? category.toUpperCase() : 'ALL'}{' '}
          <span className="text-brand-purple">PRODUCTS</span>
        </h1>

        <div className="flex gap-8">
          {/* ── Sidebar filter ── */}
          <aside className="hidden md:block w-48 flex-shrink-0">
            <h3 className="font-display text-xl tracking-widest mb-4">CATEGORY</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSearchParams({})}
                  className={`text-sm font-bold tracking-wide ${!category ? 'text-brand-purple' : 'text-brand-ink/60 hover:text-brand-ink'}`}
                >
                  All Sports
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setSearchParams({ category: c.slug ?? c.name.toLowerCase() })}
                    className={`text-sm font-bold tracking-wide ${category === (c.slug ?? c.name.toLowerCase()) ? 'text-brand-purple' : 'text-brand-ink/60 hover:text-brand-ink'}`}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* ── Product grid ── */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl h-72 border-2 border-brand-ink/10 animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSearchParams({ category, page: i + 1 })}
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
              <div className="text-center py-20 text-brand-ink/40">
                <p className="font-display text-4xl">NO PRODUCTS</p>
                <p className="text-sm mt-2">Try a different category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
