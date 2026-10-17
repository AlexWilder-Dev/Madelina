import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { branches, directionsUrl, type BranchId } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { statusLine } from '../lib/status';
import { fmtTime, londonClock } from '../lib/time';

/**
 * "Brixton" and "Dulwich" as two big words with their live status.
 * Tap one to make it yours; hovering on a wide screen previews its shopfront.
 */
export function Picker({ onHover }: { onHover?: (id: BranchId | null) => void }) {
  const { branch, setBranch, status, now, evening, wineLive } = useBranch();
  const { dow, minutes } = londonClock(now);
  const wineLater = branch.hours[dow].find((s) => s.kind === 'wine' && s.open > minutes);
  const wineClose = branches.brixton.hours.flat().find((s) => s.kind === 'wine')?.close ?? 0;

  return (
    <div className="picker">
      <p className="picker__label">Choose your Madelina</p>
      <div role="radiogroup" aria-label="Choose your Madelina" onMouseLeave={() => onHover?.(null)}>
        {(['brixton', 'dulwich'] as BranchId[]).map((id) => {
          const b = branches[id];
          const on = branch.id === id;
          let line = statusLine(status[id]);
          // Previewing the evening in daytime: show it as it reads on a Friday night
          if (evening && !wineLive && id === 'brixton') line = { open: true, text: `Wine night until ${fmtTime(wineClose)}` };
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={on}
              className={`picker__row ${on ? 'is-on' : ''}`}
              onClick={() => setBranch(id)}
              onMouseEnter={() => onHover?.(id)}
              onFocus={() => onHover?.(id)}
            >
              <span className="picker__name">
                {on && <motion.span layoutId="picker-dot" className="picker__dot" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
                {b.short}
              </span>
              <span className={`picker__status ${line.open ? 'is-open' : ''}`}>
                <b>{line.text}</b>
                <small>{b.street}</small>
              </span>
            </button>
          );
        })}
      </div>
      {wineLater && !evening && <p className="picker__note">Wine night tonight from {fmtTime(wineLater.open)}.</p>}
      <div className="picker__actions">
        <a className="pill pill--solid" href={`tel:${branch.phone.tel}`}>
          Call {branch.short}
        </a>
        <a className="pill" href={directionsUrl(branch)} target="_blank" rel="noreferrer">
          Directions
        </a>
        <Link className="pill" to={evening ? '/book?type=wine' : '/book'}>
          Book
        </Link>
      </div>
    </div>
  );
}
