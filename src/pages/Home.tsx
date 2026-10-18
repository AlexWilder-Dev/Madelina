import { Link } from 'react-router-dom';
import { brand, branches, directionsUrl, dishPhotos, events, plateQuote, story, type BranchId } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { upcomingDates } from '../lib/slots';
import { DAY_NAMES, DAY_SHORT, fmtSession, fmtTime, londonClock } from '../lib/time';
import { CafeSwitch } from '../components/CafeSwitch';
import { Print } from '../components/Print';
import { Reveal } from '../components/Reveal';
import { Table } from '../components/Table';
import { Items } from '../components/Items';
import pansyDrinks from '../assets/photos/pansy-drinks.webp';
import counterPhoto from '../assets/photos/counter.webp';
import shopBrixton from '../assets/photos/shop-brixton.webp';
import shopDulwich from '../assets/photos/shop-dulwich.webp';

const shopfront: Record<BranchId, string> = { brixton: shopBrixton, dulwich: shopDulwich };
const WEEK = [1, 2, 3, 4, 5, 6, 0];

/** The week in as few lines as it takes: days with the same hours share a line. */
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
    sessions: hours[days[0]].map((s) => (s.kind === 'wine' ? `${fmtSession(s)} wine` : fmtSession(s))),
  }));
}

function Opening() {
  const { branch, evening } = useBranch();
  const dishes = branch.menu.flatMap((s) => s.dishes);
  const dish = (id: string) => dishes.find((d) => d.id === id)!;
  const prints = evening
    ? [
        { src: counterPhoto, alt: 'The Brixton counter under brass pendant lamps', caption: 'The counter', rotate: -6 },
        { src: pansyDrinks, alt: 'Two drinks raised over the table, one topped with a purple pansy', caption: 'Friday, 6pm', rotate: 2, eager: true },
        { src: shopBrixton, alt: branches.brixton.photoAlt, caption: '105 Acre Lane', rotate: 7 },
      ]
    : (['eggs-benedict', 'avocado-toast', 'full-english'] as const).map((id, i) => ({
        src: dishPhotos[id].src,
        alt: dishPhotos[id].alt,
        caption: id === 'full-english' ? 'Full English' : dish(id).name,
        price: dish(id).price,
        rotate: [-6, 2, 7][i],
        eager: i === 1,
      }));

  return (
    <section className="opening">
      <h1 className="opening__title">
        {evening ? (
          <>
            Wine night at <em>Brixton</em>
          </>
        ) : (
          <>
            Breakfast, brunch, <em>all day</em> everyday
          </>
        )}
      </h1>
      <Table prints={prints} id={evening ? 'evening' : 'day'} />
      <CafeSwitch />
      <div className="opening__actions">
        <Link className="btn btn--terra" to={evening ? '/book?type=wine' : '/book'}>
          {evening ? 'Book for tonight' : 'Book a table'}
        </Link>
        <Link className="btn btn--line" to="/menu">
          See the menu
        </Link>
      </div>
    </section>
  );
}

