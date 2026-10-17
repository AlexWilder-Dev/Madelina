import type { Branch } from '../data/madelina';
import { useBranch } from '../lib/branch';
import { DAY_NAMES, fmtSession, londonClock } from '../lib/time';

// Monday first, the way people read a week
const WEEK = [1, 2, 3, 4, 5, 6, 0];

export function HoursTable({ branch }: { branch: Branch }) {
  const { now } = useBranch();
  const today = londonClock(now).dow;
  return (
    <table className="hours">
      <caption className="visually-hidden">Opening hours, {branch.name}</caption>
      <tbody>
        {WEEK.map((d) => {
          const sessions = branch.hours[d];
          return (
            <tr key={d} className={d === today ? 'is-today' : ''}>
              <th scope="row">
                {DAY_NAMES[d]}
                {d === today && <span className="hours__today">today</span>}
              </th>
              <td>
                {sessions.length === 0
                  ? 'Closed'
                  : sessions.map((s, i) => (
                      <span key={i} className={`hours__session hours__session--${s.kind}`}>
                        {fmtSession(s)}
                        {s.kind === 'wine' && <em> wine night</em>}
                      </span>
                    ))}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
