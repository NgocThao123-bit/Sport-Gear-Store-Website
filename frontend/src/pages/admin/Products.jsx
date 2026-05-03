// admin/Products.jsx — admin product management
// admin/Products.jsx — quản lý sản phẩm dành cho admin
import { useEffect, useState } from 'react';
import { productApi } from '../../api/productApi';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const load = () => {
    setLoading(true);
    productApi.getAll({ pageSize: 50 })
      .then((res) => setProducts(res.data.items ?? res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await productApi.remove(id);
    load();
  };

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-5xl text-brand-ink mb-8">
          PRODUCTS <span className="text-brand-purple">ADMIN</span>
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-brand-ink overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-brand-ink text-brand-lime">
                <tr>
                  <th className="text-left px-6 py-4 font-display tracking-widest">NAME</th>
                  <th className="text-left px-6 py-4 font-display tracking-widest">PRICE</th>
                  <th className="text-left px-6 py-4 font-display tracking-widest">CATEGORY</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} className={i % 2 === 0 ? 'bg-brand-cream/30' : ''}>
                    <td className="px-6 py-4 font-bold text-brand-ink">{p.name}</td>
                    <td className="px-6 py-4 text-brand-purple font-display">${p.price?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-brand-ink/60">{p.categoryName}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-500 text-xs font-bold tracking-widest uppercase hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <p className="text-center py-10 text-brand-ink/40 font-display text-xl">NO PRODUCTS</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
