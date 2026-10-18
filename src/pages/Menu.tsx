import { Link } from 'react-router-dom';
import { counter } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { CafeSwitch } from '../components/CafeSwitch';
import { Items } from '../components/Items';
import { Reveal } from '../components/Reveal';

export function Menu() {
  const { branch, evening } = useBranch();
  return (
    <main className="menu">
      <header className="menu__head">
        <h1>
          The <em>menu</em>
        </h1>
        <p>Breakfast and brunch, all day. Prices for</p>
        <CafeSwitch showStatus={false} />
        {evening && <p className="menu__evening">Tonight at Brixton it’s wine night: cheese boards and cured meats from 6.</p>}
      </header>

      {branch.menu.map((section) => (
        <Reveal key={section.id} className="card card--menu">
          <h2 className="card__title">
            <em>{section.title}</em>
          </h2>
          <p className="card__sub">{section.id === 'brunch' ? 'Plates' : 'Bagels and focaccias'}</p>
          <Items dishes={section.dishes} />
        </Reveal>
      ))}

      <Reveal className="card card--menu">
        <h2 className="card__title">
          <em>The counter</em>
        </h2>
        <p className="card__sub">{counter.note}</p>
        <div className="counter">
          {counter.groups.map((g) => (
            <div key={g.title}>
              <h3>{g.title}</h3>
              <p>{g.items.join(', ')}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <footer className="menu__foot">
        <p>
          Allergies or questions about a dish? Call {branch.short} on <a href={`tel:${branch.phone.tel}`}>{branch.phone.display}</a>.
        </p>
        <Link className="btn btn--terra" to="/book">
          Book a table
        </Link>
      </footer>
    </main>
  );
}
