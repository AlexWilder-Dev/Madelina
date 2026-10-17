import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { branches, directionsUrl, type BranchId } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { statusLine } from '../lib/status';
import { fmtTime, londonClock } from '../lib/time';

/**
 * Both cafés on two lines, like the hours on a door: which is open, until when.
 * Tap one to make it yours; the rest of the site follows.
 */
export function Board() {
  const { branch, setBranch, status, now, evening, wineLive } = useBranch();
  const { dow, minutes } = londonClock(now);
  const wineLater = branch.hours[dow].find((s) => s.kind === 'wine' && s.open > minutes);
  const wineClose = branches.brixton.hours.flat().find((s) => s.kind === 'wine')?.close ?? 0;

  return (
    <div className="board">
      <div className="board__rows" role="radiogroup" aria-label="Choose your Madelina">
        {(['brixton', 'dulwich'] as BranchId[]).map((id) => {
          const b = branches[id];
          const on = branch.id === id;
          let line = statusLine(status[id]);
          // Previewing the evening in daytime: show it as it reads on a Friday night
          if (evening && !wineLive && id === 'brixton') line = { open: true, text: `Wine night until ${fmtTime(wineClose)}` };
          return (
            <button key={id} type="button" role="radio" aria-checked={on} className={`board__row ${on ? 'is-on' : ''}`} onClick={() => setBranch(id)}>
              {on && <motion.span layoutId="board-mark" className="board__mark" transition={{ type: 'spring', stiffness: 420, damping: 40 }} />}
              <span className="board__name">{b.short}</span>
              <span className="board__street">{b.street}</span>
              <span className={`board__status ${line.open ? 'is-open' : ''}`}>{line.text}</span>
            </button>
          );
        })}
      </div>
      {wineLater && !evening && <p className="board__note">Wine night tonight from {fmtTime(wineLater.open)}.</p>}
      <p className="board__links">
        <a href={`tel:${branch.phone.tel}`}>Call {branch.short}</a>
        <a href={directionsUrl(branch)} target="_blank" rel="noreferrer">
          Directions
        </a>
        <Link to="/menu">Menu</Link>
        <Link to={evening ? '/book?type=wine' : '/book'}>Book</Link>
      </p>
    </div>
  );
}
