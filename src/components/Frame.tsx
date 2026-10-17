import { Link, NavLink } from 'react-router-dom';
import { brand, branches, type BranchId } from '../data/madelina';
import { useBranch } from '../lib/branch';
import logo from '../assets/logo-wordmark.png';

/** Menu · the wordmark · Book. Nothing else up top. */
export function Header() {
  return (
    <header className="header">
      <NavLink to="/menu" className="header__link">
        Menu
      </NavLink>
      <Link to="/" className="header__logo" aria-label="Madelina, home">
        <img src={logo} alt="Madelina — Alfresco Dining" width={900} height={370} />
      </Link>
      <NavLink to="/book" className="header__link header__link--right">
        Book
      </NavLink>
    </header>
  );
}

export function Footer() {
  const { setBranch, previewEvening, setPreviewEvening, wineLive } = useBranch();
  return (
    <footer className="footer">
      <p className="footer__line">{brand.lifestyle}</p>
      <div className="footer__cols">
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
      {!wineLive && (
        <button
          type="button"
          className="footer__preview"
          onClick={() => {
            setBranch('brixton');
            setPreviewEvening(!previewEvening);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {previewEvening ? 'Back to daytime' : 'See Brixton on a Friday evening'}
        </button>
      )}
      <p className="footer__credit">Site by AlexWilder-Dev</p>
    </footer>
  );
}
