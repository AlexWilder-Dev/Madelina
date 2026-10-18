import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { brand, branches, type BranchId } from '../data/madelina';
import { useBranch } from '../lib/branch';
import logoNavy from '../assets/logo-navy.png';
import logoCream from '../assets/logo-cream.png';

/** Menu · the wordmark · Book */
export function Header() {
  const { evening } = useBranch();
  return (
    <header className="header">
      <NavLink to="/menu" className="header__link">
        Menu
      </NavLink>
      <Link to="/" className="header__logo" aria-label="Madelina, home">
        <img src={evening ? logoCream : logoNavy} alt="Madelina — Alfresco Dining" width={900} height={370} />
      </Link>
      <NavLink to="/book" className="header__link header__link--end">
        Book
      </NavLink>
    </header>
  );
}

/** On phones, once the opening has scrolled away, booking stays one tap away. */
export function FloatingBook() {
  const { pathname } = useLocation();
  const { evening } = useBranch();
  const { scrollY } = useScroll();
  const [shown, setShown] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setShown(y > 760));
  if (pathname === '/book') return null;
  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          className="float-book"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        >
          <Link className="btn btn--terra" to={evening ? '/book?type=wine' : '/book'}>
            {evening ? 'Book for tonight' : 'Book a table'}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Footer() {
  const { setBranch, previewEvening, setPreviewEvening, wineLive } = useBranch();
  return (
    <footer className="footer">
      <img className="footer__logo" src={logoCream} alt="Madelina" width={900} height={370} loading="lazy" />
      <p className="footer__line">
        A Brunch is not a meal.
        <br />
        It’s a <em>lifestyle.</em>
      </p>
      <div className="footer__cafes">
        {(['brixton', 'dulwich'] as BranchId[]).map((id) => {
          const b = branches[id];
          return (
            <address key={id}>
              <strong>{b.name}</strong>
              {b.address.line1}
              <br />
              London {b.address.postcode}
              <br />
              <a href={`tel:${b.phone.tel}`}>{b.phone.display}</a>
            </address>
          );
        })}
      </div>
      <p className="footer__social">
        <a href={brand.instagram.url} target="_blank" rel="noreferrer">
          Instagram {brand.instagram.handle}
        </a>
        <a href={brand.facebook.url} target="_blank" rel="noreferrer">
          Facebook
        </a>
      </p>
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
            {previewEvening ? 'Back to daytime' : 'Preview a Brixton wine night'}
          </button>
        )}
      </div>
    </footer>
  );
}
