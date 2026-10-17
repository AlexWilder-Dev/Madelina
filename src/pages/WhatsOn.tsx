import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { branches, events, type BranchId } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { fmtTime, londonClock, DAY_NAMES } from '../lib/time';
import { upcomingDates } from '../lib/slots';
import { BranchSwitch } from '../components/BranchSwitch';
import { GardenSketch } from '../components/GardenSketch';
import { Icon } from '../components/Icon';
import pansyDrinks from '../assets/photos/pansy-drinks.webp';

export function EveningToggle() {
  const { previewEvening, setPreviewEvening, wineLive, setBranch } = useBranch();
  if (wineLive) return null;
  return (
    <button
      type="button"
      className="evening-toggle"
      aria-pressed={previewEvening}
      onClick={() => {
        setBranch('brixton');
        setPreviewEvening(!previewEvening);
      }}
    >
      <span className="evening-toggle__track">
        <motion.span className="evening-toggle__knob" layout animate={{ x: previewEvening ? 16 : 0 }} />
      </span>
      {previewEvening ? 'Back to daytime' : 'Preview a Friday at 6pm'}
    </button>
  );
}

export function WineCard({ compact = false }: { compact?: boolean }) {
  const { now, wineLive } = useBranch();
  const next = upcomingDates(branches.brixton, 'wine', now, 1)[0];
  const { dow } = londonClock(now);
  const nextLabel = next
    ? wineLive
      ? `On now, until ${fmtTime(next.sessions[0].close)}`
      : next.label === 'Today'
        ? `Tonight from ${fmtTime(next.sessions[0].open)}`
        : `Next: ${next.dow === (dow + 1) % 7 ? 'tomorrow' : DAY_NAMES[next.dow]} from ${fmtTime(next.sessions[0].open)}`
    : null;
  return (
    <article className="on-card on-card--wine">
      <div className="on-card__media">
        <img src={pansyDrinks} alt="Two drinks raised over a table of brunch plates, one topped with a purple pansy" loading="lazy" width={1200} height={900} />
      </div>
      <div className="on-card__body">
        <p className="eyebrow">Brixton · Friday & Saturday</p>
        <h3>{events.wine.title}</h3>
        <p>{events.wine.body}</p>
        <p className="on-card__when">
          <Icon name="clock" /> {events.wine.when}
        </p>
        {nextLabel && <p className="field__hint">{nextLabel}</p>}
        <div className="on-card__cta">
          <Link className="btn btn--gold" to="/book?type=wine">
            Book for wine night
          </Link>
          {!compact && <EveningToggle />}
        </div>
      </div>
    </article>
  );
}

export function HireCard({ branchId }: { branchId: BranchId }) {
  const { setBranch } = useBranch();
  const copy = events.hire[branchId];
  return (
    <article className="on-card on-card--hire">
      <div className="on-card__body">
        <p className="eyebrow">{branches[branchId].short} · Private hire</p>
        <h3>{copy.title}</h3>
        <p>{copy.body}</p>
        <div className="on-card__cta">
          <Link className="btn btn--ghost" to="/book?type=hire" onClick={() => setBranch(branchId)}>
            <Icon name="people" /> Ask about hire
          </Link>
        </div>
      </div>
    </article>
  );
}

export function GardenCard() {
  return (
    <article className="on-card on-card--garden">
      <div className="on-card__media">
        <GardenSketch />
      </div>
      <div className="on-card__body">
        <p className="eyebrow">Dulwich · The garden</p>
        <h3>{events.garden.title}</h3>
        <p>{events.garden.body}</p>
        <div className="on-card__cta">
          <Link className="btn btn--gold" to="/book?type=garden">
            Ask for a garden table
          </Link>
        </div>
      </div>
    </article>
  );
}

export function WhatsOn() {
  const { branch } = useBranch();
  const brixtonFirst = branch.id === 'brixton';
  const brixton = (
    <section key="b" className="wrap whats-on__section">
      <h2 className="whats-on__label">At Brixton</h2>
      <div className="on-grid">
        <WineCard />
        <HireCard branchId="brixton" />
      </div>
    </section>
  );
  const dulwich = (
    <section key="d" className="wrap whats-on__section">
      <h2 className="whats-on__label">At Dulwich</h2>
      <div className="on-grid">
        <GardenCard />
        <HireCard branchId="dulwich" />
      </div>
    </section>
  );
  return (
    <main className="page whats-on">
      <section className="wrap page-head">
        <p className="eyebrow">What’s on</p>
        <h1>Wine nights, the garden, and the café to yourselves</h1>
        <p className="page-head__lede">
          Brunch runs every day at both. Beyond that, each Madelina has its own thing.
        </p>
        <div className="menu-page__switch">
          <BranchSwitch size="lg" id="whats-on" />
        </div>
      </section>
      {brixtonFirst ? [brixton, dulwich] : [dulwich, brixton]}
    </main>
  );
}
