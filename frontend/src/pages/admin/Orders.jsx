// admin/Orders.jsx — admin order management with TanStack Table + detail drawer
import { useEffect, useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { orderApi } from '../../api/orderApi';

const col = createColumnHelper();

const STATUS_COLORS = {
  Pending:    'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped:    'bg-brand-blue/20 text-brand-blue',
  Delivered:  'bg-green-100 text-green-700',
  Cancelled:  'bg-red-100 text-red-600',
};

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const PAGE_SIZE = 10;

const SortIcon = ({ column }) => {
  const s = column.getIsSorted();
  return (
    <span className="ml-1 inline-block w-3 text-brand-lime/60">
      {s === 'asc' ? '↑' : s === 'desc' ? '↓' : '↕'}
    </span>
  );
};

const fmt = (date) =>
  new Date(date).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

// ── Order Detail Drawer ────────────────────────────────────────────────────
function OrderDrawer({ orderId, onClose, onStatusChange }) {
  const [detail,  setDetail]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDetail(null);
    setLoading(true);
    orderApi.getById(orderId)
      .then((res) => setDetail(res.data))
      .catch(() => onClose())
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleStatus = async (newStatus) => {
    await orderApi.updateStatus(orderId, newStatus);
    setDetail((d) => ({ ...d, status: newStatus }));
    onStatusChange(orderId, newStatus);
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex justify-end bg-brand-ink/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Drawer panel */}
      <div className="w-full max-w-lg h-full bg-brand-cream border-l-2 border-brand-ink flex flex-col overflow-hidden">

        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b-2 border-brand-ink flex-shrink-0">
          <div>
            <h2 className="font-display text-2xl text-brand-ink tracking-widest">ORDER DETAIL</h2>
            {detail && (
              <p className="font-mono text-xs text-brand-purple font-bold mt-0.5">{detail.orderNumber}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-brand-ink hover:bg-brand-ink hover:text-brand-lime transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Drawer body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">

          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {detail && (
            <>
              {/* Status + dates */}
              <div className="bg-white rounded-2xl border-2 border-brand-ink p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest uppercase text-brand-ink/50">Status</span>
                  <select
                    value={detail.status}
                    onChange={(e) => handleStatus(e.target.value)}
                    className={`text-xs font-bold rounded-full px-3 py-1 border-0 cursor-pointer ${STATUS_COLORS[detail.status] ?? 'bg-gray-100 text-gray-600'}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest uppercase text-brand-ink/50">Ordered at</span>
                  <span className="text-sm font-bold text-brand-ink">{fmt(detail.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest uppercase text-brand-ink/50">Payment</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${detail.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {detail.paymentStatus} · {detail.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white rounded-2xl border-2 border-brand-ink p-5 flex flex-col gap-2">
                <p className="text-xs font-bold tracking-widest uppercase text-brand-ink/50 mb-1">Shipping Address</p>
                <p className="text-sm text-brand-ink leading-relaxed">{detail.shippingAddress}</p>
                {detail.notes && (
                  <>
                    <p className="text-xs font-bold tracking-widest uppercase text-brand-ink/50 mt-2">Notes</p>
                    <p className="text-sm text-brand-ink/60 italic">{detail.notes}</p>
                  </>
                )}
              </div>

              {/* Items list */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold tracking-widest uppercase text-brand-ink/50">
                  Items ({detail.items?.length})
                </p>
                {detail.items?.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border-2 border-brand-ink p-4 flex gap-4 items-start">
                    {/* Product image */}
                    {item.productImageUrl ? (
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-xl flex-shrink-0 border border-brand-ink/10"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-brand-ink/10 flex items-center justify-center text-brand-ink/30 text-xs font-bold flex-shrink-0">
                        N/A
                      </div>
                    )}

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-brand-ink text-sm leading-tight line-clamp-2">
                        {item.productName}
                      </p>
                      {item.variantInfo && (
                        <p className="text-xs text-brand-ink/50 mt-0.5">{item.variantInfo}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-brand-ink/60">
                          {item.quantity} × ${item.unitPrice.toFixed(2)}
                        </span>
                        <span className="font-display text-brand-purple font-bold">
                          ${item.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price summary */}
              <div className="bg-brand-ink rounded-2xl p-5 flex flex-col gap-2 text-brand-cream">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-cream/60">Subtotal</span>
                  <span className="font-bold">${detail.subTotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-cream/60">Shipping</span>
                  <span className="font-bold">
                    {detail.shippingFee === 0 ? (
                      <span className="text-brand-lime">FREE</span>
                    ) : (
                      `$${detail.shippingFee?.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="border-t border-brand-cream/20 pt-2 mt-1 flex justify-between">
                  <span className="font-display tracking-widest text-sm">TOTAL</span>
                  <span className="font-display text-brand-lime text-lg">${detail.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function AdminOrders() {
  const [orders,       setOrders]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [totalCount,   setTotalCount]   = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [sorting,      setSorting]      = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [drawerOrderId, setDrawerOrderId] = useState(null);

  const load = (pageNumber = page, status = statusFilter) => {
    setLoading(true);
    const params = { pageNumber, pageSize: PAGE_SIZE };
    if (status) params.status = status;
    orderApi.adminGetAll(params)
      .then((res) => {
        const data = res.data;
        setOrders(data.items ?? data);
        setTotalPages(data.totalPages ?? 1);
        setTotalCount(data.totalCount ?? 0);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { setPage(1); load(1, statusFilter); }, [statusFilter]);
  useEffect(() => { load(page, statusFilter); }, [page]);

  // Keep row status in sync after drawer change
  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const columns = useMemo(() => [
    col.display({
      id: 'image',
      header: '',
      enableSorting: false,
      cell: ({ row: { original: o } }) => o.firstItemImageUrl ? (
        <div className="relative">
          <img
            src={o.firstItemImageUrl}
            alt={o.firstItemName ?? 'product'}
            className="w-20 h-20 object-cover rounded-2xl border border-brand-ink/10"
          />
          {o.itemCount > 1 && (
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-brand-purple text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              +{o.itemCount - 1}
            </span>
          )}
        </div>
      ) : (
        <div className="w-20 h-20 rounded-2xl bg-brand-ink/10 flex items-center justify-center text-brand-ink/30 text-xs font-bold">N/A</div>
      ),
    }),
    col.accessor('orderNumber', {
      header: 'Order #',
      cell: (info) => <span className="font-mono text-xs text-brand-purple font-bold">{info.getValue()}</span>,
    }),
    col.accessor('customerEmail', {
      header: 'Customer',
      cell: (info) => <span className="font-bold text-brand-ink">{info.getValue()}</span>,
    }),
    col.accessor('totalAmount', {
      header: 'Total',
      cell: (info) => <span className="text-brand-purple font-display">${info.getValue()?.toFixed(2)}</span>,
    }),
    col.accessor('createdAt', {
      header: 'Date',
      cell: (info) => (
        <span className="text-brand-ink/50 text-xs">
          {new Date(info.getValue()).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </span>
      ),
    }),
    col.accessor('status', {
      header: 'Status',
      enableSorting: false,
      cell: ({ row: { original: o } }) => (
        <select
          value={o.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation();
            orderApi.updateStatus(o.id, e.target.value)
              .then(() => handleStatusChange(o.id, e.target.value))
              .catch(() => alert('Failed to update status.'));
          }}
          className={`text-xs font-bold rounded-full px-3 py-1 border-0 cursor-pointer ${STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-600'}`}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      ),
    }),
    col.display({
      id: 'view',
      header: '',
      enableSorting: false,
      cell: ({ row: { original: o } }) => (
        <button
          onClick={(e) => { e.stopPropagation(); setDrawerOrderId(o.id); }}
          className="text-brand-purple text-xs font-bold tracking-widest uppercase hover:text-brand-ink transition-colors whitespace-nowrap"
        >
          View →
        </button>
      ),
    }),
  ], [orders]);

  const table = useReactTable({
    data: orders,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel:     getCoreRowModel(),
    getSortedRowModel:   getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
  });

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-display text-5xl text-brand-ink">
              ORDERS <span className="text-brand-purple">ADMIN</span>
            </h1>
            <p className="text-brand-ink/50 text-sm mt-1">{totalCount} orders total</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            {['', ...STATUSES].map((s) => (
              <button
                key={s || 'all'}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase border-2 border-brand-ink transition-colors
                  ${statusFilter === s ? 'bg-brand-ink text-brand-lime' : 'bg-transparent text-brand-ink hover:bg-brand-ink hover:text-brand-lime'}`}
              >
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search this page..."
            className="w-full max-w-sm border-2 border-brand-ink rounded-2xl px-5 py-2.5 bg-white text-sm font-sans focus:outline-none focus:border-brand-purple"
          />
        </div>

        {/* Table */}
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
                          ${header.id === 'image' ? 'w-24' : ''}`}
                      >
                        <span className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && <SortIcon column={header.column} />}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, i) => (
                  <tr
                    key={row.id}
                    onClick={() => setDrawerOrderId(row.original.id)}
                    className={`cursor-pointer transition-colors hover:bg-brand-purple/5
                      ${i % 2 === 0 ? 'bg-brand-cream/30' : ''}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {table.getRowModel().rows.length === 0 && (
              <p className="text-center py-10 text-brand-ink/40 font-display text-xl">
                {globalFilter || statusFilter ? 'NO RESULTS' : 'NO ORDERS YET'}
              </p>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t-2 border-brand-ink/10">
                <p className="text-xs text-brand-ink/50 font-bold tracking-widest">PAGE {page} OF {totalPages}</p>
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

      {/* Order detail drawer */}
      {drawerOrderId && (
        <OrderDrawer
          orderId={drawerOrderId}
          onClose={() => setDrawerOrderId(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
