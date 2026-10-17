import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { branches, directionsUrl, events, plateQuote, story, type BranchId } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { DAY_SHORT, fmtSession, fmtTime, londonClock } from '../lib/time';
import { upcomingDates } from '../lib/slots';
import { statusLine } from '../lib/status';
import { Picker } from '../components/Picker';
import { DishList } from '../components/DishList';
import { BranchWords } from '../components/BranchWords';
import { Marquee } from '../components/Marquee';
import { Spin } from '../components/Spin';
import { Reveal } from '../components/Reveal';
import { Price } from '../components/Price';
import tablePortrait from '../assets/photos/table-portrait.webp';
import pansyDrinks from '../assets/photos/pansy-drinks.webp';
import counterPhoto from '../assets/photos/counter.webp';
import shopBrixton from '../assets/photos/shop-brixton.webp';
import shopDulwich from '../assets/photos/shop-dulwich.webp';
import cutLatte from '../assets/photos/cut-latte.webp';
import cutBowl from '../assets/photos/cut-bowl.webp';

const shopfront: Record<BranchId, string> = { brixton: shopBrixton, dulwich: shopDulwich };

const WEEK = [1, 2, 3, 4, 5, 6, 0];

/** The week in as few lines as it takes. */
function weekLines(hours: (typeof branches)['brixton']['hours']) {
  const key = (d: number) => hours[d].map((s) => `${s.open}-${s.close}-${s.kind}`).join('|');
  const rows: number[][] = [];
  for (const d of WEEK) {
    const last = rows[rows.length - 1];
    if (last && key(last[last.length - 1]) === key(d)) last.push(d);
    else rows.push([d]);
  }
  return rows.map((days) => ({
    days,
    label: days.length > 1 ? `${DAY_SHORT[days[0]]}–${DAY_SHORT[days[days.length - 1]]}` : DAY_SHORT[days[0]],
    sessions: hours[days[0]].map((s) => fmtSession(s) + (s.kind === 'wine' ? ', wine night' : '')),
  }));
}

