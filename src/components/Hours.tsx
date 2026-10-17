import type { Branch, Session } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { DAY_SHORT, fmtSession, londonClock } from '../lib/time';

const WEEK = [1, 2, 3, 4, 5, 6, 0];

const key = (s: Session[]) => s.map((x) => `${x.open}-${x.close}-${x.kind}`).join('|');

/** The week in as few lines as it takes: consecutive days with the same hours share a line. */
export function Hours({ branch }: { branch: Branch }) {
  const { now } = useBranch();
  const today = londonClock(now).dow;
  const rows: { days: number[]; sessions: Session[] }[] = [];
  for (const d of WEEK) {
    const last = rows[rows.length - 1];
    if (last && key(last.sessions) === key(branch.hours[d])) last.days.push(d);
    else rows.push({ days: [d], sessions: branch.hours[d] });
  }
  return (
    <dl className="hours">
      {rows.map((r) => {
        const label = r.days.length > 1 ? `${DAY_SHORT[r.days[0]]}–${DAY_SHORT[r.days[r.days.length - 1]]}` : DAY_SHORT[r.days[0]];
        return (
          <div key={label} className={r.days.includes(today) ? 'is-today' : ''}>
            <dt>{label}</dt>
            <dd>
              {r.sessions.length === 0
                ? 'Closed'
                : r.sessions.map((s, i) => (
                    <span key={i}>
                      {i > 0 && ', '}
                      {fmtSession(s)}
                      {s.kind === 'wine' && ' wine night'}
                    </span>
                  ))}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
