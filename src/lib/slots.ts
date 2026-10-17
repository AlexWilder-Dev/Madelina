import type { Branch, Session } from '../data/madelina';
import { fmtTime, londonClock } from './time';

export type SlotKind = 'day' | 'wine' | 'any';

export type DateOption = { iso: string; dow: number; label: string; sessions: Session[] };

const dayLabel = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
const londonIso = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Europe/London' });

/** The next `count` dates (London) on which this branch has sessions of the given kind. */
export function upcomingDates(branch: Branch, kind: SlotKind, from: Date, count = 8): DateOption[] {
  const out: DateOption[] = [];
  const { minutes: nowMin } = londonClock(from);
  // Step through calendar days at UTC noon so clock changes can't skip or repeat a date
  const [y, m, dd] = londonIso.format(from).split('-').map(Number);
  for (let i = 0; i < 45 && out.length < count; i++) {
    const d = new Date(Date.UTC(y, m - 1, dd + i, 12));
    const dow = d.getUTCDay();
    let sessions = branch.hours[dow].filter((s) => kind === 'any' || s.kind === kind);
    // Today only counts if there's at least an hour left to book into
    if (i === 0) sessions = sessions.filter((s) => s.close - 60 > nowMin);
    if (!sessions.length) continue;
    out.push({
      iso: d.toISOString().slice(0, 10),
      dow,
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayLabel.format(d),
      sessions,
    });
  }
  return out;
}

/** Half-hourly arrival times, stopping an hour before close. */
export function timesFor(sessions: Session[], isToday: boolean, from: Date): { value: number; label: string }[] {
  const { minutes: nowMin } = londonClock(from);
  const out: { value: number; label: string }[] = [];
  for (const s of sessions) {
    for (let t = s.open; t <= s.close - 60; t += 30) {
      if (isToday && t <= nowMin + 15) continue;
      out.push({ value: t, label: fmtTime(t) });
    }
  }
  return out;
}

export function longDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, d, 12)),
  );
}