function Opening() {
  const { evening, branch } = useBranch();
  const [hover, setHover] = useState<BranchId | null>(null);
  const brunch = branch.menu.find((s) => s.id === 'brunch')!.dishes;
  const price = (id: string) => brunch.find((d) => d.id === id)!.price;
  const photo = hover ? shopfront[hover] : evening ? pansyDrinks : tablePortrait;
  const words = evening ? ['Wine', 'night,', <em key="t">tonight.</em>] : ['Breakfast,', 'brunch,', <em key="a">all day</em>, 'everyday.'];

  return (
    <section className={`opening ${evening ? 'is-evening' : ''}`}>
      <div className="opening__text">
        <h1 className="opening__title">
          {words.map((w, i) => (
            <motion.span
              key={i + (evening ? 'e' : 'd')}
              className="opening__word"
              initial={{ y: '0.6em', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.08 * i, ease: [0.22, 0.75, 0.2, 1] }}
            >
              {w}
            </motion.span>
          ))}
        </h1>
        <Picker onHover={setHover} />
      </div>
      <figure className="opening__photo">
        <div className="opening__frame">
          <AnimatePresence initial={false}>
            <motion.img
              key={photo}
              src={photo}
              alt={hover ? branches[hover].photoAlt : evening ? 'Two drinks raised, one topped with a purple pansy' : 'A table of brunch at Madelina on their painted plates'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              fetchPriority="high"
            />
          </AnimatePresence>
        </div>
        {!hover && !evening && (
          <>
            <span className="opening__tag" style={{ left: '5%', top: '6%' }}>
              Avocado on Toast <Price value={price('avocado-toast')} />
            </span>
            <span className="opening__tag" style={{ right: '5%', top: '47%' }}>
              Croissant
            </span>
            <span className="opening__tag" style={{ left: '5%', bottom: '7%' }}>
              Eggs Benedict <Price value={price('eggs-benedict')} />
            </span>
          </>
        )}
        <Spin src={cutLatte} size={600} turn={70} className="opening__cup" />
        {evening && <figcaption>Friday and Saturday evenings at Brixton: wine, cheese boards and cured meats.</figcaption>}
      </figure>
    </section>
  );
}

function WineNights() {
  const { now, wineLive } = useBranch();
  const next = upcomingDates(branches.brixton, 'wine', now, 1)[0];
  const nextText = wineLive
    ? 'On now.'
    : next
      ? next.label === 'Today'
        ? `Next: tonight from ${fmtTime(next.sessions[0].open)}.`
        : `Next: ${next.label === 'Tomorrow' ? 'tomorrow' : next.label} from ${fmtTime(next.sessions[0].open)}.`
      : '';
  return (
    <section className="wine">
      <div className="wine__inner">
        <Reveal className="wine__text">
          <p className="kicker">Brixton · Friday & Saturday · 6–11pm</p>
          <h2>
            Wine <em>nights</em>
          </h2>
          <p className="wine__body">{events.wine.body}</p>
          <p className="wine__next">{nextText}</p>
          <Link className="pill pill--marigold" to="/book?type=wine">
            Book a table for wine night
          </Link>
        </Reveal>
        <Reveal className="wine__photo">
          <img src={pansyDrinks} alt="Two drinks raised over brunch, one topped with a purple pansy" loading="lazy" width={1400} height={1050} />
        </Reveal>
      </div>
    </section>
  );
}

export function Home() {
  const { branch, evening, status, now } = useBranch();
  const order: BranchId[] = branch.id === 'brixton' ? ['brixton', 'dulwich'] : ['dulwich', 'brixton'];
  const today = londonClock(now).dow;
  const brunch = branch.menu.find((s) => s.id === 'brunch')!;

  return (
    <main className="home">
      <Opening />
      {evening && <WineNights />}
      <Marquee />

      <section className="brunch">
        <Reveal className="brunch__head">
          <h2>
            Brunch at <BranchWords id="brunch" />
          </h2>
          <p>All day, every day. The same dishes at both cafés; a few prices and recipes differ.</p>
        </Reveal>
        <DishList dishes={brunch.dishes} />
        <Reveal className="brunch__more">
          <Link className="pill pill--ink" to="/menu">
            Bagels, focaccias & the counter
          </Link>
        </Reveal>
      </section>

      <section className="plates">
        <Spin src={cutBowl} size={700} turn={160} className="plates__bowl" />
        <Reveal className="plates__quote">
          <blockquote>
            <p>“{plateQuote.text}”</p>
            <cite>
              {plateQuote.who}, {plateQuote.where}, {plateQuote.when}
            </cite>
          </blockquote>
        </Reveal>
      </section>

      <section className="cafes">
        <Reveal className="cafes__head">
          <h2>
            Two cafés, <em>two miles apart</em>
          </h2>
        </Reveal>
        <div className="cafes__grid">
          {order.map((id) => {
            const b = branches[id];
            const line = statusLine(status[id]);
            return (
              <motion.article key={id} layout transition={{ type: 'spring', stiffness: 200, damping: 30 }} className="cafe">
                <Reveal>
                  <div className="cafe__photo">
                    <img src={shopfront[id]} alt={b.photoAlt} loading="lazy" width={1400} height={1050} />
                    <span className={`cafe__status ${line.open ? 'is-open' : ''}`}>{line.text}</span>
                  </div>
                  <h3>
                    Madelina <em>{b.short}</em>
                  </h3>
                  <p className="cafe__room">{b.room}</p>
                  <dl className="cafe__facts">
                    <div>
                      <dt>Address</dt>
                      <dd>
                        {b.address.line1}
                        {b.address.line2 ? `, ${b.address.line2}` : ''}, {b.address.postcode}
                        <br />
                        <span className="cafe__find">{b.findUs}</span>
                      </dd>
                    </div>
                    <div>
                      <dt>Hours</dt>
                      <dd>
                        {weekLines(b.hours).map((r) => (
                          <span key={r.label} className={`cafe__hours ${r.days.includes(today) ? 'is-today' : ''}`}>
                            <b>{r.label}</b>
                            <span>
                              {r.sessions.length ? r.sessions.map((t) => <span key={t}>{t}</span>) : 'Closed'}
                            </span>
                          </span>
                        ))}
                      </dd>
                    </div>
                  </dl>
                  <div className="cafe__actions">
                    <a className="pill pill--ink" href={`tel:${b.phone.tel}`}>
                      {b.phone.display}
                    </a>
                    <a className="pill" href={directionsUrl(b)} target="_blank" rel="noreferrer">
                      Directions
                    </a>
                  </div>
                  <blockquote className="cafe__quote">
                    <p>“{b.quote.text}”</p>
                    <cite>
                      {b.quote.who}, {b.quote.where}, {b.quote.when}
                    </cite>
                  </blockquote>
                </Reveal>
              </motion.article>
            );
          })}
        </div>
      </section>

      {!evening && <WineNights />}

      <section className="more">
        <Reveal className="more__item">
          <p className="kicker">Dulwich</p>
          <h2>
            The <em>garden</em>
          </h2>
          <p>{events.garden.body}</p>
          <Link className="pill pill--paper" to="/book?type=garden">
            Ask for a garden table
          </Link>
        </Reveal>
        <Reveal className="more__item">
          <p className="kicker">Both cafés</p>
          <h2>
            Private <em>hire</em>
          </h2>
          <p>{events.hire.body}</p>
          <Link className="pill pill--paper" to="/book?type=hire">
            Ask about hire
          </Link>
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
          <p className="kicker">Since 2013</p>
          <h2>
            Eugen <em>&</em> Mady’s
          </h2>
          {story.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>
      </section>
    </main>
  );
}
