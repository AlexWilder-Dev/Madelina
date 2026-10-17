import { NavLink, Link } from 'react-router-dom';
import { brand, branches, directionsUrl } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { BranchSwitch } from './BranchSwitch';
import { Lamp } from './Ornaments';
import { Icon } from './Icon';
import logo from '../assets/logo-wordmark.png';

const NAV = [
  { to: '/menu', label: 'Menu' },
  { to: '/whats-on', label: 'What’s on' },
  { to: '/book', label: 'Book' },
  { to: '/visit', label: 'Hours & finding us' },
];

export function Header() {
  const { evening } = useBranch();
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__logo" aria-label="Madelina, home">
          <img src={logo} alt="Madelina — Alfresco Dining" width={900} height={370} />
        </Link>
        <nav className="site-header__nav" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'is-active' : '')}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <BranchSwitch id="header" />
      </div>
      <div className="site-header__lamps" aria-hidden="true">
        <Lamp lit={evening} />
        <Lamp lit={evening} className="lamp--b" />
      </div>
    </header>
  );
}

/** Phone-only bar: the four things people come for, for the branch they've picked. */
export function ActionBar() {
  const { branch } = useBranch();
  return (
    <nav className="action-bar" aria-label={`Quick actions for ${branch.name}`}>
      <a href={`tel:${branch.phone.tel}`} className="action-bar__item">
        <Icon name="phone" />
        <span>Call</span>
      </a>
      <a href={directionsUrl(branch)} target="_blank" rel="noreferrer" className="action-bar__item">
        <Icon name="pin" />
        <span>Directions</span>
      </a>
      <NavLink to="/menu" className="action-bar__item">
        <Icon name="plate" />
        <span>Menu</span>
      </NavLink>
      <NavLink to="/book" className="action-bar__item action-bar__item--book">
        <Icon name="book" />
        <span>Book</span>
      </NavLink>
    </nav>
  );
}

export function Footer() {
  const { setPreviewEvening, previewEvening, wineLive, setBranch } = useBranch();
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__line">{brand.lifestyle}</p>
        <div className="site-footer__branches">
          {(['brixton', 'dulwich'] as const).map((id) => {
            const b = branches[id];
            return (
              <div key={id} className="site-footer__branch">
                <h3>{b.name}</h3>
                <p>
                  {b.address.line1}
                  {b.address.line2 ? `, ${b.address.line2}` : ''}
                  <br />
                  London {b.address.postcode}
                </p>
                <p>
                  <a href={`tel:${b.phone.tel}`}>{b.phone.display}</a>
                </p>
              </div>
            );
          })}
        </div>
        <p className="site-footer__social">
          <a href={brand.instagram.url} target="_blank" rel="noreferrer">
            <Icon name="instagram" /> Instagram {brand.instagram.handle}
          </a>
          <a href={brand.facebook.url} target="_blank" rel="noreferrer">
            <Icon name="facebook" /> Facebook
          </a>
        </p>
        {!wineLive && (
          <button
            type="button"
            className="link-button site-footer__preview"
            onClick={() => {
              setBranch('brixton');
              setPreviewEvening(!previewEvening);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {previewEvening ? 'Back to daytime' : 'See Brixton on a Friday after 6pm'}
          </button>
        )}
        <p className="site-footer__credit">Site by AlexWilder-Dev</p>
      </div>
    </footer>
  );
}
