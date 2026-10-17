import type { Branch, Session } from '../data/madelina';

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const londonParts = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** Day of week (0 = Sunday) and minutes since midnight, in London. */
export function londonClock(date: Date): { dow: number; minutes: number } {
  const parts = londonParts.formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const dow = DAY_SHORT.indexOf(get('weekday'));
  return { dow, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

/** 480 -> "8am", 1380 -> "11pm", 570 -> "9.30am" (British style). */
export function fmtTime(minutes: number): string {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const suffix = h24 < 12 ? 'am' : 'pm';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return m ? `${h12}.${String(m).padStart(2, '0')}${suffix}` : `${h12}${suffix}`;
}

export function fmtSession(s: Session): string {
  return `${fmtTime(s.open)}–${fmtTime(s.close)}`;
}

export type Status =
  | { open: true; session: Session; closesIn: number; next?: { session: Session; sameDay: true } }
  | { open: false; next: { session: Session; dow: number; daysAway: number } | null };

export function branchStatus(branch: Branch, date: Date): Status {
  const { dow, minutes } = londonClock(date);
  const today = branch.hours[dow];
  const current = today.find((s) => minutes >= s.open && minutes < s.close);
  if (current) {
    const later = today.find((s) => s.open >= current.close);
    return {
      open: true,
      session: current,
      closesIn: current.close - minutes,
      next: later ? { session: later, sameDay: true } : undefined,
    };
  }
  for (let i = 0; i < 8; i++) {
    const d = (dow + i) % 7;
    const candidates = branch.hours[d].filter((s) => i > 0 || s.open > minutes);
    if (candidates.length) return { open: false, next: { session: candidates[0], dow: d, daysAway: i } };
  }
  return { open: false, next: null };
}

/** "today", "tomorrow" or the weekday name. */
export function whenLabel(daysAway: number, dow: number): string {
  if (daysAway === 0) return 'today';
  if (daysAway === 1) return 'tomorrow';
  return DAY_NAMES[dow];
}

/** The wine session running now, or later today, at this branch. */
export function wineToday(branch: Branch, date: Date): { session: Session; now: boolean } | null {
  const { dow, minutes } = londonClock(date);
  const s = branch.hours[dow].find((x) => x.kind === 'wine' && minutes < x.close);
  return s ? { session: s, now: minutes >= s.open } : null;
}
