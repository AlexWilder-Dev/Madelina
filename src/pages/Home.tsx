import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { brand, directionsUrl, counter, reviews, story } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { DAY_NAMES, fmtSession, fmtTime, londonClock } from '../lib/time';
import { upcomingDates } from '../lib/slots';
import { Doors } from '../components/Doors';
import { Plates } from '../components/Plates';
import { statusText } from '../components/StatusLine';
import { Icon } from '../components/Icon';
import { PlateRim } from '../components/Ornaments';
import { GardenCard, HireCard, WineCard } from './WhatsOn';
import counterPhoto from '../assets/photos/counter.webp';
import shelves from '../assets/photos/shelves.webp';
import spicedCup from '../assets/photos/spiced-cup.webp';
import pansyDrinks from '../assets/photos/pansy-drinks.webp';
import tableC from '../assets/photos/table-c.webp';

/** The chosen branch, right now: open or not, what's next, and the three things you'd tap. */
function Here() {
  const { branch, status, now, evening, wineLive } = useBranch();
  const s = status[branch.id];
  const t = statusText(s);
  const { dow, minutes } = londonClock(now);
  const today = branch.hours[dow];
  const wineLater = today.find((x) => x.kind === 'wine' && x.open > minutes);

  let { head, sub } = t;
  if (evening && !wineLive) {
    head = 'Wine night until 11pm';
    sub = 'Preview: this is how the site looks at Brixton on Friday and Saturday evenings.';
  }

  return (
    <div className="here" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={branch.id + head}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          <p className="eyebrow">{branch.name}</p>
          <p className="here__now">{head}</p>
          {sub && <p className="here__sub here__sub--desk">{sub}</p>}
          <p className="here__sub">
            <strong className="here__phone-name">{branch.short}, today: </strong>
            <span className="here__desk-today">Today: </span>
            {today.length ? today.map(fmtSession).join(' and ') : 'closed'}
          </p>
          {wineLater && !evening && (
            <p className="here__tonight">
              <Icon name="glass" /> Wine night tonight from {fmtTime(wineLater.open)}
              <Link to="/book?type=wine">Book</Link>
            </p>
          )}
          {evening && (
            <p className="here__tonight">
              <Icon name="glass" /> Wine night on now, until 11pm
              <Link to="/book?type=wine">Book</Link>
            </p>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="here__actions">
        <a className="btn btn--gold" href={`tel:${branch.phone.tel}`}>
          <Icon name="phone" /> {branch.phone.display}
        </a>
        <a className="btn btn--ghost" href={directionsUrl(branch)} target="_blank" rel="noreferrer">
          <Icon name="pin" /> Directions
        </a>
        <Link className="btn btn--ghost btn--wide" to={evening ? '/book?type=wine' : '/book'}>
          <Icon name="book" /> {evening ? 'Book for wine night' : 'Book a table'}
        </Link>
      </div>
    </div>
  );
}

export function Home() {
  const { branch, evening, now } = useBranch();
  const isBrixton = branch.id === 'brixton';
  // While the wine night is on, brunch is a tomorrow thing
  const next = upcomingDates(branch, 'day', now, 2).find((d) => d.label !== 'Today');
  const nextBrunch = next ? `${next.label === 'Tomorrow' ? 'tomorrow' : DAY_NAMES[next.dow]} from ${fmtTime(next.sessions[0].open)}` : '';

  return (
    <main className="page home">
      <section className="wrap hello">
        <div className="home-top">
          <div>
            <h1>
              {evening ? (
                <>
                  Brunch by day, <em>wine</em> by night
                </>
              ) : (
                <>
                  Breakfast, brunch, <em>all day</em> everyday
                </>
              )}
            </h1>
            <p className="hello__since">The cozy green cafe, in two places. Which one’s yours?</p>
            <Doors />
          </div>
          <Here />
        </div>
      </section>

      {evening ? (
        <>
      <section className="wrap block block--plates">
        <div className="block__head">
          <div>
            <p className="eyebrow">On at {branch.short}</p>
            <h2>{isBrixton ? 'Wine nights and private hire' : 'The garden and private hire'}</h2>
          </div>
          <Link className="block__more" to="/whats-on">
            Everything on <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="on-grid">
          {isBrixton ? (
            <>
              <WineCard />
              <HireCard branchId="brixton" />
            </>
          ) : (
            <>
              <GardenCard />
              <HireCard branchId="dulwich" />
            </>
          )}
        </div>
      </section>

          <PlateRim />
      <section className="wrap block block--plates">
        <div className="block__head">
          <div>
            <p className="eyebrow">{evening ? `Brunch at ${branch.short}, ${nextBrunch}` : `What’s good at ${branch.short}`}</p>
            <h2>{brand.smiles}</h2>
          </div>
        </div>
        <Plates />
      </section>

        </>
      ) : (
        <>
      <section className="wrap block block--plates">
        <div className="block__head">
          <div>
            <p className="eyebrow">{evening ? `Brunch at ${branch.short}, ${nextBrunch}` : `What’s good at ${branch.short}`}</p>
            <h2>{brand.smiles}</h2>
          </div>
        </div>
        <Plates />
      </section>

          <PlateRim />
      <section className="wrap block">
        <div className="block__head">
          <div>
            <p className="eyebrow">On at {branch.short}</p>
            <h2>{isBrixton ? 'Wine nights and private hire' : 'The garden and private hire'}</h2>
          </div>
          <Link className="block__more" to="/whats-on">
            Everything on <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="on-grid">
          {isBrixton ? (
            <>
              <WineCard />
              <HireCard branchId="brixton" />
            </>
          ) : (
            <>
              <GardenCard />
              <HireCard branchId="dulwich" />
            </>
          )}
        </div>
      </section>

        </>
      )}

      <section className="wrap block">
        <div className="counter-block">
          <figure className="counter-block__photo">
            <img src={shelves} alt="Bags of Volcano coffee beans and painted cups on a wooden shelf" loading="lazy" width={1200} height={900} />
            <figcaption className="credit">Photo: Volcano Coffee Works</figcaption>
          </figure>
          <div>
            <p className="eyebrow">The counter</p>
            <h2>Amazing coffee and teas, with gluten-free and vegan treats</h2>
            <p>{counter.note}</p>
            <ul className="drink-list">
              {counter.groups.flatMap((g) => g.items.slice(0, g.title === 'Coffee' ? 3 : 2)).map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <p style={{ marginTop: 14 }}>
              <Link className="block__more" to="/menu">
                The whole menu <Icon name="arrow" size={16} />
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="story">
        <PlateRim />
        <div className="wrap story__inner">
          <div className="story__text">
            <p className="eyebrow">Since 2013</p>
            <h2>{story.title}</h2>
            {story.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <figure className="story__photo">
            <img src={counterPhoto} alt="The counter: sage-green walls, brass pendant lamps and chalkboard menus" loading="lazy" width={1400} height={1050} />
            <figcaption>The counter. Photo: Volcano Coffee Works</figcaption>
          </figure>
        </div>
        <PlateRim />
      </section>

      {reviews.length > 0 && (
        <section className="wrap block">
          <div className="block__head">
            <div>
              <p className="eyebrow">Reviews</p>
              <h2>What people say</h2>
            </div>
          </div>
          <div className="reviews">
            {[...reviews]
              .sort((a, b) => Number(b.branch === branch.id) - Number(a.branch === branch.id))
              .map((r) => (
                <figure key={r.quote} className="review">
                  <span className="review__branch">{r.branch === 'brixton' ? 'Brixton' : 'Dulwich'}</span>
                  <blockquote>“{r.quote}”</blockquote>
                  <figcaption>
                    {r.who}, {r.where}
                    {r.when ? `, ${r.when}` : ''}
                  </figcaption>
                </figure>
              ))}
          </div>
        </section>
      )}

      <section className="wrap block">
        <div className="insta">
          <div>
            <p className="eyebrow">Follow along on Instagram</p>
            <a className="insta__handle" href={brand.instagram.url} target="_blank" rel="noreferrer">
              <Icon name="instagram" /> {brand.instagram.handle}
            </a>
          </div>
          <a className="insta__strip" href={brand.instagram.url} target="_blank" rel="noreferrer" aria-label="Madelina on Instagram">
            <img src={spicedCup} alt="" loading="lazy" />
            <img src={tableC} alt="" loading="lazy" />
            <img src={pansyDrinks} alt="" loading="lazy" />
          </a>
        </div>
      </section>
    </main>
  );
}
