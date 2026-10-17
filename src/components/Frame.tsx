import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { brand, branches, type BranchId } from '../data/madelina';
import { useBranch } from '../lib/branch';
import logo from '../assets/logo-wordmark.png';

export function Header() {
  return (
    <header className="header">
      <Link to="/" className="header__logo" aria-label="Madelina, home">
        <img src={logo} alt="Madelina — Alfresco Dining" width={900} height={370} />
      </Link>
      <nav className="header__nav" aria-label="Main">
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/book">Book</NavLink>
      </nav>
    </header>
  );
}

/** On phones, once the opening has scrolled away, one way to book stays in reach. */
export function FloatingBook() {
  const { pathname } = useLocation();
  const { evening } = useBranch();
  const { scrollY } = useScroll();
  const [shown, setShown] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setShown(y > 700));
  if (pathname === '/book') return null;
  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          className="float-book"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        >
          <Link to={evening ? '/book?type=wine' : '/book'}>{evening ? 'Book wine night' : 'Book a table'}</Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Footer() {
  const { setBranch, previewEvening, setPreviewEvening, wineLive } = useBranch();
  return (
    <footer className="footer">
      <p className="footer__line">
        A Brunch is not a meal. It’s a <em>lifestyle.</em>
      </p>
      <div className="footer__grid">
        {(['brixton', 'dulwich'] as BranchId[]).map((id) => {
          const b = branches[id];
          return (
            <address key={id}>
              <strong>{b.name}</strong>
              {b.address.line1}, London {b.address.postcode}
              <br />
              <a href={`tel:${b.phone.tel}`}>{b.phone.display}</a>
            </address>
          );
        })}
        <div className="footer__social">
          <a href={brand.instagram.url} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={brand.facebook.url} target="_blank" rel="noreferrer">
            Facebook
          </a>
        </div>
      </div>
      <div className="footer__base">
        <span>Site by AlexWilder-Dev</span>
        {!wineLive && (
          <button
            type="button"
            onClick={() => {
              setBranch('brixton');
              setPreviewEvening(!previewEvening);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {previewEvening ? 'Back to daytime' : 'Preview a Brixton Friday night'}
          </button>
        )}
      </div>
    </footer>
  );
}
