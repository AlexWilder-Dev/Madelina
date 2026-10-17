import { Link } from 'react-router-dom';
import { counter } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { BranchWords } from '../components/BranchWords';
import { DishList } from '../components/DishList';
import { Reveal } from '../components/Reveal';
import band from '../assets/photos/avocado-band.webp';

export function Menu() {
  const { branch, evening } = useBranch();
  return (
    <main className="menu">
      <section className="menu__top">
        <h1>
          The menu,
          <br />
          <BranchWords id="menu" />
        </h1>
        <p>Breakfast and brunch, all day. The same dishes at both cafés; a few prices and recipes differ, and the other café’s price is noted where it does.</p>
        {evening && <p className="menu__evening">Tonight at Brixton it’s wine night: cheese boards and cured meats from 6.</p>}
      </section>
      <figure className="menu__band">
        <img src={band} alt="Avocado on toast with violas, pomegranate and pumpkin seeds, close up" width={1800} height={792} />
      </figure>

      {branch.menu.map((section) => (
        <section key={section.id} className="menu__section">
          <Reveal className="menu__heading">
            <h2>{section.id === 'brunch' ? <em>Brunch</em> : <em>Sandwiches</em>}</h2>
            <p>{section.id === 'brunch' ? 'Plates' : 'Bagels and focaccias'}</p>
          </Reveal>
          <DishList dishes={section.dishes} />
        </section>
      ))}

      <section className="menu__section">
        <Reveal className="menu__heading">
          <h2>
            <em>The counter</em>
          </h2>
          <p>{counter.note}</p>
        </Reveal>
        <div className="counter">
          {counter.groups.map((g) => (
            <div key={g.title}>
              <h3>{g.title}</h3>
              <p>{g.items.join(', ')}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="menu__foot">
        <p>
          Allergies or questions about a dish? Call {branch.short} on <a href={`tel:${branch.phone.tel}`}>{branch.phone.display}</a>.
        </p>
        <Link className="pill pill--ink" to="/book">
          Book a table
        </Link>
      </section>
    </main>
  );
}
