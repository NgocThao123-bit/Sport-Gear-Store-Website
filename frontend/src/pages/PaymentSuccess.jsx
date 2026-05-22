// PaymentSuccess.jsx — confirmation screen after successful payment or COD order
// PaymentSuccess.jsx — màn hình xác nhận sau khi thanh toán thành công hoặc đặt COD
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const IS_COD = (method) =>
  method?.toLowerCase() === 'cod' || method === 'Cash on Delivery';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const method         = searchParams.get('method');
  const isCod          = IS_COD(method);

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#f0eff0' }}>

      {/* Grain texture */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px',
        }} />

      <motion.div className="relative z-10 text-center max-w-lg w-full"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}>

        {/* Check circle */}
        <motion.div
          className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-10"
          style={{
            backgroundColor: '#d4ff32',
            boxShadow: '10px 10px 28px rgba(0,0,0,0.10), -4px -4px 14px rgba(255,255,255,0.95)',
          }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
          <svg className="w-14 h-14 text-brand-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        {/* Heading */}
        <h1 className="font-display font-black uppercase text-brand-ink leading-none mb-4"
          style={{ fontSize: 'clamp(52px, 10vw, 120px)', letterSpacing: '-0.04em' }}>
          {isCod ? 'ORDER\nPLACED!' : 'PAYMENT\nCONFIRMED!'}
        </h1>

        {/* Sub-message */}
        <p className="font-note italic text-brand-ink/45 text-xl mb-3">
          {isCod
            ? "We'll ship it soon. Pay the courier on arrival."
            : 'Your payment went through — gear incoming!'}
        </p>

        {/* Payment method badge */}
        {method && (
          <div className="inline-block mb-10">
            <span className="font-sketch font-black text-xs tracking-widest uppercase px-4 py-2 border-2 border-brand-ink"
              style={{ borderRadius: '255px 12px 230px 10px/10px 230px 12px 255px', backgroundColor: '#d4ff32' }}>
              {isCod ? 'COD — Pay on delivery' : method}
            </span>
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/orders"
            className="px-8 py-4 font-sketch font-bold text-xs tracking-widest uppercase rounded-full border-2 border-brand-ink text-brand-ink hover:bg-brand-ink hover:text-brand-lime transition-colors">
            View My Orders
          </Link>
          <Link to="/products"
            className="px-8 py-4 font-sketch font-bold text-xs tracking-widest uppercase rounded-full text-brand-lime"
            style={{
              backgroundColor: '#1c1b1b',
              boxShadow: '5px 5px 14px rgba(0,0,0,0.22), -2px -2px 8px rgba(255,255,255,0.08)',
            }}>
            Keep Shopping →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
