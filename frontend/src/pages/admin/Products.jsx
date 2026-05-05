// admin/Products.jsx — admin product management with TanStack Table
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

// ── Column helper (typed by shape of product rows) ─────────────────────────
const col = createColumnHelper();

// ── Empty form for CREATE mode ─────────────────────────────────────────────
const emptyForm = () => ({
  name:        '',
  brand:       '',
  description: '',
  price:       '',
  salePrice:   '',
  categoryId:  '',
  isActive:    true,
  imageUrls:   [''],
  variants:    [{ size: '', color: '', stock: 10, extraPrice: 0 }],
});

// ── Pre-fill form from a product row for EDIT mode ─────────────────────────
const formFromProduct = (p) => ({
  name:        p.name,
  brand:       p.brand,
  description: p.description ?? '',
  price:       p.price,
  salePrice:   p.salePrice ?? '',
  categoryId:  p.categoryId,
  isActive:    p.isActive,
  imageUrls:   [''],
  variants:    [{ size: '', color: '', stock: 10, extraPrice: 0 }],
});

// ── Sort indicator ─────────────────────────────────────────────────────────
const SortIcon = ({ column }) => {
  const sorted = column.getIsSorted();
  return (
    <span className="ml-1 inline-block w-3 text-brand-lime/60">
      {sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕'}
    </span>
  );
};

const PAGE_SIZE = 10;

export default function AdminProducts() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // TanStack table state
  const [sorting,     setSorting]     = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // modal: null = closed, 'create' = add new, object = product being edited
  const [modal,     setModal]     = useState(null);
  const [form,      setForm]      = useState(emptyForm());
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState('');

  const isEdit = modal !== null && modal !== 'create';

  // ── Load data ─────────────────────────────────────────────────────────────
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

  // ── Open modals ───────────────────────────────────────────────────────────
  const openCreate = () => { setForm(emptyForm()); setFormError(''); setModal('create'); };
  const openEdit   = (p)  => { setForm(formFromProduct(p)); setFormError(''); setModal(p); };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Soft-delete "${name}"? It will be hidden from the store.`)) return;
    try {
      await productApi.remove(id);
      const nextPage = products.length === 1 && page > 1 ? page - 1 : page;
      setPage(nextPage);
      if (nextPage === page) load(page);
    } catch {
      alert('Failed to delete product.');
    }
  };

  // ── Form helpers ──────────────────────────────────────────────────────────
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

  // ── Submit ────────────────────────────────────────────────────────────────
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
      setModal(null);
      load();
    } catch (err) {
      setFormError(err.response?.data?.detail ?? `Failed to ${isEdit ? 'update' : 'create'} product.`);
    } finally {
      setSaving(false);
    }
  };

  // ── TanStack Table column definitions ─────────────────────────────────────
  const columns = useMemo(() => [
    col.display({
      id: 'image',
      header: '',
      enableSorting: false,
      cell: ({ row: { original: p } }) => p.mainImageUrl ? (
        <img src={p.mainImageUrl} alt={p.name}
          className="w-20 h-20 object-cover rounded-2xl border border-brand-ink/10" />
      ) : (
        <div className="w-20 h-20 rounded-2xl bg-brand-ink/10 flex items-center justify-center text-brand-ink/30 text-xs font-bold">N/A</div>
      ),
    }),
    col.accessor('name', {
      header: 'Name',
      cell: (info) => <span className="font-bold text-brand-ink">{info.getValue()}</span>,
    }),
    col.accessor('brand', {
      header: 'Brand',
      cell: (info) => <span className="text-brand-ink/60 text-xs uppercase tracking-widest">{info.getValue()}</span>,
    }),
    col.accessor('price', {
      header: 'Price',
      cell: ({ row: { original: p } }) => p.salePrice ? (
        <span className="flex items-baseline gap-2">
          <span className="text-brand-purple font-display">${p.salePrice.toFixed(2)}</span>
          <span className="line-through text-brand-ink/30 text-xs">${p.price.toFixed(2)}</span>
        </span>
      ) : (
        <span className="text-brand-purple font-display">${p.price?.toFixed(2)}</span>
      ),
    }),
    col.accessor('categoryName', {
      header: 'Category',
      cell: (info) => <span className="text-brand-ink/60">{info.getValue()}</span>,
    }),
    col.accessor('isActive', {
      header: 'Status',
      cell: (info) => (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${info.getValue() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
          {info.getValue() ? 'Active' : 'Deleted'}
        </span>
      ),
    }),
    col.display({
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row: { original: p } }) => (
        <div className="flex items-center justify-end gap-4">
          <button onClick={() => openEdit(p)}
            className="text-brand-purple text-xs font-bold tracking-widest uppercase hover:text-brand-ink transition-colors">
            Edit
          </button>
          <button onClick={() => handleDelete(p.id, p.name)}
            className="text-red-400 text-xs font-bold tracking-widest uppercase hover:text-red-600 transition-colors">
            Delete
          </button>
        </div>
      ),
    }),
  ], [products]);   // re-create when products change so closures (handleDelete, openEdit) stay fresh

  // ── TanStack Table instance ───────────────────────────────────────────────
  const table = useReactTable({
    data: products,
    columns,
    state:           { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel:     getCoreRowModel(),
    getSortedRowModel:   getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,   // server handles pages — TanStack must not slice data
  });

  // ── Shared input class ────────────────────────────────────────────────────
  const inp = 'border-2 border-brand-ink rounded-xl px-4 py-2 bg-white font-sans text-sm focus:outline-none focus:border-brand-purple w-full';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-display text-5xl text-brand-ink">
              PRODUCTS <span className="text-brand-purple">ADMIN</span>
            </h1>
            <p className="text-brand-ink/50 text-sm mt-1">{totalCount} products total</p>
          </div>
          <button onClick={openCreate}
            className="px-6 py-3 bg-brand-lime text-brand-ink font-display tracking-widest text-sm rounded-2xl border-2 border-brand-ink hover:bg-brand-purple hover:text-white transition-colors">
            + ADD PRODUCT
          </button>
        </div>

        {/* ── Search bar ── */}
        <div className="mb-4">
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search this page..."
            className="w-full max-w-sm border-2 border-brand-ink rounded-2xl px-5 py-2.5 bg-white text-sm font-sans focus:outline-none focus:border-brand-purple"
          />
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-brand-ink overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-brand-ink text-brand-lime">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={`px-6 py-4 text-left font-display tracking-widest select-none
                          ${header.column.getCanSort() ? 'cursor-pointer hover:text-white' : ''}
                          ${header.id === 'image' || header.id === 'actions' ? 'w-16' : ''}`}
                      >
                        {header.isPlaceholder ? null : (
                          <span className="flex items-center gap-1">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && <SortIcon column={header.column} />}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, i) => (
                  <tr key={row.id} className={i % 2 === 0 ? 'bg-brand-cream/30' : ''}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {table.getRowModel().rows.length === 0 && !loading && (
              <p className="text-center py-10 text-brand-ink/40 font-display text-xl">
                {globalFilter ? 'NO RESULTS' : 'NO PRODUCTS'}
              </p>
            )}

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t-2 border-brand-ink/10">
                <p className="text-xs text-brand-ink/50 font-bold tracking-widest">
                  PAGE {page} OF {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-xs font-bold border-2 border-brand-ink rounded-xl disabled:opacity-30 hover:bg-brand-ink hover:text-brand-lime transition-colors"
                  >«</button>
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-xs font-bold border-2 border-brand-ink rounded-xl disabled:opacity-30 hover:bg-brand-ink hover:text-brand-lime transition-colors"
                  >‹ Prev</button>

                  {/* Page number buttons */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                    .reduce((acc, n, idx, arr) => {
                      if (idx > 0 && n - arr[idx - 1] > 1) acc.push('…');
                      acc.push(n);
                      return acc;
                    }, [])
                    .map((n, idx) =>
                      n === '…' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-xs text-brand-ink/40">…</span>
                      ) : (
                        <button
                          key={n}
                          onClick={() => setPage(n)}
                          className={`px-3 py-1.5 text-xs font-bold border-2 rounded-xl transition-colors
                            ${n === page
                              ? 'bg-brand-ink text-brand-lime border-brand-ink'
                              : 'border-brand-ink hover:bg-brand-ink hover:text-brand-lime'}`}
                        >{n}</button>
                      )
                    )}

                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-xs font-bold border-2 border-brand-ink rounded-xl disabled:opacity-30 hover:bg-brand-ink hover:text-brand-lime transition-colors"
                  >Next ›</button>
                  <button
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-xs font-bold border-2 border-brand-ink rounded-xl disabled:opacity-30 hover:bg-brand-ink hover:text-brand-lime transition-colors"
                  >»</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ───────────────────────────────────────────── */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-brand-ink/60 backdrop-blur-sm p-4">
          <div className="bg-brand-cream border-2 border-brand-ink rounded-3xl w-full max-w-2xl my-8">

            <div className="flex items-center justify-between px-8 py-6 border-b-2 border-brand-ink">
              <h2 className="font-display text-3xl text-brand-ink tracking-widest">
                {isEdit ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
              </h2>
              <button onClick={() => setModal(null)} className="text-brand-ink/40 hover:text-brand-ink text-2xl leading-none">✕</button>
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
                      <input value={url} onChange={(e) => setImageUrl(i, e.target.value)} placeholder="https://images.unsplash.com/..." className={inp} />
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
                      <input value={v.size}       onChange={(e) => setVariant(i, 'size', e.target.value)}       placeholder="S / M / L" className={inp} />
                      <input value={v.color}      onChange={(e) => setVariant(i, 'color', e.target.value)}      placeholder="Color"     className={inp} />
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
