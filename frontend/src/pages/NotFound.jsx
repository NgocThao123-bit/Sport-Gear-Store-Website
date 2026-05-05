import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <div className="text-center max-w-md">

        <p className="font-display text-[10rem] leading-none text-brand-ink/10 select-none">404</p>

        <h1 className="font-display text-4xl text-brand-ink -mt-4 mb-3">
          PAGE NOT <span className="text-brand-purple">FOUND</span>
        </h1>
        <p className="text-brand-ink/40 text-sm mb-10">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border-2 border-brand-ink text-brand-ink font-bold text-xs tracking-widest uppercase rounded-full hover:bg-brand-ink hover:text-white transition-colors"
          >
            ← Go Back
          </button>
          <Link
            to="/"
            className="px-6 py-3 bg-brand-lime text-brand-ink font-bold text-xs tracking-widest uppercase rounded-full border-2 border-brand-ink hover:bg-brand-purple hover:text-white transition-colors"
          >
            Home
          </Link>
        </div>

      </div>
    </div>
  );
}
