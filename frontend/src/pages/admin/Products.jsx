// admin/Products.jsx — product management table (redesigned)
import { useEffect, useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { productApi, categoryApi } from '../../api/productApi';

const col = createColumnHelper();

// ── Row background by category ─────────────────────────────────────────────
const getCategoryBg = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('clothing'))  return '#f2ffe0';  // lime pastel
  if (n.includes('footwear'))  return '#e0f2ff';  // blue pastel
  if (n.includes('equipment')) return '#f0ebff';  // purple pastel
  return '#ffffff';
};

const getCategoryDot = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('clothing'))  return '#84cc16';
  if (n.includes('footwear'))  return '#38bdf8';
  if (n.includes('equipment')) return '#a78bfa';
  return '#94a3b8';
};

// ── SVG Icons ──────────────────────────────────────────────────────────────
const IconEdit = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconPlus = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SortIcon = ({ column }) => {
  const s = column.getIsSorted();
  return <span className="ml-1 text-brand-lime/60">{s === 'asc' ? '↑' : s === 'desc' ? '↓' : '↕'}</span>;
};

// ── Form helpers ───────────────────────────────────────────────────────────
const emptyForm = () => ({
  name: '', brand: '', description: '', price: '', salePrice: '',
  categoryId: '', isActive: true, imageUrls: [''],
  variants: [{ size: '', color: '', stock: 10, extraPrice: 0 }],
});

const formFromProduct = (p) => ({
  name: p.name, brand: p.brand, description: p.description ?? '',
  price: p.price, salePrice: p.salePrice ?? '', categoryId: p.categoryId,
  isActive: p.isActive, imageUrls: [''],
  variants: [{ size: '', color: '', stock: 10, extraPrice: 0 }],
});

const PAGE_SIZE = 10;

