// PaymentProcessing.jsx — animated processing screen for all payment methods
// PaymentProcessing.jsx — màn hình xử lý cho tất cả phương thức thanh toán
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { paymentApi } from '../api/paymentApi';

const IS_COD = (m) =>
  m?.toLowerCase() === 'cod' || m === 'Cash on Delivery';

const METHOD_LABELS = {
  'Credit Card':      'VISA / MASTERCARD',
  'MoMo':             'MOMO',
  'ZaloPay':          'ZALOPAY',
  'Cash on Delivery': 'TIỀN MẶT KHI NHẬN',
  'cod':              'TIỀN MẶT KHI NHẬN',
};

const STEPS_PAYMENT = [
  'Connecting to gateway...',
  'Verifying card details...',
  'Authorizing payment...',
  'Confirming transaction...',
];

const STEPS_COD = [
  'Verifying your order...',
  'Checking shipping address...',
  'Confirming COD order...',
  'Almost done...',
];

export default function PaymentProcessing() {
  const [searchParams]            = useSearchParams();
  const navigate                  = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError]         = useState(false);

  const orderId = searchParams.get('orderId');
  const method  = searchParams.get('method');
  const isCod   = IS_COD(method);
  const STEPS   = isCod ? STEPS_COD : STEPS_PAYMENT;

  // Cycle status messages every 450ms
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, 450);
    return () => clearInterval(interval);
  }, [STEPS]);

  useEffect(() => {
    if (!orderId || !method) { navigate('/cart'); return; }

    if (isCod) {
      // COD: no payment API call — brief confirmation delay then success
      // COD: không gọi payment API — delay ngắn rồi chuyển thành công
      const timer = setTimeout(() => {
        navigate(`/payment/success?orderId=${orderId}&method=cod`);
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Card / e-wallet: call backend (has 1.5s mock delay)
    // Thẻ / ví điện tử: gọi backend (có mock delay 1.5 giây)
    paymentApi.process(orderId, method)
      .then(() =>
        navigate(`/payment/success?orderId=${orderId}&method=${encodeURIComponent(method)}`)
      )
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: '#f0eff0' }}>
        <motion.div className="text-center max-w-md"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-display text-5xl text-brand-ink uppercase mb-4">PAYMENT FAILED</h1>
          <p className="font-note italic text-brand-ink/50 text-lg mb-8">
            Something went wrong. Please try again.
          </p>
          <button onClick={() => navigate('/cart')}
            className="px-8 py-4 font-sketch font-bold text-sm tracking-widest uppercase rounded-full border-2 border-brand-ink text-brand-ink hover:bg-brand-ink hover:text-brand-lime transition-colors">
            Back to Cart
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#f0eff0' }}>
      <motion.div className="text-center max-w-md w-full"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>

        {/* Spinning ring */}
        <div className="relative w-28 h-28 mx-auto mb-10">
          <motion.div
            className="absolute inset-0 rounded-full border-[5px] border-brand-lime"
            style={{ borderTopColor: 'transparent' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-3 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#d4ff32' }}>
            <span className="text-2xl">{isCod ? '💵' : '💳'}</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-display font-black uppercase text-brand-ink leading-none mb-2"
          style={{ fontSize: 'clamp(36px, 6vw, 72px)', letterSpacing: '-0.03em' }}>
          {isCod ? 'CONFIRMING' : 'PROCESSING'}
        </h1>
        <p className="font-sketch font-bold text-brand-purple text-lg mb-8 tracking-widest uppercase">
          {METHOD_LABELS[method] ?? method}
        </p>

        {/* Animated status line */}
        <motion.p
          key={stepIndex}
          className="font-note italic text-brand-ink/50 text-base"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}>
          {STEPS[stepIndex]}
        </motion.p>

        {/* COD info note */}
        {isCod && (
          <motion.div
            className="mt-6 mx-auto max-w-xs px-5 py-3 rounded-2xl border-2 border-brand-ink/20"
            style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}>
            <p className="font-note italic text-brand-ink/60 text-sm leading-relaxed">
              Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng.
              <br />
              <span className="text-xs">Pay in cash upon delivery.</span>
            </p>
          </motion.div>
        )}

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <motion.div key={i}
              className="w-2 h-2 rounded-full bg-brand-ink"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>

        <p className="font-sans text-xs text-brand-ink/30 mt-10 tracking-widest uppercase">
          Do not close this page
        </p>
      </motion.div>
    </div>
  );
}
