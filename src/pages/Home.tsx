import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { brand, branches, directionsUrl, events, plateQuote, showcase, story, type BranchId, type Quote } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { Board } from '../components/Board';
import { BranchWords } from '../components/BranchWords';
import { Hours } from '../components/Hours';
import { Price } from '../components/Price';
import { Reveal } from '../components/Reveal';
import tablePortrait from '../assets/photos/table-portrait.webp';
import tableWide from '../assets/photos/table-wide.webp';
import pansyDrinks from '../assets/photos/pansy-drinks.webp';
import counterPhoto from '../assets/photos/counter.webp';
import shopBrixton from '../assets/photos/shop-brixton.webp';
import shopDulwich from '../assets/photos/shop-dulwich.webp';

const shopfront: Record<BranchId, string> = { brixton: shopBrixton, dulwich: shopDulwich };

function Said({ q }: { q: Quote }) {
  return (
    <blockquote className="said">
      <p>“{q.text}”</p>
      <cite>
        {q.who}, {q.where}, {q.when}
      </cite>
    </blockquote>
  );
}

export function Home() {
  const { branch, evening } = useBranch();
  const dishes = branch.menu.flatMap((s) => s.dishes);
  const dish = (id: string) => dishes.find((d) => d.id === id)!;
  const order: BranchId[] = branch.id === 'brixton' ? ['brixton', 'dulwich'] : ['dulwich', 'brixton'];

  return (
    <main className="home">
      <section className="top">
        <h1 className="top__strap">{evening ? 'Wine night at Brixton' : brand.strap}</h1>
        <figure className="top__photo">
          <div className="top__frame">
            <picture>
              <source media="(min-width: 900px)" srcSet={tableWide} />
              <motion.img
                src={tablePortrait}
                alt="A table of brunch at Madelina on their painted plates"
                width={900}
                height={1125}
                fetchPriority="high"
                initial={{ scale: 1.06 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2.4, ease: [0.2, 0.7, 0.2, 1] }}
              />
            </picture>
            {/* After 6 on a wine night the table gives way to their drinks photo */}
            <motion.img
              className="top__evening"
              src={pansyDrinks}
              alt=""
              aria-hidden="true"
              initial={false}
              animate={{ opacity: evening ? 1 : 0 }}
              transition={{ duration: 1.2 }}
            />
          </div>
          <figcaption>
            {evening ? (
              'Friday and Saturday evenings: wine, cheese boards and cured meats.'
            ) : (
              <>
                On the table: Avocado on Toast <Price value={dish('avocado-toast').price} />, Eggs Benedict{' '}
                <Price value={dish('eggs-benedict').price} />, a croissant and a cinnamon bun.
              </>
            )}
          </figcaption>
        </figure>
        <div className="top__board">
          <Board />
        </div>
      </section>

      <section className="intro">
        <Reveal>
          <p className="intro__big">{brand.smiles}</p>
          <p className="intro__text">{brand.about}</p>
        </Reveal>
      </section>

      <section className="dishes">
        <Reveal className="section-head">
          <h2 className="title">From the menu</h2>
          <p className="section-head__sub">
            Prices at <BranchWords id="dishes" />
          </p>
        </Reveal>
        <div className="dishes__grid">
          {showcase.map((s, i) => {
            const d = dish(s.dishId);
            return (
              <Reveal key={s.dishId} className={`dish dish--${i}`}>
                <img src={s.photo} alt={s.alt} loading="lazy" width={1000} height={1250} />
                <div className="dish__head">
                  <h3>{d.name}</h3>
                  <Price value={d.price} />
                </div>
                <p className="dish__desc">{d.description}</p>
              </Reveal>
            );
          })}
          <Reveal className="dishes__quote">
            <Said q={plateQuote} />
          </Reveal>
        </div>
        <Reveal className="dishes__more">
          <Link to="/menu" className="big-link">
            Menu <span>{branch.short}</span>
          </Link>
        </Reveal>
      </section>

      <section className="rooms">
        <Reveal className="section-head">
          <h2 className="title">The two cafés</h2>
        </Reveal>
        <div className="rooms__grid">
          {order.map((id) => {
            const b = branches[id];
            return (
              <motion.article key={id} layout transition={{ type: 'spring', stiffness: 200, damping: 30 }} className="room">
                <Reveal>
                  <img src={shopfront[id]} alt={b.photoAlt} loading="lazy" width={1400} height={1050} />
                  <h3 className="room__name">{b.name}</h3>
                  <p className="room__addr">
                    {b.address.line1}
                    {b.address.line2 ? `, ${b.address.line2}` : ''}, {b.address.postcode}
                  </p>
                  <p className="room__text">{b.room}</p>
                  <Hours branch={b} />
                  <p className="room__find">{b.findUs}</p>
                  <p className="links">
                    <a href={`tel:${b.phone.tel}`}>{b.phone.display}</a>
                    <a href={directionsUrl(b)} target="_blank" rel="noreferrer">
                      Directions
                    </a>
                  </p>
                  <Said q={b.quote} />
                </Reveal>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="on">
        <Reveal className="on__photo">
          <img src={pansyDrinks} alt="Two drinks raised over brunch, one topped with a purple pansy" loading="lazy" width={1400} height={1050} />
        </Reveal>
        <Reveal className="on__list">
          <h2 className="title">Worth booking</h2>
          <p className="on__lede">Walk-ins are always welcome. For these, it’s worth asking first.</p>
          <dl>
            <dt>{events.wine.title}</dt>
            <dd>
              {events.wine.body} <Link to="/book?type=wine">Book a table</Link>
            </dd>
            <dt>{events.garden.title}</dt>
            <dd>
              {events.garden.body} <Link to="/book?type=garden">Ask for a garden table</Link>
            </dd>
            <dt>{events.hire.title}</dt>
            <dd>
              {events.hire.body} <Link to="/book?type=hire">Ask about hire</Link>
            </dd>
          </dl>
        </Reveal>
      </section>

      <section className="story">
        <Reveal className="story__photo">
          <figure>
            <img src={counterPhoto} alt="The counter: sage-green walls, brass pendant lamps and chalkboard menus" loading="lazy" width={1400} height={1050} />
            <figcaption>Photo: Volcano Coffee Works</figcaption>
          </figure>
        </Reveal>
        <Reveal className="story__text">
          <h2 className="title">{story.title}</h2>
          {story.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>
      </section>
    </main>
  );
}