function WineNights() {
  const { now, wineLive } = useBranch();
  const next = upcomingDates(branches.brixton, 'wine', now, 1)[0];
  const when = wineLive
    ? 'On now, till 11pm.'
    : next
      ? `Next: ${next.label === 'Today' ? 'tonight' : next.label === 'Tomorrow' ? 'tomorrow' : DAY_NAMES[next.dow]} from ${fmtTime(next.sessions[0].open)}.`
      : '';
  return (
    <section className="wine">
      <div className="wine__inner">
        <Reveal className="wine__print">
          <Print src={pansyDrinks} alt="Two drinks raised over the table, one topped with a purple pansy" caption="Brixton, Friday night" rotate={-4} />
        </Reveal>
        <Reveal className="wine__text">
          <p className="eyebrow">Brixton · Fridays & Saturdays</p>
          <h2>
            Wine <em>nights</em>
          </h2>
          <p className="wine__body">{events.wine.body}</p>
          <p className="wine__when">{when}</p>
          <Link className="btn btn--ochre" to="/book?type=wine">
            Book a table for wine night
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function Home() {
  const { branch, status, now, evening } = useBranch();
  const today = londonClock(now).dow;
  const order: BranchId[] = branch.id === 'brixton' ? ['brixton', 'dulwich'] : ['dulwich', 'brixton'];
  const brunch = branch.menu.find((s) => s.id === 'brunch')!;

  return (
    <main className="home">
      <Opening />
      {evening && <WineNights />}

      <section className="words">
        <Reveal>
          <p className="words__big">
            Vibrant foods brought to you with <em>vibrant smiles</em>
          </p>
          <p className="words__small">{brand.about}</p>
        </Reveal>
      </section>

      <section className="menu-teaser">
        <Reveal className="section-title">
          <h2>
            Brunch at <em>{branch.short}</em>
          </h2>
          <p>All day, every day. Same dishes at both cafés; a few prices differ.</p>
        </Reveal>
        <Reveal className="card">
          <Items dishes={brunch.dishes} />
          <div className="card__foot">
            <Link className="btn btn--line" to="/menu">
              Bagels, focaccias & the counter
            </Link>
          </div>
        </Reveal>
        <Reveal className="said said--centre">
          <p>“{plateQuote.text}”</p>
          <cite>
            {plateQuote.who}, {plateQuote.where}
          </cite>
        </Reveal>
      </section>

      <section className="cafes">
        <Reveal className="section-title">
          <h2>
            Brixton & <em>East Dulwich</em>
          </h2>
          <p>Two cafés, about two miles apart.</p>
        </Reveal>
        <div className="cafes__list">
          {order.map((id, i) => {
            const b = branches[id];
            const st = status[id];
            return (
              <article key={id} className={`cafe ${i % 2 ? 'cafe--flip' : ''}`}>
                <Reveal className="cafe__print">
                  <Print src={shopfront[id]} alt={b.photoAlt} caption={b.address.line1} rotate={i % 2 ? 3 : -3} />
                </Reveal>
                <Reveal className="cafe__text">
                  <p className={`cafe__now ${st.open ? 'is-open' : ''}`}>{st.open ? 'Open now' : 'Closed now'}</p>
                  <h3>
                    Madelina <em>{b.short}</em>
                  </h3>
                  <p className="cafe__room">{b.room}</p>
                  <dl className="cafe__hours">
                    {weekLines(b.hours).map((r) => (
                      <div key={r.label} className={r.days.includes(today) ? 'is-today' : ''}>
                        <dt>{r.label}</dt>
                        <dd>{r.sessions.length ? r.sessions.join(', ') : 'Closed'}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="cafe__where">
                    {b.address.line1}
                    {b.address.line2 ? `, ${b.address.line2}` : ''}, {b.address.postcode}. {b.findUs}
                  </p>
                  <div className="cafe__actions">
                    <a className="btn btn--terra" href={`tel:${b.phone.tel}`}>
                      Call {b.phone.display}
                    </a>
                    <a className="btn btn--line" href={directionsUrl(b)} target="_blank" rel="noreferrer">
                      Directions
                    </a>
                  </div>
                  <blockquote className="said">
                    <p>“{b.quote.text}”</p>
                    <cite>
                      {b.quote.who}, {b.quote.where}
                    </cite>
                  </blockquote>
                </Reveal>
              </article>
            );
          })}
        </div>
      </section>

      {!evening && <WineNights />}

      <section className="also">
        <Reveal className="also__item">
          <p className="eyebrow">East Dulwich</p>
          <h2>
            The <em>garden</em>
          </h2>
          <p>{events.garden.body}</p>
          <Link className="btn btn--line" to="/book?type=garden">
            Ask for a garden table
          </Link>
        </Reveal>
        <Reveal className="also__item">
          <p className="eyebrow">Both cafés</p>
          <h2>
            Private <em>hire</em>
          </h2>
          <p>{events.hire.body}</p>
          <Link className="btn btn--line" to="/book?type=hire">
            Ask about hire
          </Link>
        </Reveal>
      </section>

      <section className="story">
        <Reveal className="story__print">
          <Print src={counterPhoto} alt="The counter: sage-green walls, brass pendant lamps and chalkboard menus" caption="Photo: Volcano Coffee Works" rotate={3} />
        </Reveal>
        <Reveal className="story__text">
          <p className="eyebrow">Since 2013</p>
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
