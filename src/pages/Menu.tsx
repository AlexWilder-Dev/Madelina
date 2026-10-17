import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { counter, type Dish } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { BranchWords } from '../components/BranchWords';
import { Price } from '../components/Price';
import { Reveal } from '../components/Reveal';
import band from '../assets/photos/avocado-band.webp';
import bagel from '../assets/photos/dish-bagel.webp';

export function Menu() {
  const { branch, other, evening } = useBranch();
  const otherDishes = other.menu.flatMap((s) => s.dishes);
  const elsewhere = (d: Dish) => {
    const twin = otherDishes.find((x) => x.id === d.id);
    return twin && twin.price !== d.price ? twin.price : null;
  };

  return (
    <main className="menu">
      <figure className="menu__band">
        <img src={band} alt="Avocado on toast with violas, pomegranate and pumpkin seeds, close up" width={1800} height={792} />
      </figure>

      <header className="menu__head">
        <h1>
          Menu <BranchWords id="menu" />
        </h1>
        <p>Breakfast and brunch, all day. The same dishes at both cafés; a few prices and recipes differ.</p>
        {evening && <p className="menu__evening">Tonight at Brixton it’s wine night from 6pm.</p>}
      </header>

      {branch.menu.map((section, si) => (
        <section key={section.id} className="menu__section">
          <Reveal>
            <h2 className="title">{section.title}</h2>
          </Reveal>
          <ul>
            {section.dishes.map((d) => {
              const e = elsewhere(d);
              return (
                <li key={d.id} className="item">
                  <div className="item__head">
                    <h3>
                      {d.name}
                      {d.vegan && (
                        <abbr title="Vegan" className="item__v">
                          Ⓥ
                        </abbr>
                      )}
                    </h3>
                    <Price value={d.price} />
                  </div>
                  <p className="item__desc">{d.description}</p>
                  <AnimatePresence initial={false}>
                    {e !== null && (
                      <motion.p key={other.id} className="item__else" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        £{e} at {other.short}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
          {si === 0 && (
            <Reveal className="menu__photo">
              <img src={bagel} alt="Breakfast bagel with bacon, fried egg, avocado and spinach on a green painted plate" loading="lazy" width={800} height={1000} />
            </Reveal>
          )}
        </section>
      ))}

      <section className="menu__section menu__section--counter">
        <Reveal>
          <h2 className="title">The counter</h2>
          <p className="menu__note">{counter.note}</p>
        </Reveal>
        {counter.groups.map((g) => (
          <div key={g.title} className="counter">
            <h3>{g.title}</h3>
            <p>{g.items.join(' · ')}</p>
          </div>
        ))}
      </section>

      <footer className="menu__foot">
        <p>
          Allergies or questions about a dish? Call {branch.short} on <a href={`tel:${branch.phone.tel}`}>{branch.phone.display}</a>.
        </p>
        <p>
          <Link to="/book" className="big-link">
            Book <span>a table</span>
          </Link>
        </p>
      </footer>
    </main>
  );
}