export default function AdminProducts() {
  const [products,     setProducts]     = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [totalCount,   setTotalCount]   = useState(0);
  const [sorting,      setSorting]      = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [modal,        setModal]        = useState(null);
  const [form,         setForm]         = useState(emptyForm());
  const [saving,       setSaving]       = useState(false);
  const [formError,    setFormError]    = useState('');

  const isEdit = modal !== null && modal !== 'create';

  const load = (pageNumber = page) => {
    setLoading(true);
    Promise.all([
      productApi.getAll({ pageNumber, pageSize: PAGE_SIZE }),
      categoryApi.getAll(),
    ])
      .then(([prodRes, catRes]) => {
        const data = prodRes.data;
        setProducts(data.items ?? data);
        setTotalPages(data.totalPages ?? 1);
        setTotalCount(data.totalCount ?? (data.items?.length ?? 0));
        setCategories(catRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);

  const openCreate = () => { setForm(emptyForm());          setFormError(''); setModal('create'); };
  const openEdit   = (p)  => { setForm(formFromProduct(p)); setFormError(''); setModal(p); };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Soft-delete "${name}"? It will be hidden from the store.`)) return;
    try {
      await productApi.remove(id);
      const nextPage = products.length === 1 && page > 1 ? page - 1 : page;
      setPage(nextPage);
      if (nextPage === page) load(page);
    } catch { alert('Failed to delete product.'); }
  };

  const setField      = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setVariant    = (i, k, v) => setForm((f) => { const a = [...f.variants]; a[i] = { ...a[i], [k]: v }; return { ...f, variants: a }; });
  const addVariant    = () => setForm((f) => ({ ...f, variants: [...f.variants, { size: '', color: '', stock: 10, extraPrice: 0 }] }));
  const removeVariant = (i) => setForm((f) => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }));
  const setImageUrl   = (i, v) => setForm((f) => { const a = [...f.imageUrls]; a[i] = v; return { ...f, imageUrls: a }; });
  const addImage      = () => setForm((f) => ({ ...f, imageUrls: [...f.imageUrls, ''] }));
  const removeImage   = (i) => setForm((f) => ({ ...f, imageUrls: f.imageUrls.filter((_, idx) => idx !== i) }));

  const validate = () => {
    if (!form.name.trim())                 return 'Product name is required.';
    if (!form.brand.trim())                return 'Brand is required.';
    if (!form.categoryId)                  return 'Category is required.';
    if (!form.price || isNaN(+form.price)) return 'Valid price is required.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setFormError(err);
    if (!isEdit) {
      const imgs = form.imageUrls.filter((u) => u.trim());
      if (!imgs.length) return setFormError('At least one image URL is required.');
    }
    setSaving(true); setFormError('');
    try {
      if (isEdit) {
        await productApi.update(modal.id, {
          id: modal.id, name: form.name.trim(), brand: form.brand.trim(),
          description: form.description.trim() || null, price: +form.price,
          salePrice: form.salePrice ? +form.salePrice : null,
          categoryId: form.categoryId, isActive: form.isActive,
        });
      } else {
        const imgs = form.imageUrls.filter((u) => u.trim());
        await productApi.create({
          name: form.name.trim(), brand: form.brand.trim(),
          description: form.description.trim() || null, price: +form.price,
          salePrice: form.salePrice ? +form.salePrice : null,
          categoryId: form.categoryId, imageUrls: imgs, mainImageUrl: imgs[0],
          variants: form.variants.filter((v) => v.size || v.color)
            .map((v) => ({ size: v.size || null, color: v.color || null, stock: +v.stock, extraPrice: +v.extraPrice })),
        });
      }
      setModal(null); load();
    } catch (err) {
      setFormError(err.response?.data?.detail ?? `Failed to ${isEdit ? 'update' : 'create'} product.`);
    } finally { setSaving(false); }
  };

  // ── Columns ────────────────────────────────────────────────────────────────
  const columns = useMemo(() => [
    // Image — wide column
    col.display({
      id: 'image',
      header: '',
      enableSorting: false,
      cell: ({ row: { original: p } }) => p.mainImageUrl ? (
        <img src={p.mainImageUrl} alt={p.name}
          className="w-20 h-20 object-contain rounded-xl border-2 border-brand-ink/10 bg-white"
          style={{ mixBlendMode: 'multiply' }} />
      ) : (
        <div className="w-20 h-20 rounded-xl bg-brand-ink/8 border-2 border-brand-ink/10 flex items-center justify-center">
          <span className="text-brand-ink/20 text-xs font-bold font-display tracking-widest">N/A</span>
        </div>
      ),
    }),

    // Name — single line with native tooltip
    col.accessor('name', {
      header: 'Name',
      cell: (info) => (
        <div className="max-w-[220px]">
          <p className="font-bold text-brand-ink text-sm truncate leading-snug" title={info.getValue()}>
            {info.getValue()}
          </p>
          <p className="text-brand-ink/40 text-xs tracking-widest uppercase mt-0.5">
            {info.row.original.brand}
          </p>
        </div>
      ),
    }),

    // Price
    col.accessor('price', {
      header: 'Price',
      cell: ({ row: { original: p } }) => p.salePrice ? (
        <div className="flex flex-col gap-0.5">
          <span className="text-brand-purple font-display text-base">${p.salePrice.toFixed(2)}</span>
          <span className="line-through text-brand-ink/30 text-xs">${p.price.toFixed(2)}</span>
        </div>
      ) : (
        <span className="text-brand-purple font-display text-base">${p.price?.toFixed(2)}</span>
      ),
    }),

    // Category — colored dot + name
    col.accessor('categoryName', {
      header: 'Category',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: getCategoryDot(info.getValue()) }} />
          <span className="text-brand-ink/70 text-sm font-medium">{info.getValue()}</span>
        </div>
      ),
    }),

    // Status
    col.accessor('isActive', {
      header: 'Status',
      enableSorting: false,
      cell: (info) => (
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${
          info.getValue() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'
        }`}>
          {info.getValue() ? '● Active' : '○ Hidden'}
        </span>
      ),
    }),

    // Actions — icon buttons
    col.display({
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row: { original: p } }) => (
        <div className="flex items-center justify-end gap-2 pr-2">
          <button
            onClick={() => openEdit(p)}
            title="Edit product"
            className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white transition-all"
          >
            <IconEdit />
          </button>
          <button
            onClick={() => handleDelete(p.id, p.name)}
            title="Delete product"
            className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-all"
          >
            <IconTrash />
          </button>
        </div>
      ),
    }),
  ], [products]);

  const table = useReactTable({
    data: products, columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel:     getCoreRowModel(),
    getSortedRowModel:   getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
  });

  const inp = 'border-2 border-brand-ink rounded-xl px-4 py-2 bg-white font-sans text-sm focus:outline-none focus:border-brand-purple w-full';

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-display text-5xl text-brand-ink">
              PRODUCTS <span className="text-brand-purple">ADMIN</span>
            </h1>
            <p className="text-brand-ink/50 text-sm mt-1">{totalCount} products total</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-6 py-3 bg-brand-lime text-brand-ink font-display tracking-widest text-sm rounded-2xl border-2 border-brand-ink hover:bg-brand-purple hover:text-white transition-colors">
            <IconPlus />
            ADD PRODUCT
          </button>
        </div>

        {/* ── Legend + Search row ── */}
        <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
          {/* Category color legend */}
          <div className="flex items-center gap-5">
            {[
              { label: 'Clothing',  color: '#84cc16', bg: '#f2ffe0' },
              { label: 'Footwear',  color: '#38bdf8', bg: '#e0f2ff' },
              { label: 'Equipment', color: '#a78bfa', bg: '#f0ebff' },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-ink/15"
                style={{ backgroundColor: c.bg }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-xs font-bold text-brand-ink/60 tracking-widest uppercase">{c.label}</span>
              </div>
            ))}
          </div>

          {/* Search with icon */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/35 pointer-events-none">
              <IconSearch />
            </span>
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search products..."
              className="border-2 border-brand-ink rounded-2xl pl-10 pr-5 py-2.5 bg-white text-sm font-sans focus:outline-none focus:border-brand-purple w-72"
            />
          </div>
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-brand-ink overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-brand-ink text-brand-lime">
                  {table.getHeaderGroups()[0].headers.map((header) => (
                    <th key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={`px-5 py-5 text-left font-display tracking-widest text-sm select-none
                        ${header.column.getCanSort() ? 'cursor-pointer hover:text-white' : ''}
                        ${header.id === 'image'   ? 'w-36' : ''}
                        ${header.id === 'actions' ? 'w-28' : ''}`}>
                      <span className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && <SortIcon column={header.column} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-ink/6">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}
                    style={{ backgroundColor: getCategoryBg(row.original.categoryName) }}
                    className="transition-all hover:brightness-95">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {table.getRowModel().rows.length === 0 && (
              <p className="text-center py-16 text-brand-ink/30 font-display text-2xl tracking-widest">
                {globalFilter ? 'NO RESULTS' : 'NO PRODUCTS'}
              </p>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t-2 border-brand-ink/10">
                <p className="text-xs text-brand-ink/50 font-bold tracking-widest">
                  PAGE {page} OF {totalPages}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(1)} disabled={page === 1}
                    className="px-3 py-1.5 text-xs font-bold border-2 border-brand-ink rounded-xl disabled:opacity-30 hover:bg-brand-ink hover:text-brand-lime transition-colors">«</button>
                  <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}
                    className="px-3 py-1.5 text-xs font-bold border-2 border-brand-ink rounded-xl disabled:opacity-30 hover:bg-brand-ink hover:text-brand-lime transition-colors">‹ Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                    .reduce((acc, n, idx, arr) => {
                      if (idx > 0 && n - arr[idx - 1] > 1) acc.push('…');
                      acc.push(n); return acc;
                    }, [])
                    .map((n, idx) => n === '…'
                      ? <span key={`e${idx}`} className="px-2 py-1.5 text-xs text-brand-ink/40">…</span>
                      : <button key={n} onClick={() => setPage(n)}
                          className={`px-3 py-1.5 text-xs font-bold border-2 rounded-xl transition-colors
                            ${n === page ? 'bg-brand-ink text-brand-lime border-brand-ink' : 'border-brand-ink hover:bg-brand-ink hover:text-brand-lime'}`}>
                          {n}
                        </button>
                    )}
                  <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}
                    className="px-3 py-1.5 text-xs font-bold border-2 border-brand-ink rounded-xl disabled:opacity-30 hover:bg-brand-ink hover:text-brand-lime transition-colors">Next ›</button>
                  <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
                    className="px-3 py-1.5 text-xs font-bold border-2 border-brand-ink rounded-xl disabled:opacity-30 hover:bg-brand-ink hover:text-brand-lime transition-colors">»</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ── */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-brand-ink/60 backdrop-blur-sm p-4">
          <div className="bg-brand-cream border-2 border-brand-ink rounded-3xl w-full max-w-2xl my-8">

            <div className="flex items-center justify-between px-8 py-6 border-b-2 border-brand-ink">
              <div className="flex items-center gap-3">
                {isEdit ? <IconEdit /> : <IconPlus />}
                <h2 className="font-display text-3xl text-brand-ink tracking-widest">
                  {isEdit ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
                </h2>
              </div>
              <button onClick={() => setModal(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-brand-ink text-brand-ink/50 hover:bg-brand-ink hover:text-brand-lime transition-colors text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold tracking-widest uppercase text-brand-ink/60">Name *</label>
                  <input value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Nike Dri-FIT T-Shirt" className={inp} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold tracking-widest uppercase text-brand-ink/60">Brand *</label>
                  <input value={form.brand} onChange={(e) => setField('brand', e.target.value)} placeholder="Nike" className={inp} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold tracking-widest uppercase text-brand-ink/60">Description</label>
                <textarea value={form.description} onChange={(e) => setField('description', e.target.value)} rows={3} placeholder="Product details..." className={`${inp} resize-none`} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold tracking-widest uppercase text-brand-ink/60">Price ($) *</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setField('price', e.target.value)} placeholder="49.99" className={inp} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold tracking-widest uppercase text-brand-ink/60">Sale Price ($)</label>
                  <input type="number" step="0.01" min="0" value={form.salePrice} onChange={(e) => setField('salePrice', e.target.value)} placeholder="39.99" className={inp} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold tracking-widest uppercase text-brand-ink/60">Category *</label>
                  <select value={form.categoryId} onChange={(e) => setField('categoryId', e.target.value)} className={inp}>
                    <option value="">Select...</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {isEdit && (
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setField('isActive', !form.isActive)}
                    className={`relative w-12 h-6 rounded-full border-2 border-brand-ink transition-colors ${form.isActive ? 'bg-brand-lime' : 'bg-brand-ink/20'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-brand-ink transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                  <span className="text-sm font-bold text-brand-ink">
                    {form.isActive ? 'Active (visible in store)' : 'Inactive (hidden from store)'}
                  </span>
                </div>
              )}

              {!isEdit && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-brand-ink/60">Image URLs *</label>
                  {form.imageUrls.map((url, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={url} onChange={(e) => setImageUrl(i, e.target.value)} placeholder="https://..." className={inp} />
                      {form.imageUrls.length > 1 && (
                        <button type="button" onClick={() => removeImage(i)} className="px-3 text-red-400 hover:text-red-600 font-bold flex-shrink-0">✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addImage} className="self-start text-xs font-bold tracking-widest uppercase text-brand-purple hover:text-brand-ink">+ Add Image</button>
                </div>
              )}

              {!isEdit && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold tracking-widest uppercase text-brand-ink/60">
                    Variants <span className="normal-case font-normal">(size + color combinations)</span>
                  </label>
                  {form.variants.map((v, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 items-center">
                      <input value={v.size}  onChange={(e) => setVariant(i, 'size', e.target.value)}  placeholder="S / M / L" className={inp} />
                      <input value={v.color} onChange={(e) => setVariant(i, 'color', e.target.value)} placeholder="Color"     className={inp} />
                      <input type="number" min="0" value={v.stock} onChange={(e) => setVariant(i, 'stock', e.target.value)} placeholder="Stock" className={inp} />
                      <div className="flex gap-2 items-center">
                        <input type="number" step="0.01" min="0" value={v.extraPrice} onChange={(e) => setVariant(i, 'extraPrice', e.target.value)} placeholder="+$" className={inp} />
                        {form.variants.length > 1 && (
                          <button type="button" onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-600 font-bold text-sm flex-shrink-0">✕</button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addVariant} className="self-start text-xs font-bold tracking-widest uppercase text-brand-purple hover:text-brand-ink">+ Add Variant</button>
                </div>
              )}

              {isEdit && (
                <p className="text-xs text-brand-ink/40 italic">Note: images and variants cannot be changed here.</p>
              )}

              {formError && (
                <p className="text-red-500 text-sm font-bold border border-red-200 bg-red-50 rounded-xl px-4 py-2">{formError}</p>
              )}

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setModal(null)}
                  className="flex-1 py-3 border-2 border-brand-ink rounded-2xl font-display tracking-widest text-sm hover:bg-brand-ink hover:text-brand-cream transition-colors">
                  CANCEL
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-brand-lime border-2 border-brand-ink rounded-2xl font-display tracking-widest text-sm hover:bg-brand-purple hover:text-white transition-colors disabled:opacity-50">
                  {saving ? 'SAVING...' : isEdit ? 'SAVE CHANGES' : 'CREATE PRODUCT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
