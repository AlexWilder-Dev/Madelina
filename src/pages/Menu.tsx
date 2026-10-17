import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { MouseEvent } from 'react';
import { counter, type Dish } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { BranchSwitch } from '../components/BranchSwitch';
import { PlateRim, Sprig } from '../components/Ornaments';
import { Price } from '../components/Price';
import table from '../assets/photos/table-cover.webp';

function priceElsewhere(dish: Dish, otherMenu: Dish[]): number | null {
  const twin = otherMenu.find((d) => d.id === dish.id);
  return twin && twin.price !== dish.price ? twin.price : null;
}

export function Menu() {
  const { branch, other, evening } = useBranch();
  const otherDishes = other.menu.flatMap((s) => s.dishes);

  return (
    <main className="page menu-page">
      <section className="wrap page-head">
        <p className="eyebrow">The menu</p>
        <h1>
          Breakfast, brunch,
          <br /> all day everyday
        </h1>
        <div className="menu-page__switch">
          <BranchSwitch size="lg" id="menu" />
          <p className="field__hint">Same dishes at both; a few prices and recipes differ. Switch to compare.</p>
        </div>
      </section>

      {evening && (
        <section className="wrap">
          <p className="menu-page__evening">
            Tonight at Brixton it’s wine night from 6pm: see <Link to="/whats-on">what’s on</Link>. The brunch menu below is
            for daytime.
          </p>
        </section>
      )}

      <section className="wrap menu-card-wrap">
        <figure className="menu-table">
          <img src={table} alt="A table at Madelina: avocado on toast, eggs with hollandaise, a croissant, bagels, a cinnamon bun and a smoothie on painted plates" loading="lazy" width={1600} height={1067} />
        </figure>

        <div className="menu-card">
          <PlateRim />
          <nav className="menu-card__tabs" aria-label="Menu sections">
            {branch.menu.map((s) => (
              <a key={s.id} href={`#m-${s.id}`} onClick={(e) => jump(e, `m-${s.id}`)}>
                {s.title}
              </a>
            ))}
            <a href="#m-counter" onClick={(e) => jump(e, 'm-counter')}>
              The counter
            </a>
          </nav>

          {branch.menu.map((section) => (
            <section key={section.id} id={`m-${section.id}`} className="menu-section">
              <h2>
                <Sprig className="menu-section__sprig" />
                {section.title}
              </h2>
              {section.note && <p className="menu-section__note">{section.note}</p>}
              <ul>
                {section.dishes.map((dish) => {
                  const elsewhere = priceElsewhere(dish, otherDishes);
                  return (
                    <li key={dish.id} className="dish">
                      <div className="dish__head">
                        <h3>
                          {dish.name}
                          {dish.vegan && (
                            <span className="vegan-mark" title="Vegan" aria-label="vegan">
                              Ⓥ
                            </span>
                          )}
                        </h3>
                        <span className="dish__leader" aria-hidden="true" />
                        <Price value={dish.price} />
                      </div>
                      <p className="dish__desc">{dish.description}</p>
                      <AnimatePresence initial={false}>
                        {elsewhere !== null && (
                          <motion.p
                            key={other.id}
                            className="dish__elsewhere"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            £{elsewhere} at {other.short}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

          <section id="m-counter" className="menu-section menu-section--counter">
            <h2>
              <Sprig className="menu-section__sprig" />
              The counter
            </h2>
            <p className="menu-section__note">{counter.note}</p>
            <div className="counter-groups">
              {counter.groups.map((g) => (
                <div key={g.title} className="counter-group">
                  <h3>{g.title}</h3>
                  <p>{g.items.join(' · ')}</p>
                </div>
              ))}
            </div>
          </section>
          <PlateRim />
        </div>

        <p className="menu-page__foot">
          Allergies or questions about a dish? Call {branch.short} on{' '}
          <a href={`tel:${branch.phone.tel}`}>{branch.phone.display}</a>. Hungry now? Check{' '}
          <Link to="/visit">today’s hours</Link>.
        </p>
      </section>
    </main>
  );
}

function jump(e: MouseEvent, id: string) {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
