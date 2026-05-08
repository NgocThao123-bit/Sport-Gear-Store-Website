// Footer.jsx — Sport-Zine editorial footer, content inside soccer-goal net area
import { Link } from 'react-router-dom';
import soccerGoal from '../../assets/images/soccer-goal.png';

const COLUMNS = [
  {
    title: 'SHOP',
    links: [
      { label: 'Men',         to: '/products?gender=men' },
      { label: 'Women',       to: '/products?gender=women' },
      { label: 'Gear',        to: '/products?category=equipment' },
      { label: 'Collections', to: '/products' },
    ],
  },
  {
    title: 'ZINE',
    links: [
      { label: 'Editorials', to: '#' },
      { label: 'Lookbooks',  to: '#' },
      { label: 'Interviews', to: '#' },
    ],
  },
  {
    title: 'ABOUT',
    links: [
      { label: 'Our Story',      to: '#' },
      { label: 'Sustainability', to: '#' },
      { label: 'Careers',        to: '#' },
    ],
  },
  {
    title: 'HELP',
    links: [
      { label: 'Contact',  to: '#' },
      { label: 'FAQ',      to: '#' },
      { label: 'Returns',  to: '#' },
      { label: 'Shipping', to: '#' },
    ],
  },
];

function NavCol({ title, links }) {
  const bg = {
    backgroundColor: 'rgba(240,237,236,0.85)',
    boxShadow: '0 0 8px 6px rgba(240,237,236,0.90)',
  };
  return (
    <div>
      <h4
        className="font-sketch font-bold text-base tracking-widest text-brand-ink uppercase mb-3 inline-block px-1"
        style={bg}
      >
        {title}
      </h4>
      <ul className="space-y-1.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="font-sans text-base text-brand-ink/90 hover:text-brand-ink transition-colors inline-block px-1"
              style={bg}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      className="relative border-t border-brand-ink/10 overflow-hidden"
      style={{ height: 'clamp(260px, 32vw, 420px)' }}
    >
      {/* Image fills the fixed-height footer */}
      <img
        src={soccerGoal}
        alt=""
        draggable={false}
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[45%] h-auto pointer-events-none select-none"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Slogan — center */}
      <div className="absolute inset-0 z-10 flex items-center pointer-events-none" >
        <h2
          className="font-display font-black italic uppercase leading-none flex flex-col"
          style={{
            fontSize: 'clamp(36px, 5vw, 72px)',
            letterSpacing: '0.04em',
            color: '#1c1b1b',
          }}
        >
          <span className="pl-64 pr-2 -mt-32 py-2 self-start" style={{ backgroundColor: '#d4ff32' }}>CREATE THE FUTURE</span>
          <span className="mt-8 pl-2 pr-36 py-2 whitespace-nowrap self-start" style={{ backgroundColor: '#a8dcff', marginLeft: '35%' }}>OF MOVEMENT</span>
        </h2>
      </div>

      {/* Stay Connected + Location — bottom left */}
      <div className="absolute bottom-[15%] left-[4%] z-10 flex flex-col gap-3">
        <div>
          <h4 className="font-sketch font-bold text-2xl tracking-widest text-brand-ink uppercase px-1">
            STAY CONNECTED:
          </h4>
          <p className="font-sans text-lg text-brand-ink/65 px-1 mt-1">
            +84 123 456 789
          </p>
        </div>
        <div>
          <h4 className="font-sketch font-bold text-2xl tracking-widest text-brand-ink uppercase px-1">
            LOCATION:
          </h4>
          <p className="font-sans text-lg text-brand-ink/65 px-1 mt-1">
            123 Streetwear St, HCMC
          </p>
        </div>
      </div>

      {/* Content aligned to right over the image */}
      <div className="absolute inset-0 z-10 flex flex-col items-end justify-between pt-[6%] pb-[2%] pr-0">

        {/* Nav columns */}
        <div className="w-[38%] grid grid-cols-4 gap-x-6">
          {COLUMNS.map((col) => (
            <NavCol key={col.title} title={col.title} links={col.links} />
          ))}
        </div>

        {/* Copyright — bottom */}
        <p
          className="font-sans text-xs text-brand-ink/55 px-1 mr-[15%]"
          style={{ backgroundColor: 'rgba(240,237,236,0.85)', boxShadow: '0 0 8px 6px rgba(240,237,236,0.90)' }}
        >
          © {new Date().getFullYear()} SportGear. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
