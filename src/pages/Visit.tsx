import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { branches, directionsUrl, appleMapsUrl, type BranchId } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { HoursTable } from '../components/HoursTable';
import { StatusPill } from '../components/StatusLine';
import { Icon } from '../components/Icon';
import { PlateRim } from '../components/Ornaments';
import { Fascia } from '../components/Doors';
import shopBrixton from '../assets/photos/shop-brixton.webp';
import shopDulwich from '../assets/photos/shop-dulwich.webp';

const shopfront: Record<BranchId, string> = { brixton: shopBrixton, dulwich: shopDulwich };

export function Visit() {
  const { branch, status, setBranch } = useBranch();
  // The chosen branch first, the other underneath
  const order: BranchId[] = branch.id === 'brixton' ? ['brixton', 'dulwich'] : ['dulwich', 'brixton'];

  return (
    <main className="page visit">
      <section className="wrap page-head">
        <p className="eyebrow">Hours & finding us</p>
        <h1>Two Madelinas, two miles apart</h1>
        <p className="page-head__lede">
          Acre Lane in Brixton and East Dulwich Grove. Times here are London time; today is highlighted.
        </p>
      </section>

      <div className="wrap visit__grid">
        {order.map((id, i) => {
          const b = branches[id];
          return (
            <motion.article
              key={id}
              layout
              className={`visit-card ${id === branch.id ? 'is-chosen' : ''}`}
              transition={{ type: 'spring', stiffness: 260, damping: 32 }}
            >
              <div className="visit-card__front">
                <img src={shopfront[id]} alt={b.outside} loading={i ? 'lazy' : 'eager'} width={900} height={1125} />
                <div className="visit-card__fascia">
                  <Fascia text={b.fascia} />
                </div>
              </div>
              <div className="visit-card__body">
                <div className="visit-card__title">
                  <h2>{b.name}</h2>
                  <StatusPill status={status[id]} />
                </div>
                <address>
                  {b.address.line1}
                  {b.address.line2 ? `, ${b.address.line2}` : ''}, London {b.address.postcode}
                </address>
                <div className="visit-card__actions">
                  <a className="btn btn--gold" href={`tel:${b.phone.tel}`}>
                    <Icon name="phone" /> {b.phone.display}
                  </a>
                  <a className="btn btn--ghost" href={directionsUrl(b)} target="_blank" rel="noreferrer">
                    <Icon name="pin" /> Google Maps
                  </a>
                  <a className="btn btn--ghost" href={appleMapsUrl(b)} target="_blank" rel="noreferrer">
                    Apple Maps
                  </a>
                </div>
                <HoursTable branch={b} />
                <ul className="visit-card__notes">
                  {b.gettingThere.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
                {id !== branch.id && (
                  <button type="button" className="link-button" onClick={() => setBranch(id)}>
                    Make {b.short} my Madelina
                  </button>
                )}
              </div>
              <PlateRim height={18} />
            </motion.article>
          );
        })}
      </div>

      <section className="wrap visit__book">
        <p>
          Bringing a group, or after a garden table or a wine night? <Link to="/book">Ask for a table</Link>.
        </p>
      </section>
    </main>
  );
}
